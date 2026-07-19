import type { ParkingSlot, ParkingZone, BuildingData, Employee, KPIStat, RecentEvent, BuildingId } from '../types/parking';

// ─── Slot builder ────────────────────────────────────────────────────────────

function makeSlots(
  zone: string,
  buildingId: BuildingId,
  count: number,
  overrides: Partial<Record<number, Partial<ParkingSlot>>> = {},
): ParkingSlot[] {
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const base: ParkingSlot = {
      id: `${zone}${num}`,
      number: `${zone}${String(num).padStart(2, '0')}`,
      status: 'available',
      zone,
      buildingId,
      floor: 1,
    };
    return { ...base, ...(overrides[num] ?? {}) };
  });
}

// ─── Employees ────────────────────────────────────────────────────────────────

export const employees: Employee[] = [
  { id: 'EMP001', nameAr: 'أحمد محمد الزهراني', department: 'الموارد البشرية', buildingId: 'admin', assignedSlot: 'A01', plate: 'أ ب ج ١٢٣٤' },
  { id: 'EMP002', nameAr: 'فاطمة علي الشمري', department: 'المالية', buildingId: 'admin', assignedSlot: 'A02', plate: 'د هـ و ٥٦٧٨' },
  { id: 'EMP003', nameAr: 'محمد عبدالله القحطاني', department: 'تقنية المعلومات', buildingId: 'admin', assignedSlot: 'A03', plate: 'ز ح ط ٩٠١٢' },
  { id: 'EMP004', nameAr: 'نورة سعد الغامدي', department: 'التسويق', buildingId: 'admin', assignedSlot: 'C01', plate: 'ي ك ل ٣٤٥٦' },
  { id: 'EMP005', nameAr: 'عبدالرحمن الحربي', department: 'الإدارة العليا', buildingId: 'admin', assignedSlot: 'C02', plate: 'م ن س ٧٨٩٠' },
  { id: 'EMP006', nameAr: 'خالد إبراهيم المطيري', department: 'الإنتاج', buildingId: 'factory', assignedSlot: 'D01', plate: 'ع ف ص ١١٢٢' },
  { id: 'EMP007', nameAr: 'سارة عمر الدوسري', department: 'الجودة', buildingId: 'factory', assignedSlot: 'D02', plate: 'ق ر ش ٣٣٤٤' },
  { id: 'EMP008', nameAr: 'عمر حسن البلوي', department: 'الصيانة', buildingId: 'factory', assignedSlot: 'D03', plate: 'ت ث خ ٥٥٦٦' },
  { id: 'EMP009', nameAr: 'ريم ناصر العتيبي', department: 'السلامة', buildingId: 'factory', assignedSlot: 'D04', plate: 'ذ ض ظ ٧٧٨٨' },
];

// ─── Buildings ────────────────────────────────────────────────────────────────

const adminZones: ParkingZone[] = [
  {
    id: 'A',
    name: 'Zone A – Employees',
    nameAr: 'منطقة أ – موقف الموظفين',
    buildingId: 'admin',
    slots: makeSlots('A', 'admin', 15, {
      1: { status: 'occupied', occupant: { name: 'أحمد محمد الزهراني', type: 'employee', plate: 'أ ب ج ١٢٣٤', since: '07:45', employeeId: 'EMP001' } },
      2: { status: 'occupied', occupant: { name: 'فاطمة علي الشمري', type: 'employee', plate: 'د هـ و ٥٦٧٨', since: '08:10', employeeId: 'EMP002' } },
      3: { status: 'occupied', occupant: { name: 'محمد عبدالله القحطاني', type: 'employee', plate: 'ز ح ط ٩٠١٢', since: '08:30', employeeId: 'EMP003' } },
      5: { status: 'occupied', occupant: { name: 'بدر الرشيدي', type: 'employee', plate: 'ص ع غ ٤٤٥٥', since: '08:55', employeeId: 'EMP010' } },
      7: { status: 'occupied', occupant: { name: 'هند الجهني', type: 'employee', plate: 'ف ق ك ٢٢٣٣', since: '09:05', employeeId: 'EMP011' } },
    }),
  },
  {
    id: 'B',
    name: 'Zone B – Visitors',
    nameAr: 'منطقة ب – موقف الزوار',
    buildingId: 'admin',
    slots: makeSlots('B', 'admin', 10, {
      1: { status: 'visitor', occupant: { name: 'سلطان العمري', type: 'visitor', plate: 'ل م ن ٩٩٠٠', since: '09:20', company: 'شركة الفيصل' } },
      2: { status: 'visitor', occupant: { name: 'مريم الخالدي', type: 'visitor', plate: 'هـ و ز ١١٢٢', since: '09:45', company: 'مؤسسة الريادة' } },
      3: { status: 'disabled' },
    }),
  },
  {
    id: 'C',
    name: 'Zone C – VIP',
    nameAr: 'منطقة ج – VIP',
    buildingId: 'admin',
    slots: makeSlots('C', 'admin', 5, {
      1: { status: 'reserved', occupant: { name: 'نورة سعد الغامدي', type: 'employee', plate: 'ي ك ل ٣٤٥٦', since: '07:30', employeeId: 'EMP004' } },
      2: { status: 'reserved', occupant: { name: 'عبدالرحمن الحربي', type: 'employee', plate: 'م ن س ٧٨٩٠', since: '07:20', employeeId: 'EMP005' } },
      3: { status: 'reserved' },
    }),
  },
];

