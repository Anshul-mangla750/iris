# Camera Management

## Route
`/cameras`

## Purpose
Monitor live feeds, manage edge CCTV devices, track hardware health status, inspect store camera layout cones, view footfall traffic heatmaps, and review AI-powered camera insights from one central operations console.

---

## Page Sections

1. **Page Header**
   - Title: `Camera Management`
   - Subtitle: `Monitor live feeds, manage devices, and get AI-powered insights from your store cameras.`
   - Date range selector: `Today, 24 Sep 2024` with dropdown.
   - Period quick toggles: `Live` (active green pill), `7 Days`, `30 Days`.
   - Primary action: `+ Add Camera` button launching the Add Camera modal.

2. **KPI Cards (5 Equal Columns)**
   - **Total Cameras**: 12, `↑ 20%` positive trend, Video icon with green sparkline.
   - **Online Cameras**: 10, `↑ 11%` positive trend, Wifi icon with green sparkline.
   - **Offline Cameras**: 2, `↓ 33%` improvement trend, WifiOff icon with red sparkline.
   - **Active Alerts**: 8, `↓ 27%` improvement trend, Bell icon with red sparkline.
   - **Storage Usage**: 62%, `↑ 5%` trend, HardDrive icon with green sparkline.

3. **Camera Feed Grid (6 Cameras)**
   - 3-column desktop layout displaying 6 cameras:
     - `Camera 1 - Entrance` (Live, 1080p, 30fps)
     - `Camera 2 - Aisle 1 (Snacks)` (Live, 1080p, 30fps)
     - `Camera 3 - Aisle 2 (Beverages)` (Live, 1080p, 30fps)
     - `Camera 4 - Checkout` (Live, 1080p, 30fps)
     - `Camera 5 - Dairy Section` (Offline, darkened feed, "Camera Offline / Last seen: 10:42 AM", reconnect button)
     - `Camera 6 - Produce Section` (Live, 1080p, 30fps)
   - Interactive bottom overlay actions: Fullscreen, Snapshot, Analytics, Kebab menu (View Details, Edit Camera, Restart Camera, View Alerts).

4. **Store Layout - Camera Locations**
   - Architectural floor plan canvas displaying camera positions across Entrance, Aisle 1, Aisle 2, Dairy (red offline pin), Checkout, and Produce.
   - Translucent green triangular viewing cones indicating coverage angle.
   - Top-right store selector dropdown (`Store 001 - City Mall`).
   - Legend: `● Online`, `● Offline`, `▲ Camera View`.
   - Clickable camera markers showing dynamic popup with people in frame, traffic intensity, and "View Camera" trigger.

5. **Footfall Heatmap (Camera Analytics)**
   - Normalized traffic density overlay with hot zones at Entrance, Checkout, and primary aisles.
   - Dropdown period selector: `Today`, `Yesterday`, `7 Days`, `30 Days`.
   - Vertical gradient legend: `High` (red), `Medium` (yellow), `Low` (blue).

6. **AI Insights from Cameras**
   - High-priority operational anomalies and detections:
     1. High footfall at Entrance (32% higher than average between 4 PM - 6 PM, 2 min ago)
     2. Queue length increased at Checkout (12 people in queue, threshold: 8, 5 min ago)
     3. Unusual crowding in Snacks Aisle (Possible promotional interest, 12 min ago)
     4. Empty shelf detected in Dairy Section (2 products out of stock, 18 min ago)
     5. Normal activity in Produce Section (Footfall within expected range, 25 min ago)
   - `View All` shortcut linking to Central Operations Alerts (`/alerts`).

7. **Camera Health Status Table**
   - Compact table tracking camera name, status badge (Online in green, Offline in red), uptime, storage usage, and last checked time.
   - Filter dropdown: `All Cameras`, `Online`, `Offline`, `Maintenance`, `Error`.
   - `View All` trigger opening the comprehensive hardware telemetry drawer.

