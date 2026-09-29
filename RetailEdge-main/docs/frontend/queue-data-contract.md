# Queue Intelligence Frontend Data Contracts

This document specifies the exact JSON schemas and TypeScript interface contracts consumed by the Queue Intelligence frontend.

## A. Queue Overview Metrics
```typescript
export interface QueueOverview {
  totalCustomersServed: number;    // e.g. 842
  totalCustomersTrend: number;     // e.g. 12 (percentage)
  avgWaitTime: number;             // e.g. 3.8 (minutes)
  avgWaitTimeTrend: number;        // e.g. -18 (percentage)
  currentQueueLength: number;      // e.g. 12 (people)
  currentQueueStatus: string;      // e.g. "Normal"
  predictedWaitTime: number;       // e.g. 5.2 (minutes)
  predictedHorizon: string;        // e.g. "Next 30 minutes"
  busiestCounter: string;          // e.g. "Counter 1"
  busiestCounterTraffic: string;   // e.g. "High Traffic"
  queueSatisfaction: number;       // e.g. 92 (%)
  queueSatisfactionTrend: number;  // e.g. 4 (%)
}
```

## B. Live Counter Status
```typescript
export type QueueStatusType = 'High' | 'Normal' | 'Open' | 'Closed';

export interface CounterStatusItem {
  id: string;                      // e.g. "cnt-1"
  name: string;                    // e.g. "Counter 1"
  currentQueue: number;            // e.g. 8 (people)
  avgWaitTime: number;             // e.g. 8 (minutes)
  status: QueueStatusType;         // "High" | "Normal" | "Open" | "Closed"
  trend: 'up' | 'down' | 'stable';
  iconColor: string;               // e.g. "#EF4444"
}
```

## C. Predicted Queue Length (ML/XGBoost)
```typescript
export interface PredictedQueuePoint {
  time: string;                    // "Now" | "15 min" | "30 min" | "45 min" | "1 hr" | "1.5 hr" | "2 hr"
  predicted: number;               // Predicted people count, e.g. 14
  lowerBound: number;              // Lower confidence limit, e.g. 11
  upperBound: number;              // Upper confidence limit, e.g. 17
}
```

## D. Queue Length Trend
```typescript
export interface QueueLengthTrendPoint {
  time: string;                    // e.g. "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
  counter1: number;
  counter2: number;
  counter3: number;
  counter4: number;
  counter5: number;
}
```

## E. Wait Time Distribution
```typescript
export interface WaitTimeBucket {
  range: string;                   // "0-2 min" | "2-5 min" | "5-10 min" | "10-15 min" | "> 15 min"
  percentage: number;              // e.g. 35
  color: string;                   // Hex color code, e.g. "#10B981"
}
```

## F. Peak Hours Analysis Matrix
```typescript
export interface PeakHourCell {
  counter: string;                 // "Counter 1" .. "Counter 5"
  timeSlot: string;                // "6AM" .. "10PM"
  level: 'empty' | 'low' | 'medium' | 'high' | 'very_high';
}
```

## G. Customer Flow Insights
```typescript
export interface CustomerFlowInsightItem {
  id: string;
  iconType: 'clock' | 'activity' | 'lightbulb' | 'check';
  title: string;
  description: string;
}
```

## H. Recent Queue Events
```typescript
export interface RecentQueueEventItem {
  id: string;
  time: string;                    // e.g. "03:22 PM"
  event: string;                   // e.g. "Queue high"
  eventType: 'queue_high' | 'queue_reduced' | 'new_counter' | 'staff_assist';
  counter: string;                 // e.g. "Counter 1"
  details: string;                 // e.g. "8 people (8 min)"
  status: 'Open' | 'Resolved' | 'Completed';
}
```
