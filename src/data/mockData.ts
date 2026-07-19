import type { ParkingSlot, ParkingZone, KPIStat, RecentEvent } from '../types/parking';

const makeSlots = (
  zone: string,
  floor: number,
  count: number,
  distribution: { available: number; employee: number; visitor: number; oos: number },
): ParkingSlot[] => {
  const statuses: ParkingSlot['status'][] = [
    ...Array(distribution.available).fill('available'),
    ...Array(distribution.employee).fill('employee'),
    ...Array(distribution.visitor).fill('visitor'),
    ...Array(distribution.oos).fill('outOfService'),
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `${zone}-${floor}-${i + 1}`,
    number: `${zone}${floor}${String(i + 1).padStart(2, '0')}`,
    status: statuses[i % statuses.length],
    zone,
    floor,
    occupant:
      statuses[i % statuses.length] !== 'available' && statuses[i % statuses.length] !== 'outOfService'
        ? {
            name: statuses[i % statuses.length] === 'employee' ? 'موظف' : 'زائر',
            plate: `AB-${1000 + i}`,
            since: '08:30',
          }
        : undefined,
  }));
};

export const zones: ParkingZone[] = [
  {
    id: 'A',
    name: 'Zone A – Employees',
    nameAr: 'منطقة أ – الموظفون',
    color: '#0B2E59',
    slots: makeSlots('A', 1, 20, { available: 8, employee: 10, visitor: 0, oos: 2 }),
  },
  {
    id: 'B',
    name: 'Zone B – Visitors',
    nameAr: 'منطقة ب – الزوار',
    color: '#C8A45D',
    slots: makeSlots('B', 1, 16, { available: 6, employee: 0, visitor: 8, oos: 2 }),
  },
  {
    id: 'C',
    name: 'Zone C – VIP',
    nameAr: 'منطقة ج – VIP',
    color: '#0B2E59',
    slots: makeSlots('C', 1, 8, { available: 3, employee: 4, visitor: 0, oos: 1 }),
  },
  {
    id: 'D',
    name: 'Zone D – Delivery',
    nameAr: 'منطقة د – التوصيل',
    color: '#9CA3AF',
    slots: makeSlots('D', 1, 6, { available: 2, employee: 0, visitor: 3, oos: 1 }),
  },
];

const totalSlots = zones.reduce((s, z) => s + z.slots.length, 0);
const availableSlots = zones.reduce(
  (s, z) => s + z.slots.filter((sl) => sl.status === 'available').length,
  0,
);
const employeeSlots = zones.reduce(
  (s, z) => s + z.slots.filter((sl) => sl.status === 'employee').length,
  0,
);
const visitorSlots = zones.reduce(
  (s, z) => s + z.slots.filter((sl) => sl.status === 'visitor').length,
  0,
);
const oosSlots = zones.reduce(
  (s, z) => s + z.slots.filter((sl) => sl.status === 'outOfService').length,
  0,
);

export const kpiStats: KPIStat[] = [
  {
    id: 'total',
    labelAr: 'إجمالي المواقف',
    labelEn: 'Total Slots',
    value: totalSlots,
    icon: 'LayoutGrid',
    color: 'navy',
  },
  {
    id: 'available',
    labelAr: 'متاح',
    labelEn: 'Available',
    value: availableSlots,
    total: totalSlots,
    percentage: Math.round((availableSlots / totalSlots) * 100),
    trend: 5,
    icon: 'CheckCircle',
    color: 'green',
  },
  {
    id: 'employee',
    labelAr: 'مشغول – موظفون',
    labelEn: 'Occupied – Employees',
    value: employeeSlots,
    total: totalSlots,
    percentage: Math.round((employeeSlots / totalSlots) * 100),
    icon: 'Users',
    color: 'navy',
  },
  {
    id: 'visitor',
    labelAr: 'مشغول – زوار',
    labelEn: 'Occupied – Visitors',
    value: visitorSlots,
    total: totalSlots,
    percentage: Math.round((visitorSlots / totalSlots) * 100),
    trend: -2,
    icon: 'UserCheck',
    color: 'gold',
  },
  {
    id: 'oos',
    labelAr: 'خارج الخدمة',
    labelEn: 'Out of Service',
    value: oosSlots,
    total: totalSlots,
    percentage: Math.round((oosSlots / totalSlots) * 100),
    icon: 'AlertTriangle',
    color: 'gray',
  },
];

export const recentEvents: RecentEvent[] = [
  { id: '1', type: 'entry', descriptionAr: 'دخول موظف', plate: 'AB-1023', slot: 'A101', time: '09:42' },
  { id: '2', type: 'exit', descriptionAr: 'خروج زائر', plate: 'CD-4456', slot: 'B108', time: '09:38' },
  { id: '3', type: 'entry', descriptionAr: 'دخول زائر', plate: 'EF-7891', slot: 'B103', time: '09:31' },
  { id: '4', type: 'alert', descriptionAr: 'موقف خارج الخدمة', plate: '—', slot: 'D104', time: '08:55' },
  { id: '5', type: 'entry', descriptionAr: 'دخول VIP', plate: 'GH-0012', slot: 'C102', time: '08:30' },
  { id: '6', type: 'exit', descriptionAr: 'خروج موظف', plate: 'IJ-3344', slot: 'A115', time: '08:15' },
];
