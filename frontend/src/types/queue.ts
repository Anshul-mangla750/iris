export type QueueStatusType = 'High' | 'Normal' | 'Open' | 'Closed';

export interface QueueOverview {
  totalCustomersServed: number;
  totalCustomersTrend: number;
  avgWaitTime: number; // minutes, e.g. 3.8
  avgWaitTimeTrend: number; // percentage, e.g. -18
  currentQueueLength: number; // people, e.g. 12
  currentQueueStatus: string; // "Normal"
  predictedWaitTime: number; // minutes, e.g. 5.2
  predictedHorizon: string; // "Next 30 minutes"
  busiestCounter: string; // "Counter 1"
  busiestCounterTraffic: string; // "High Traffic"
  queueSatisfaction: number; // percentage, e.g. 92
  queueSatisfactionTrend: number; // percentage, e.g. 4
}

export interface CounterStatusItem {
  id: string;
  name: string; // "Counter 1"
  currentQueue: number; // people, e.g. 8
  avgWaitTime: number; // minutes, e.g. 8
  status: QueueStatusType;
  trend: 'up' | 'down' | 'stable';
  iconColor: string; // Hex or Tailwind class
}

export interface QueueHeatmapData {
  imageUrl: string;
  activeZone: string;
  legend: {
    name: string;
    color: string;
  }[];
}

export interface QueueLengthTrendPoint {
  time: string; // "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
  counter1: number;
  counter2: number;
  counter3: number;
  counter4: number;
  counter5: number;
}

export interface PredictedQueuePoint {
  time: string; // "Now", "15 min", "30 min", "45 min", "1 hr", "1.5 hr", "2 hr"
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface WaitTimeBucket {
  range: string; // "0-2 min", "2-5 min", "5-10 min", "10-15 min", "> 15 min"
  percentage: number; // 35, 28, 20, 10, 7
  color: string;
}

export interface PeakHourCell {
  counter: string;
  timeSlot: string; // "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"
  level: 'empty' | 'low' | 'medium' | 'high' | 'very_high';
}

export interface CustomerFlowInsightItem {
  id: string;
  iconType: 'clock' | 'activity' | 'lightbulb' | 'check';
  title: string;
  description: string;
}

export interface RecentQueueEventItem {
  id: string;
  time: string;
  event: string;
  eventType: 'queue_high' | 'queue_reduced' | 'new_counter' | 'staff_assist';
  counter: string;
  details: string;
  status: 'Open' | 'Resolved' | 'Completed';
}

export interface QueueCameraOverlay {
  counterName: string;
  peopleCount: number;
  status: QueueStatusType;
}
