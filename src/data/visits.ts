// ─────────────────────────────────────────────────────────────────────────────
// Visit registrations (single-page form, no slot assignment).
//
// Uses Supabase (shared, cross-device) when VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY are configured — required for the QR code / visit
// status page to work when scanned from a different device than the one
// that registered the visit. Falls back to localStorage (single-device
// only) when Supabase isn't configured.
// ─────────────────────────────────────────────────────────────────────────────

import { isCloud, sbSelect, sbInsert, sbUpdate } from '../lib/cloud';

export interface VisitRow {
  id: string;
  visitNumber: string;
  name: string;
  phone: string;
  plate: string;
  visitDate: string;
  createdAt: string;
  checkedOutAt: string | null;
}

export interface VisitInput {
  name: string;
  phone: string;
  plate: string;
  visitDate: string;
}

const LS_KEY = 'saak_visits_v1';

function loadLocal(): VisitRow[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as VisitRow[];
  } catch { /* ignore */ }
  return [];
}
function saveLocal(rows: VisitRow[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch { /* ignore */ }
}

function genVisitNumber(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `VST-${mm}${yy}-${seq}`;
}

// ── Cloud row shape (snake_case columns) ────────────────────────────────────

interface CloudVisitRow {
  id: string;
  visit_number: string;
  name: string;
  phone: string;
  plate: string;
  visit_date: string;
  created_at: string;
  checked_out_at: string | null;
}

function fromCloud(r: CloudVisitRow): VisitRow {
  return {
    id: r.id,
    visitNumber: r.visit_number,
    name: r.name,
    phone: r.phone,
    plate: r.plate,
    visitDate: r.visit_date,
    createdAt: r.created_at,
    checkedOutAt: r.checked_out_at,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function registerVisit(input: VisitInput): Promise<VisitRow> {
  const visitNumber = genVisitNumber();

  if (isCloud) {
    const row = await sbInsert<CloudVisitRow>('visits', {
      visit_number: visitNumber,
      name: input.name.trim(),
      phone: input.phone.trim(),
      plate: input.plate.trim(),
      visit_date: input.visitDate,
    });
    return fromCloud(row);
  }

  const row: VisitRow = {
    id: `V${Date.now()}${Math.floor(Math.random() * 1000)}`,
    visitNumber,
    name: input.name.trim(),
    phone: input.phone.trim(),
    plate: input.plate.trim(),
    visitDate: input.visitDate,
    createdAt: new Date().toISOString(),
    checkedOutAt: null,
  };
  const rows = loadLocal();
  rows.push(row);
  saveLocal(rows);
  return row;
}

export async function getVisits(): Promise<VisitRow[]> {
  if (isCloud) {
    const rows = await sbSelect<CloudVisitRow>('visits', 'order=created_at.desc');
    return rows.map(fromCloud);
  }
  return loadLocal().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getVisitByNumber(visitNumber: string): Promise<VisitRow | undefined> {
  const q = visitNumber.trim();
  if (isCloud) {
    const rows = await sbSelect<CloudVisitRow>('visits', `visit_number=ilike.${encodeURIComponent(q)}&limit=1`);
    return rows[0] ? fromCloud(rows[0]) : undefined;
  }
  return loadLocal().find((v) => v.visitNumber.toLowerCase() === q.toLowerCase());
}

export async function checkoutVisit(visitNumber: string): Promise<void> {
  if (isCloud) {
    await sbUpdate('visits', `visit_number=eq.${encodeURIComponent(visitNumber)}&checked_out_at=is.null`, {
      checked_out_at: new Date().toISOString(),
    });
    return;
  }
  const rows = loadLocal();
  const row = rows.find((v) => v.visitNumber === visitNumber);
  if (row && !row.checkedOutAt) {
    row.checkedOutAt = new Date().toISOString();
    saveLocal(rows);
  }
}
