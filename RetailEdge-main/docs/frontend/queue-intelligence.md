# Queue Intelligence

## Route
`/queues`

## Purpose
Real-time checkout queue monitoring, waiting-time analysis, and predictive congestion intelligence for retail stores.

## Page Sections
1. **Page Header**: Main title, subtitle, date selector ("Today, 24 Sep 2024"), time range filter ("Today", "7 Days", "30 Days"), and counter filter ("All Counters").
2. **KPI Cards (6 Cards)**:
   - Total Customers Served: `842` (↑ 12% vs yesterday)
   - Average Wait Time: `3.8 min` (↓ 18% vs yesterday)
   - Current Queue Length: `12 people` (● Normal)
   - Predicted Wait Time: `5.2 min` (◇ Next 30 minutes)
   - Busiest Counter: `Counter 1` (✦ High Traffic)
   - Queue Satisfaction: `92%` (↑ 4% vs yesterday)
3. **Operations Row (3 Columns)**:
   - **Live Queue Camera Feed**: Real-time checkout overhead visual with floating counter status pills and full-screen preview.
   - **Queue Status - All Counters**: Compact tabular list of all counters, queue counts, average wait times, status badges, and sparkline trends.
   - **Queue Heatmap**: Store floor-plan checkout density hotspots categorized into High, Medium, and Low density.
4. **Analytics Row (3 Columns)**:
   - **Queue Length Trend**: Multi-series line chart tracking individual counter queue levels across hourly milestones (6AM to 9PM).
   - **Predicted Queue Length (XGBoost)**: Forward-looking queue prediction line with shaded upper and lower confidence ribbon bounds.
   - **Wait Time Distribution**: Percentage histogram buckets (0-2m, 2-5m, 5-10m, 10-15m, >15m) with color-coded severity.
5. **Insights Row (3 Columns)**:
   - **Peak Hours Analysis**: Time-slot matrix (6AM to 10PM) across Counters 1-5 visualizing congestion intensity.
   - **Customer Flow Insights**: AI-curated operational recommendation cards.
   - **Recent Queue Events**: Real-time event log tracking queue spikes, reductions, new counter activations, and staff calls.

## Components
- `QueueHeader.tsx`: Top title and filter bar.
- `QueueKpiCard.tsx`: Reusable compact KPI card with icon themes and sparklines.
- `QueueKpiGrid.tsx`: 6-column grid wrapper for KPI cards.
- `LiveQueueCameraFeed.tsx`: Live camera feed container with top floating status cards and modal expansion.
- `QueueStatusTable.tsx`: Real-time counter status and metrics breakdown table.
- `QueueHeatmap.tsx`: Checkout concourse heatmap visualization with zone filtering and density legend.
- `QueueLengthTrend.tsx`: Recharts multi-line chart for historical counter queue trends.
- `PredictedQueueChart.tsx`: Recharts ComposedChart rendering predictions and confidence intervals.
- `WaitTimeDistribution.tsx`: Recharts BarChart highlighting wait time percentage buckets.
- `PeakHoursHeatmap.tsx`: Interactive color intensity grid analyzing counter hourly traffic.
- `CustomerFlowInsights.tsx`: Actionable recommendation cards with thematic icons.
- `RecentQueueEvents.tsx`: Queue event audit log table.
- `QueueEventsModal.tsx`: Comprehensive event inspection modal.

## Mock Data
Defined in `src/data/queueMockData.ts`:
- `QUEUE_OVERVIEW_MOCK`
- `COUNTER_STATUS_MOCK`
- `QUEUE_CAMERA_OVERLAYS_MOCK`
- `QUEUE_HEATMAP_MOCK`
- `QUEUE_LENGTH_TREND_MOCK`
- `PREDICTED_QUEUE_MOCK`
- `WAIT_TIME_DISTRIBUTION_MOCK`
- `PEAK_HOURS_MATRIX`
- `CUSTOMER_FLOW_INSIGHTS_MOCK`
- `RECENT_QUEUE_EVENTS_MOCK`

## API Endpoints

### 1. GET `/api/queues/overview`
- **Method**: `GET`
- **Path**: `/api/queues/overview`
- **Purpose**: Fetch top-level KPIs (customers served, wait times, satisfaction).
- **Query Params**: `store_id: string`
- **Authentication**: Bearer JWT token required
- **Status**: `MOCK / CONTRACT ONLY` (Pending backend implementation)

### 2. GET `/api/queues/live`
- **Method**: `GET`
- **Path**: `/api/queues/live`
- **Purpose**: Real-time queue counts and statuses per checkout lane.
- **Query Params**: `store_id: string`
- **Authentication**: Bearer JWT token required
- **Status**: `MOCK / CONTRACT ONLY` (Pending backend implementation)

### 3. GET `/api/queues/heatmap`
- **Method**: `GET`
- **Path**: `/api/queues/heatmap`
- **Purpose**: Floor-plan density heatmap image URL and hotspot coordinates.
- **Query Params**: `store_id: string, zone?: string`
- **Status**: `MOCK / CONTRACT ONLY`

### 4. GET `/api/queues/trend`
- **Method**: `GET`
- **Path**: `/api/queues/trend`
- **Purpose**: Historical queue lengths grouped by counter and time slot.
- **Query Params**: `store_id: string, range: string`
- **Status**: `MOCK / CONTRACT ONLY`

### 5. GET `/api/queues/predictions`
- **Method**: `GET`
- **Path**: `/api/queues/predictions`
- **Purpose**: Machine learning queue forecasts (prediction value + confidence bounds).
- **Query Params**: `store_id: string, horizon?: string`
- **Status**: `MOCK / CONTRACT ONLY`

### 6. GET `/api/queues/events`
- **Method**: `GET`
- **Path**: `/api/queues/events`
- **Purpose**: Historical queue incident and staffing events.
- **Query Params**: `store_id: string, limit?: number`
- **Status**: `MOCK / CONTRACT ONLY`
