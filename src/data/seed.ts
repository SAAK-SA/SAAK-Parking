import type { Employee } from '../types/parking';

// Single factory building
export const FACTORY = { id: 'factory' as const, name: 'Factory', nameAr: 'المصنع' };

export type SlotKind = 'employee' | 'visitor' | 'heavy';
export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'visitor' | 'disabled';

export const zoneMeta: Record<string, { name: string; nameAr: string; kind: SlotKind }> = {
  D: { name: 'Zone D – Employees', nameAr: 'منطقة د – موقف الموظفين', kind: 'employee' },
  E: { name: 'Zone E – Visitors', nameAr: 'منطقة هـ – موقف الزوار', kind: 'visitor' },
  F: { name: 'Zone F – Heavy Vehicles', nameAr: 'منطقة و – مركبات ثقيلة', kind: 'heavy' },
};
export const zoneOrder = ['D', 'E', 'F'];
export const VISITOR_ZONE = 'E';

/** A parking slot as stored in the database / local store. */
export interface SlotRow {
  number: string;
  zone: string;
  building: string;
  kind: SlotKind;
  status: SlotStatus;
  occupant_name: string | null;
  occupant_plate: string | null;
  occupant_type: 'employee' | 'visitor' | null;
  since: string | null;
}

/** An entry/exit session for the daily report. */
export interface SessionRow {
  id: string;
  kind: 'employee' | 'visitor';
  emp_id: string | null;
  name: string;
  company: string | null;
  mobile: string | null;
  plate: string;
  slot: string;
  building: string;
  entry_at: string;
  exit_at: string | null;
}

// ─── Seed employees ───────────────────────────────────────────────────────────

export const seedEmployees: Employee[] = [
  { id: 'EMP006', nameAr: 'خالد إبراهيم المطيري', department: 'الإنتاج', buildingId: 'factory', assignedSlot: 'D01', plate: 'ع ف ص ١١٢٢' },
  { id: 'EMP007', nameAr: 'سارة عمر الدوسري', department: 'الجودة', buildingId: 'factory', assignedSlot: 'D02', plate: 'ق ر ش ٣٣٤٤' },
  { id: 'EMP008', nameAr: 'عمر حسن البلوي', department: 'الصيانة', buildingId: 'factory', assignedSlot: 'D03', plate: 'ت ث خ ٥٥٦٦' },
  { id: 'EMP009', nameAr: 'ريم ناصر العتيبي', department: 'السلامة', buildingId: 'factory', assignedSlot: 'D04', plate: 'ذ ض ظ ٧٧٨٨' },
];

// ─── Seed slots ───────────────────────────────────────────────────────────────

function make(zone: string, count: number, kind: SlotKind): SlotRow[] {
  return Array.from({ length: count }, (_, i) => ({
    number: `${zone}${String(i + 1).padStart(2, '0')}`,
    zone,
    building: 'factory',
    kind,
    status: 'available' as SlotStatus,
    occupant_name: null,
    occupant_plate: null,
    occupant_type: null,
    since: null,
  }));
}

type Override = Partial<Pick<SlotRow, 'status' | 'occupant_name' | 'occupant_plate' | 'occupant_type' | 'since'>>;

export function seedSlots(): SlotRow[] {
  const rows = [...make('D', 18, 'employee'), ...make('E', 8, 'visitor'), ...make('F', 4, 'heavy')];

  const overrides: Record<string, Override> = {
    D01: { status: 'occupied', occupant_name: 'خالد إبراهيم المطيري', occupant_plate: 'ع ف ص ١١٢٢', occupant_type: 'employee', since: '06:50' },
    D02: { status: 'occupied', occupant_name: 'سارة عمر الدوسري', occupant_plate: 'ق ر ش ٣٣٤٤', occupant_type: 'employee', since: '07:00' },
    D03: { status: 'occupied', occupant_name: 'عمر حسن البلوي', occupant_plate: 'ت ث خ ٥٥٦٦', occupant_type: 'employee', since: '07:15' },
    D04: { status: 'occupied', occupant_name: 'ريم ناصر العتيبي', occupant_plate: 'ذ ض ظ ٧٧٨٨', occupant_type: 'employee', since: '07:30' },
    E01: { status: 'visitor', occupant_name: 'ناصر القرني', occupant_plate: 'هـ و ٦٦٧٧', occupant_type: 'visitor', since: '08:30' },
    F03: { status: 'disabled' },
    F04: { status: 'disabled' },
  };

  return rows.map((r) => (overrides[r.number] ? { ...r, ...overrides[r.number] } : r));
}