const factoryZones: ParkingZone[] = [
  {
    id: 'D',
    name: 'Zone D – Employees',
    nameAr: 'منطقة د – موقف الموظفين',
    buildingId: 'factory',
    slots: makeSlots('D', 'factory', 18, {
      1: { status: 'occupied', occupant: { name: 'خالد إبراهيم المطيري', type: 'employee', plate: 'ع ف ص ١١٢٢', since: '06:50', employeeId: 'EMP006' } },
      2: { status: 'occupied', occupant: { name: 'سارة عمر الدوسري', type: 'employee', plate: 'ق ر ش ٣٣٤٤', since: '07:00', employeeId: 'EMP007' } },
      3: { status: 'occupied', occupant: { name: 'عمر حسن البلوي', type: 'employee', plate: 'ت ث خ ٥٥٦٦', since: '07:15', employeeId: 'EMP008' } },
      4: { status: 'occupied', occupant: { name: 'ريم ناصر العتيبي', type: 'employee', plate: 'ذ ض ظ ٧٧٨٨', since: '07:30', employeeId: 'EMP009' } },
      6: { status: 'occupied', occupant: { name: 'فهد الزيد', type: 'employee', plate: 'أ ب ٢٢٣٣', since: '07:45', employeeId: 'EMP012' } },
      8: { status: 'occupied', occupant: { name: 'أسماء السالم', type: 'employee', plate: 'ج د ٤٤٥٥', since: '08:00', employeeId: 'EMP013' } },
    }),
  },
  {
    id: 'E',
    name: 'Zone E – Visitors',
    nameAr: 'منطقة هـ – موقف الزوار',
    buildingId: 'factory',
    slots: makeSlots('E', 'factory', 8, {
      1: { status: 'visitor', occupant: { name: 'ناصر القرني', type: 'visitor', plate: 'هـ و ٦٦٧٧', since: '08:30', company: 'مصنع النور' } },
    }),
  },
  {
    id: 'F',
    name: 'Zone F – Heavy Vehicles',
    nameAr: 'منطقة و – مركبات ثقيلة',
    buildingId: 'factory',
    slots: makeSlots('F', 'factory', 4, {
      3: { status: 'disabled' },
      4: { status: 'disabled' },
    }),
  },
];

export const buildings: BuildingData[] = [
  { id: 'admin', name: 'Administration Building', nameAr: 'مبنى الإدارة', zones: adminZones },
  { id: 'factory', name: 'Factory', nameAr: 'المصنع', zones: factoryZones },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getBuilding(id: BuildingId): BuildingData {
  return buildings.find((b) => b.id === id)!;
}

export function getBuildingZones(id: BuildingId): ParkingZone[] {
  return getBuilding(id).zones;
}

export function getBuildingStats(id: BuildingId): KPIStat[] {
  const zones = getBuildingZones(id);
  const allSlots: ParkingSlot[] = zones.flatMap((z) => z.slots);
  const total = allSlots.length;
  const count = (s: ParkingSlot['status']) => allSlots.filter((sl) => sl.status === s).length;

  const available = count('available');
  const occupied = count('occupied');
  const reserved = count('reserved');
  const visitor = count('visitor');
  const disabled = count('disabled');

  return [
    { id: 'total', labelAr: 'إجمالي المواقف', labelEn: 'Total Slots', value: total, icon: 'LayoutGrid', color: 'navy' },
    { id: 'available', labelAr: 'متاح', labelEn: 'Available', value: available, total, percentage: Math.round((available / total) * 100), trend: 3, icon: 'CheckCircle', color: 'green' },
    { id: 'occupied', labelAr: 'مشغول – موظفون', labelEn: 'Occupied – Employees', value: occupied, total, percentage: Math.round((occupied / total) * 100), icon: 'Users', color: 'navy' },
    { id: 'visitor', labelAr: 'مشغول – زوار', labelEn: 'Occupied – Visitors', value: visitor, total, percentage: Math.round((visitor / total) * 100), trend: -1, icon: 'UserCheck', color: 'gold' },
    { id: 'disabled', labelAr: 'خارج الخدمة', labelEn: 'Out of Service', value: disabled + reserved, total, percentage: Math.round(((disabled + reserved) / total) * 100), icon: 'AlertTriangle', color: 'gray' },
  ];
}

export function findEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id.toLowerCase() === id.toLowerCase());
}

export function getFirstAvailableVisitorSlot(buildingId: BuildingId): ParkingSlot | undefined {
  const zones = getBuildingZones(buildingId);
  const visitorZone = zones.find((z) => z.id === (buildingId === 'admin' ? 'B' : 'E'));
  return visitorZone?.slots.find((s) => s.status === 'available');
}

// ─── Legacy exports for existing components ───────────────────────────────────

export const recentEvents: RecentEvent[] = [
  { id: '1', type: 'entry', descriptionAr: 'دخول موظف', plate: 'أ ب ج ١٢٣٤', slot: 'A01', time: '09:42' },
  { id: '2', type: 'exit', descriptionAr: 'خروج زائر', plate: 'ل م ن ٩٩٠٠', slot: 'B02', time: '09:38' },
  { id: '3', type: 'entry', descriptionAr: 'دخول زائر', plate: 'هـ و ز ١١٢٢', slot: 'B03', time: '09:31' },
  { id: '4', type: 'alert', descriptionAr: 'موقف خارج الخدمة', plate: '—', slot: 'F03', time: '08:55' },
  { id: '5', type: 'entry', descriptionAr: 'دخول VIP', plate: 'م ن س ٧٨٩٠', slot: 'C02', time: '07:20' },
  { id: '6', type: 'exit', descriptionAr: 'خروج موظف', plate: 'د هـ و ٥٦٧٨', slot: 'A02', time: '07:10' },
];
