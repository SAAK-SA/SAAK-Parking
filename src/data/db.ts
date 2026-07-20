import type { ParkingZone, ParkingSlot, Employee, KPIStat, BuildingId } from '../types/parking';
import {
  FACTORY, zoneMeta, zoneOrder, VISITOR_ZONE,
  seedSlots, seedEmployees,
  type SlotRow, type SessionRow,
} from './seed';
import { isCloud, sbSelect, sbInsert, sbUpdate } from '../lib/cloud';

export { FACTORY };
export const usingCloud = isCloud;

export interface VisitorForm {
  name: string;
  company: string;
  mobile: string;
  plate: string;
}

// ─── Converters ───────────────────────────────────────────────────────────────

function toSlot(r: SlotRow): ParkingSlot {
  return {
    id: r.number,
    number: r.number,
    status: r.status,
    zone: r.zone,
    buildingId: r.building as BuildingId,
    floor: 1,
    occupant: r.occupant_name
      ? {
          name: r.occupant_name,
          type: r.occupant_type ?? 'visitor',
          plate: r.occupant_plate ?? '',
          since: r.since ?? '',
        }
      : undefined,
  };
}

export function toZones(rows: SlotRow[]): ParkingZone[] {
  return zoneOrder
    .map((zid) => {
      const meta = zoneMeta[zid];
      const slots = rows.filter((r) => r.zone === zid).map(toSlot);
      return { id: zid, name: meta.name, nameAr: meta.nameAr, buildingId: 'factory' as BuildingId, slots };
    })
    .filter((z) => z.slots.length > 0);
}

export function computeStats(rows: SlotRow[]): KPIStat[] {
  const total = rows.length || 1;
  const count = (s: SlotRow['status']) => rows.filter((r) => r.status === s).length;
  const available = count('available');
  const occupied = count('occupied');
  const reserved = count('reserved');
  const visitor = count('visitor');
  const disabled = count('disabled');
  const pct = (n: number) => Math.round((n / total) * 100);

  return [
    { id: 'total', labelAr: 'إجمالي المواقف', labelEn: 'Total Slots', value: rows.length, icon: 'LayoutGrid', color: 'navy' },
    { id: 'available', labelAr: 'متاح', labelEn: 'Available', value: available, total: rows.length, percentage: pct(available), icon: 'CheckCircle', color: 'green' },
    { id: 'occupied', labelAr: 'مشغول – موظفون', labelEn: 'Occupied – Employees', value: occupied, total: rows.length, percentage: pct(occupied), icon: 'Users', color: 'navy' },
    { id: 'visitor', labelAr: 'مشغول – زوار', labelEn: 'Occupied – Visitors', value: visitor, total: rows.length, percentage: pct(visitor), icon: 'UserCheck', color: 'gold' },
    { id: 'disabled', labelAr: 'خارج الخدمة', labelEn: 'Out of Service', value: disabled + reserved, total: rows.length, percentage: pct(disabled + reserved), icon: 'AlertTriangle', color: 'gray' },
  ];
}

function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}
function todayStartISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ─── Local backend (single-device fallback) ──────────────────────────────────

const LS_KEY = 'saak_db_v2';

interface LocalState {
  slots: SlotRow[];
  sessions: SessionRow[];
  employees: Employee[];
}

function loadLocal(): LocalState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as LocalState;
  } catch { /* ignore */ }
  const fresh: LocalState = { slots: seedSlots(), sessions: [], employees: seedEmployees };
  saveLocal(fresh);
  return fresh;
}
function saveLocal(s: LocalState): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
let local = loadLocal();

/** Reset the local store to seed data (has no effect in cloud mode). */
export function resetData(): void {
  local = { slots: seedSlots(), sessions: [], employees: seedEmployees };
  saveLocal(local);
}

