import type {
  QueueOverview,
  CounterStatusItem,
  QueueHeatmapData,
  QueueLengthTrendPoint,
  PredictedQueuePoint,
  WaitTimeBucket,
  PeakHourCell,
  CustomerFlowInsightItem,
  RecentQueueEventItem,
  QueueCameraOverlay,
} from '../types/queue';

export const QUEUE_OVERVIEW_MOCK: QueueOverview = {
  totalCustomersServed: 842,
  totalCustomersTrend: 12,
  avgWaitTime: 3.8,
  avgWaitTimeTrend: -18,
  currentQueueLength: 12,
  currentQueueStatus: 'Normal',
  predictedWaitTime: 5.2,
  predictedHorizon: 'Next 30 minutes',
  busiestCounter: 'Counter 1',
  busiestCounterTraffic: 'High Traffic',
  queueSatisfaction: 92,
  queueSatisfactionTrend: 4,
};

export const COUNTER_STATUS_MOCK: CounterStatusItem[] = [
  {
    id: 'cnt-1',
    name: 'Counter 1',
    currentQueue: 8,
    avgWaitTime: 8,
    status: 'High',
    trend: 'up',
    iconColor: '#EF4444',
  },
  {
    id: 'cnt-2',
    name: 'Counter 2',
    currentQueue: 3,
    avgWaitTime: 3,
    status: 'Normal',
    trend: 'stable',
    iconColor: '#F59E0B',
  },
  {
    id: 'cnt-3',
    name: 'Counter 3',
    currentQueue: 0,
    avgWaitTime: 0,
    status: 'Open',
    trend: 'down',
    iconColor: '#10B981',
  },
  {
    id: 'cnt-4',
    name: 'Counter 4',
    currentQueue: 7,
    avgWaitTime: 12,
    status: 'High',
    trend: 'up',
    iconColor: '#10B981',
  },
  {
    id: 'cnt-5',
    name: 'Counter 5',
    currentQueue: 2,
    avgWaitTime: 2,
    status: 'Normal',
    trend: 'stable',
    iconColor: '#3B82F6',
  },
];

export const QUEUE_CAMERA_OVERLAYS_MOCK: QueueCameraOverlay[] = [
  { counterName: 'Counter 1', peopleCount: 8, status: 'High' },
  { counterName: 'Counter 2', peopleCount: 3, status: 'Normal' },
  { counterName: 'Counter 3', peopleCount: 0, status: 'Open' },
  { counterName: 'Counter 4', peopleCount: 7, status: 'High' },
  { counterName: 'Counter 5', peopleCount: 2, status: 'Normal' },
];

export const QUEUE_HEATMAP_MOCK: QueueHeatmapData = {
  imageUrl: '/images/queues/queue_heatmap.png',
  activeZone: 'Checkout Area',
  legend: [
    { name: 'High Density', color: '#EF4444' },
    { name: 'Medium Density', color: '#F59E0B' },
    { name: 'Low Density', color: '#3B82F6' },
  ],
};

export const QUEUE_LENGTH_TREND_MOCK: QueueLengthTrendPoint[] = [
  { time: '6AM', counter1: 7, counter2: 3, counter3: 1, counter4: 4, counter5: 2 },
  { time: '9AM', counter1: 11, counter2: 5, counter3: 2, counter4: 7, counter5: 3 },
  { time: '12PM', counter1: 15, counter2: 7, counter3: 1, counter4: 10, counter5: 4 },
  { time: '3PM', counter1: 13, counter2: 6, counter3: 2, counter4: 9, counter5: 3 },
  { time: '6PM', counter1: 17, counter2: 8, counter3: 3, counter4: 12, counter5: 5 },
  { time: '9PM', counter1: 12, counter2: 4, counter3: 1, counter4: 8, counter5: 3 },
];

export const PREDICTED_QUEUE_MOCK: PredictedQueuePoint[] = [
  { time: 'Now', predicted: 8, lowerBound: 6, upperBound: 10 },
  { time: '15 min', predicted: 11, lowerBound: 8, upperBound: 13 },
  { time: '30 min', predicted: 14, lowerBound: 11, upperBound: 17 },
  { time: '45 min', predicted: 12, lowerBound: 9, upperBound: 15 },
  { time: '1 hr', predicted: 10, lowerBound: 7, upperBound: 13 },
  { time: '1.5 hr', predicted: 9, lowerBound: 6, upperBound: 12 },
  { time: '2 hr', predicted: 11, lowerBound: 8, upperBound: 14 },
];

export const WAIT_TIME_DISTRIBUTION_MOCK: WaitTimeBucket[] = [
  { range: '0-2 min', percentage: 35, color: '#10B981' },
  { range: '2-5 min', percentage: 28, color: '#86EFAC' },
  { range: '5-10 min', percentage: 20, color: '#FDE047' },
  { range: '10-15 min', percentage: 10, color: '#FB923C' },
  { range: '> 15 min', percentage: 7, color: '#F87171' },
];

export const PEAK_HOURS_TIME_SLOTS = [
  '6AM',
  '8AM',
  '10AM',
  '12PM',
  '2PM',
  '4PM',
  '6PM',
  '8PM',
  '10PM',
];

export const PEAK_HOURS_COUNTERS = [
  'Counter 1',
  'Counter 2',
  'Counter 3',
  'Counter 4',
  'Counter 5',
];

