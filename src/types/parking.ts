export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'visitor' | 'disabled';
export type BuildingId = 'admin' | 'factory';
export type UserRole = 'employee' | 'visitor';

export interface ParkingSlot {
  id: string;
  number: string;
  status: SlotStatus;
  zone: string;
  buildingId: BuildingId;
  floor: number;
  occupant?: {
    name: string;
    type: 'employee' | 'visitor';
    plate: string;
    since: string;
    employeeId?: string;
    company?: string;
  };
}

export interface ParkingZone {
  id: string;
  name: string;
  nameAr: string;
  buildingId: BuildingId;
  slots: ParkingSlot[];
}

export interface BuildingData {
  id: BuildingId;
  name: string;
  nameAr: string;
  zones: ParkingZone[];
}

export interface Employee {
  id: string;
  nameAr: string;
  department: string;
  buildingId: BuildingId;
  assignedSlot: string;
  plate: string;
}

export interface KPIStat {
  id: string;
  labelAr: string;
  labelEn: string;
  value: number;
  total?: number;
  percentage?: number;
  trend?: number;
  icon: string;
  color: 'navy' | 'gold' | 'green' | 'gray' | 'red';
}

export interface RecentEvent {
  id: string;
  type: 'entry' | 'exit' | 'alert';
  descriptionAr: string;
  descriptionEn: string;
  plate: string;
  slot: string;
  time: string;
}
