export type SlotStatus = 'available' | 'employee' | 'visitor' | 'outOfService';

export interface ParkingSlot {
  id: string;
  number: string;
  status: SlotStatus;
  zone: string;
  floor: number;
  occupant?: {
    name: string;
    plate: string;
    since: string;
  };
}

export interface ParkingZone {
  id: string;
  name: string;
  nameAr: string;
  slots: ParkingSlot[];
  color?: string;
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
  plate: string;
  slot: string;
  time: string;
}