8. **Modals & Drawers**
   - `CameraFullscreenModal`: High-resolution stream viewer with snapshot and analytics shortcuts.
   - `CameraAnalyticsModal`: Anonymous aggregate metrics (People in frame, entering, exiting, traffic level, average dwell time, queue count).
   - `CameraDetailsDrawer`: Full device technical specs (CAM code, RTSP stream, resolution, FPS, storage, AI processing status).
   - `AddCameraModal`: Device onboarding modal with client-side form validation.
   - `RestartCameraModal`: Simulated device power-cycle and reconnection flow.
   - `SnapshotToast`: Non-intrusive feedback toast ("Snapshot captured").

---

## Component Catalog

| Component | File Path | Purpose |
|-----------|-----------|---------|
| `CameraManagementPage` | `src/pages/cameras/CameraManagementPage.tsx` | Main orchestration page managing filters, modals, and store state |
| `CameraPageHeader` | `src/components/cameras/CameraPageHeader.tsx` | Header with title, date selector, period toggle pills, and "+ Add Camera" trigger |
| `CameraKpiGrid` | `src/components/cameras/CameraKpiGrid.tsx` | 5-column executive metric summary row |
| `CameraKpiCard` | `src/components/cameras/CameraKpiCard.tsx` | Metric card with icon container, trend percentage, and SVG sparkline |
| `CameraFeedGrid` | `src/components/cameras/CameraFeedGrid.tsx` | 3-column responsive container for camera feed cards |
| `CameraFeedCard` | `src/components/cameras/CameraFeedCard.tsx` | Individual camera card with status badge, metadata, action buttons, and kebab menu |
| `CameraFeedViewer` | `src/components/cameras/CameraFeedViewer.tsx` | Abstracted viewer supporting MOCK, LIVE, and OFFLINE modes |
| `StoreCameraMap` | `src/components/cameras/StoreCameraMap.tsx` | Floor plan with camera pins, viewing cones, legend, and popup |
| `FootfallHeatmap` | `src/components/cameras/FootfallHeatmap.tsx` | Density heatmap with vertical color-bar gradient legend |
| `CameraInsights` | `src/components/cameras/CameraInsights.tsx` | AI insights list with severity icons and timestamps |
| `CameraHealthTable` | `src/components/cameras/CameraHealthTable.tsx` | Filterable hardware uptime and storage status table |
| `CameraFullscreenModal` | `src/components/cameras/CameraFullscreenModal.tsx` | Modal for large-scale camera feed inspection |
| `CameraAnalyticsModal` | `src/components/cameras/CameraAnalyticsModal.tsx` | Modal displaying footfall, dwell time, and queue telemetry |
| `CameraDetailsDrawer` | `src/components/cameras/CameraDetailsDrawer.tsx` | Slide-over drawer with device network and RTSP specs |
| `CameraHealthDrawer` | `src/components/cameras/CameraHealthDrawer.tsx` | Comprehensive hardware health drawer |
| `AddCameraModal` | `src/components/cameras/AddCameraModal.tsx` | Form modal for provisioning new cameras |
| `RestartCameraModal` | `src/components/cameras/RestartCameraModal.tsx` | Device restart simulation confirmation |
| `SnapshotToast` | `src/components/cameras/SnapshotToast.tsx` | Non-intrusive feedback toast |

---

## Mock Data Architecture
- File: `src/data/cameraMockData.ts`
- Datasets:
  - `INITIAL_CAMERAS`: 6 active retail camera devices with RTSP stream identifiers.
  - `INITIAL_CAMERA_SUMMARY`: 5 executive KPIs and trend percentages.
  - `INITIAL_CAMERA_HEALTH`: Hardware status items for the health table.
  - `INITIAL_CAMERA_INSIGHTS`: Operational anomalies with severity tags.
  - `INITIAL_HEATMAP_DATA`: Normalized zone traffic intensities and footfall counts.
  - `INITIAL_CAMERA_LOCATIONS`: 2D floor plan coordinates and cone angles.
  - `INITIAL_CAMERA_ANALYTICS`: Footfall count, enter/exit flow, and dwell times per camera.