// Grid mapping: row = counter, col = timeSlot
export const PEAK_HOURS_MATRIX: PeakHourCell[] = [
  // Counter 1
  { counter: 'Counter 1', timeSlot: '6AM', level: 'low' },
  { counter: 'Counter 1', timeSlot: '8AM', level: 'low' },
  { counter: 'Counter 1', timeSlot: '10AM', level: 'medium' },
  { counter: 'Counter 1', timeSlot: '12PM', level: 'very_high' },
  { counter: 'Counter 1', timeSlot: '2PM', level: 'very_high' },
  { counter: 'Counter 1', timeSlot: '4PM', level: 'high' },
  { counter: 'Counter 1', timeSlot: '6PM', level: 'very_high' },
  { counter: 'Counter 1', timeSlot: '8PM', level: 'medium' },
  { counter: 'Counter 1', timeSlot: '10PM', level: 'low' },

  // Counter 2
  { counter: 'Counter 2', timeSlot: '6AM', level: 'low' },
  { counter: 'Counter 2', timeSlot: '8AM', level: 'low' },
  { counter: 'Counter 2', timeSlot: '10AM', level: 'medium' },
  { counter: 'Counter 2', timeSlot: '12PM', level: 'high' },
  { counter: 'Counter 2', timeSlot: '2PM', level: 'high' },
  { counter: 'Counter 2', timeSlot: '4PM', level: 'medium' },
  { counter: 'Counter 2', timeSlot: '6PM', level: 'high' },
  { counter: 'Counter 2', timeSlot: '8PM', level: 'medium' },
  { counter: 'Counter 2', timeSlot: '10PM', level: 'empty' },

  // Counter 3
  { counter: 'Counter 3', timeSlot: '6AM', level: 'empty' },
  { counter: 'Counter 3', timeSlot: '8AM', level: 'low' },
  { counter: 'Counter 3', timeSlot: '10AM', level: 'low' },
  { counter: 'Counter 3', timeSlot: '12PM', level: 'medium' },
  { counter: 'Counter 3', timeSlot: '2PM', level: 'medium' },
  { counter: 'Counter 3', timeSlot: '4PM', level: 'low' },
  { counter: 'Counter 3', timeSlot: '6PM', level: 'medium' },
  { counter: 'Counter 3', timeSlot: '8PM', level: 'empty' },
  { counter: 'Counter 3', timeSlot: '10PM', level: 'empty' },

  // Counter 4
  { counter: 'Counter 4', timeSlot: '6AM', level: 'low' },
  { counter: 'Counter 4', timeSlot: '8AM', level: 'low' },
  { counter: 'Counter 4', timeSlot: '10AM', level: 'medium' },
  { counter: 'Counter 4', timeSlot: '12PM', level: 'very_high' },
  { counter: 'Counter 4', timeSlot: '2PM', level: 'high' },
  { counter: 'Counter 4', timeSlot: '4PM', level: 'high' },
  { counter: 'Counter 4', timeSlot: '6PM', level: 'high' },
  { counter: 'Counter 4', timeSlot: '8PM', level: 'medium' },
  { counter: 'Counter 4', timeSlot: '10PM', level: 'low' },

  // Counter 5
  { counter: 'Counter 5', timeSlot: '6AM', level: 'empty' },
  { counter: 'Counter 5', timeSlot: '8AM', level: 'low' },
  { counter: 'Counter 5', timeSlot: '10AM', level: 'low' },
  { counter: 'Counter 5', timeSlot: '12PM', level: 'medium' },
  { counter: 'Counter 5', timeSlot: '2PM', level: 'medium' },
  { counter: 'Counter 5', timeSlot: '4PM', level: 'low' },
  { counter: 'Counter 5', timeSlot: '6PM', level: 'medium' },
  { counter: 'Counter 5', timeSlot: '8PM', level: 'low' },
  { counter: 'Counter 5', timeSlot: '10PM', level: 'empty' },
];

export const CUSTOMER_FLOW_INSIGHTS_MOCK: CustomerFlowInsightItem[] = [
  {
    id: 'ins-1',
    iconType: 'clock',
    title: 'Peak queue time is 12 PM - 2 PM',
    description: 'Queue length is 40% higher during this time.',
  },
  {
    id: 'ins-2',
    iconType: 'activity',
    title: 'Average service time per customer',
    description: '2.1 minutes ↓ 12% vs last week',
  },
  {
    id: 'ins-3',
    iconType: 'lightbulb',
    title: 'Predicted surge at 5 PM',
    description: 'Expected queue length: 15-18 people.',
  },
  {
    id: 'ins-4',
    iconType: 'check',
    title: 'Counter 3 is underutilized',
    description: 'Consider redistributing staff for better efficiency.',
  },
];

export const RECENT_QUEUE_EVENTS_MOCK: RecentQueueEventItem[] = [
  {
    id: 'qevt-1',
    time: '03:22 PM',
    event: 'Queue high',
    eventType: 'queue_high',
    counter: 'Counter 1',
    details: '8 people (8 min)',
    status: 'Open',
  },
  {
    id: 'qevt-2',
    time: '03:15 PM',
    event: 'Queue reduced',
    eventType: 'queue_reduced',
    counter: 'Counter 4',
    details: '4 people (5 min)',
    status: 'Resolved',
  },
  {
    id: 'qevt-3',
    time: '03:05 PM',
    event: 'New counter opened',
    eventType: 'new_counter',
    counter: 'Counter 3',
    details: 'Counter activated',
    status: 'Completed',
  },
  {
    id: 'qevt-4',
    time: '02:45 PM',
    event: 'Queue high',
    eventType: 'queue_high',
    counter: 'Counter 1',
    details: '10 people (12 min)',
    status: 'Resolved',
  },
  {
    id: 'qevt-5',
    time: '02:30 PM',
    event: 'Staff assistance',
    eventType: 'staff_assist',
    counter: 'Counter 2',
    details: 'Staff called',
    status: 'Completed',
  },
];