function uid(): string {
  return `S${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSlots(): Promise<SlotRow[]> {
  if (isCloud) return sbSelect<SlotRow>('parking_slots', 'order=number.asc');
  return local.slots;
}

export async function getZones(): Promise<ParkingZone[]> {
  return toZones(await getSlots());
}

export async function getStats(): Promise<KPIStat[]> {
  return computeStats(await getSlots());
}

export async function getEmployees(): Promise<Employee[]> {
  if (isCloud) {
    const rows = await sbSelect<Record<string, string>>('employees', 'order=id.asc');
    return rows.map((r) => ({
      id: r.id,
      nameAr: r.name,
      department: r.department,
      buildingId: (r.building as BuildingId) ?? 'factory',
      assignedSlot: r.assigned_slot,
      plate: r.plate,
    }));
  }
  return local.employees;
}

export async function findEmployee(id: string): Promise<Employee | undefined> {
  const all = await getEmployees();
  return all.find((e) => e.id.toLowerCase() === id.trim().toLowerCase());
}

export async function getOpenSessionForEmployee(empId: string): Promise<SessionRow | undefined> {
  if (isCloud) {
    const rows = await sbSelect<SessionRow>('parking_sessions', `emp_id=eq.${empId}&exit_at=is.null&limit=1`);
    return rows[0];
  }
  return local.sessions.find((s) => s.emp_id === empId && !s.exit_at);
}

export async function getOpenSessionForSlot(slot: string): Promise<SessionRow | undefined> {
  if (isCloud) {
    const rows = await sbSelect<SessionRow>('parking_sessions', `slot=eq.${slot}&exit_at=is.null&limit=1`);
    return rows[0];
  }
  return local.sessions.find((s) => s.slot === slot && !s.exit_at);
}

/** Employee arrives: occupy their assigned slot and open a session. */
export async function employeeCheckIn(emp: Employee): Promise<{ slot: string }> {
  const slot = emp.assignedSlot;
  const since = nowTime();
  if (isCloud) {
    await sbUpdate('parking_slots', `number=eq.${slot}`, {
      status: 'occupied', occupant_name: emp.nameAr, occupant_plate: emp.plate, occupant_type: 'employee', since,
    });
    await sbInsert('parking_sessions', {
      kind: 'employee', emp_id: emp.id, name: emp.nameAr, plate: emp.plate, slot, building: 'factory',
    });
  } else {
    const row = local.slots.find((r) => r.number === slot);
    if (row) { row.status = 'occupied'; row.occupant_name = emp.nameAr; row.occupant_plate = emp.plate; row.occupant_type = 'employee'; row.since = since; }
    local.sessions.push({
      id: uid(), kind: 'employee', emp_id: emp.id, name: emp.nameAr, company: null, mobile: null,
      plate: emp.plate, slot, building: 'factory', entry_at: new Date().toISOString(), exit_at: null,
    });
    saveLocal(local);
  }
  return { slot };
}

/** Anyone leaves: free the slot and close its open session. */
export async function checkoutSlot(slot: string): Promise<void> {
  if (isCloud) {
    await sbUpdate('parking_sessions', `slot=eq.${slot}&exit_at=is.null`, { exit_at: new Date().toISOString() });
    await sbUpdate('parking_slots', `number=eq.${slot}`, {
      status: 'available', occupant_name: null, occupant_plate: null, occupant_type: null, since: null,
    });
  } else {
    const s = local.sessions.find((x) => x.slot === slot && !x.exit_at);
    if (s) s.exit_at = new Date().toISOString();
    const row = local.slots.find((r) => r.number === slot);
    if (row) { row.status = 'available'; row.occupant_name = null; row.occupant_plate = null; row.occupant_type = null; row.since = null; }
    saveLocal(local);
  }
}

/** Visitor arrives: grab the first free visitor slot (any number) and open a session. */
export async function visitorCheckIn(form: VisitorForm): Promise<{ slot: string } | null> {
  const since = nowTime();
  if (isCloud) {
    const free = await sbSelect<SlotRow>('parking_slots', `zone=eq.${VISITOR_ZONE}&status=eq.available&order=number.asc&limit=1`);
    const slot = free[0]?.number;
    if (!slot) return null;
    await sbUpdate('parking_slots', `number=eq.${slot}`, {
      status: 'visitor', occupant_name: form.name, occupant_plate: form.plate, occupant_type: 'visitor', since,
    });
    await sbInsert('parking_sessions', {
      kind: 'visitor', name: form.name, company: form.company || null, mobile: form.mobile, plate: form.plate, slot, building: 'factory',
    });
    return { slot };
  }
  const row = local.slots.find((r) => r.zone === VISITOR_ZONE && r.status === 'available');
  if (!row) return null;
  row.status = 'visitor'; row.occupant_name = form.name; row.occupant_plate = form.plate; row.occupant_type = 'visitor'; row.since = since;
  local.sessions.push({
    id: uid(), kind: 'visitor', emp_id: null, name: form.name, company: form.company || null, mobile: form.mobile,
    plate: form.plate, slot: row.number, building: 'factory', entry_at: new Date().toISOString(), exit_at: null,
  });
  saveLocal(local);
  return { slot: row.number };
}

export async function getSessions(opts: { todayOnly?: boolean } = {}): Promise<SessionRow[]> {
  if (isCloud) {
    const filter = opts.todayOnly ? `entry_at=gte.${todayStartISO()}&` : '';
    return sbSelect<SessionRow>('parking_sessions', `${filter}order=entry_at.desc`);
  }
  let rows = [...local.sessions];
  if (opts.todayOnly) {
    const start = todayStartISO();
    rows = rows.filter((s) => s.entry_at >= start);
  }
  return rows.sort((a, b) => b.entry_at.localeCompare(a.entry_at));
}
