// ─────────────────────────────────────────────────────────────────────────────
// Visit registrations (single-page form, no slot assignment).
// Stored in localStorage. Independent of the parking_sessions data model.
// ─────────────────────────────────────────────────────────────────────────────

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

function load(): VisitRow[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as VisitRow[];
  } catch { /* ignore */ }
  return [];
}
function save(rows: VisitRow[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch { /* ignore */ }
}

function genVisitNumber(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `VST-${mm}${yy}-${seq}`;
}

export function registerVisit(input: VisitInput): VisitRow {
  const rows = load();
  const row: VisitRow = {
    id: `V${Date.now()}${Math.floor(Math.random() * 1000)}`,
    visitNumber: genVisitNumber(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    plate: input.plate.trim(),
    visitDate: input.visitDate,
    createdAt: new Date().toISOString(),
    checkedOutAt: null,
  };
  rows.push(row);
  save(rows);
  return row;
}

export function getVisits(): VisitRow[] {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getVisitByNumber(visitNumber: string): VisitRow | undefined {
  return load().find((v) => v.visitNumber.toLowerCase() === visitNumber.trim().toLowerCase());
}

export function checkoutVisit(visitNumber: string): void {
  const rows = load();
  const row = rows.find((v) => v.visitNumber === visitNumber);
  if (row && !row.checkedOutAt) {
    row.checkedOutAt = new Date().toISOString();
    save(rows);
  }
}
