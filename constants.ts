import { Vehicle } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-001',
    name: 'Personal Model 3',
    model: 'Tesla Model 3 LR',
    status: 'active',
    location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' },
    stats: {
      confidenceScore: 94.2154,
      soc: 84.231,
      voltage: 385.442,
      current: -24.110,
      temp: 34.221,
      cycles: 142,
      projectedCost: 12500,
      healthGrade: 'A',
    },
    timeline: [
      {
        id: '1',
        time: 'Today, 08:30 AM',
        type: 'neutral',
        message: 'Morning commute consumed 0.004% lifespan.',
        detail: 'Standard discharge rate. No stress detected.',
      },
      {
        id: '2',
        time: 'Today, 02:15 PM',
        type: 'risk',
        message: 'Heat exposure accelerated aging by 12 mins.',
        detail: 'Parked in direct sun. Battery temp reached 42°C.',
      },
      {
        id: '3',
        time: 'Today, 06:45 PM',
        type: 'improvement',
        message: 'Regenerative braking reclaimed 2.4 miles.',
        detail: 'Efficient descent on Highway 1.',
      },
    ]
  },
  {
    id: 'v-002',
    name: 'Fleet Alpha-1',
    model: 'Ford F-150 Lightning',
    status: 'charging',
    location: { lat: 37.7849, lng: -122.4094, address: 'SoMa, San Francisco' },
    stats: {
      confidenceScore: 98.4421,
      soc: 42.112,
      voltage: 390.112,
      current: 150.223,
      temp: 41.002,
      cycles: 45,
      projectedCost: 15000,
      healthGrade: 'A',
    },
    timeline: [
       {
        id: '1',
        time: 'Today, 10:00 AM',
        type: 'risk',
        message: 'Fast charging inducing micro-stress.',
        detail: 'High current (150A) causing minor thermal rise.',
      },
    ]
  },
];
