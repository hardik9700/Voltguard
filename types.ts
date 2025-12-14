export interface BatteryStats {
  confidenceScore: number; // Replaces raw SoH for the primary metric
  soc: number;
  voltage: number;
  current: number;
  temp: number;
  cycles: number;
  projectedCost: number; // Replacement cost estimate
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'neutral' | 'risk' | 'improvement';
  message: string;
  detail: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'charging' | 'idle';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  stats: BatteryStats;
  timeline: TimelineEvent[];
}

export enum Tab {
  TIMELINE = 'TIMELINE',
  CARE = 'CARE',
  REPORT = 'REPORT',
  FLEET = 'FLEET',
  MAPS = 'MAPS',
}