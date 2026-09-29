# POS/ERP Integration

## Route
`/integrations`

## Purpose
Connect external retail systems (Point of Sale, ERP, Inventory APIs, HR/Staff systems, Supplier Portals, and Webhook Middleware) with RetailEdge AI for real-time synchronization, unified operations, automated data ingestion, and synchronized intelligence across all retail modules.

---

## Sections

### 1. Integration KPIs
Compact 5-card row presenting key operational synchronization metrics:
- **Total Transactions**: `2,854` (↑ 12% trend, green sync icon `#0fa968`)
- **Total Sales (POS)**: `₹ 4,28,760` (↑ 8% trend, blue rupee icon `#2563eb`)
- **Items Synced**: `1,248` (↑ 15% trend, purple package icon `#8b5cf6`)
- **Sync Success Rate**: `99.2%` (↑ 0.8% trend, green check icon `#0fa968`)
- **Sync Errors**: `8` (↓ 60% trend, red alert icon `#ef4444`)
Each card displays a live sparkline SVG trace matching the metric color.

### 2. Integration Flow
Interactive diagram representing multi-system data flow:
- **POS System**: Green-tinted container highlighting sales transactions, payments, returns, daily closing, and customer data.
- **Integration Middleware**: Central running hub (`● Running`) handling API ingestion, webhook delivery, and scheduled sync jobs.
- **ERP System**: Blue-tinted container managing product masters, inventory stock, purchase orders, supplier portals, and store masters.
- **RetailEdge AI Hub**: Central engine connected to 5 core intelligence modules:
  1. Inventory Monitoring
  2. Products & Planogram
  3. Analytics & Reports
  4. Store Management
  5. Compliance & Alerts

### 3. Integration Status
Table displaying all registered external integrations:
- Systems: POS - EasyPOS, ERP - SAP, ERP - Tally, Inventory API, HR/Staff Sync, Supplier Portal
- Badges: `● Connected` (green) and `● Not Connected` (red)
- Last sync timestamps, frequencies (Real-time, Every 15 min, Every 30 min, Daily, Manual)
- Quick actions (`Configure` / `Setup`) and three-dot context menus (Test Connection, Sync Now, Disable Integration).

### 4. Recent POS Transactions
Tabular view of real-time transactions ingested from POS terminals:
- Time, Transaction ID (`TRX78932`), Items count, Amount in INR, Payment Mode (UPI, Card, Cash), and Sync Status (`Synced` green, `Syncing` yellow).
- Row clicks open the interactive **Transaction Details Modal**.

### 5. Data Sync Overview
Multi-line chart powered by Recharts comparing four synchronization streams over 7 days:
- POS Sales (`#0fa968`)
- Inventory Updates (`#0284c7`)
- Product Data (`#eab308`)
- Store Data (`#8b5cf6`)
Includes custom tooltips, legend, and time-range filter.

### 6. Integration Settings
Five quick-access configuration categories:
1. **API Credentials**: Manage API keys, tokens, and gateway auth.
2. **Data Mapping**: Configure source-to-canonical schema mappings.
3. **Sync Schedules**: Set polling intervals and batch size.
4. **Error Handling**: Manage retry count, backoff, and alerts.
5. **Webhooks**: Register webhook endpoints and event subscriptions.

---

## Component Architecture

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| `IntegrationsPage` | `src/pages/integrations/IntegrationsPage.tsx` | Main page coordinator, state manager, and modal controller |
| `IntegrationPageHeader` | `src/components/integrations/IntegrationPageHeader.tsx` | Title, subtitle, date filter dropdown, and Add Integration trigger |
| `IntegrationKpiGrid` | `src/components/integrations/IntegrationKpiGrid.tsx` | 5 KPI summary cards container |
| `IntegrationKpiCard` | `src/components/integrations/IntegrationKpiCard.tsx` | Individual KPI card with icon, metric, trend, and SVG sparkline |
| `IntegrationFlow` | `src/components/integrations/IntegrationFlow.tsx` | Visual diagram of POS, Middleware, ERP, and RetailEdge AI modules |
| `IntegrationStatus` | `src/components/integrations/IntegrationStatus.tsx` | Table card listing configured integrations with View All action |
| `IntegrationStatusRow` | `src/components/integrations/IntegrationStatusRow.tsx` | Table row with status pills, two-line timestamp, and action menu |
| `RecentTransactions` | `src/components/integrations/RecentTransactions.tsx` | Recent POS transactions table with row click detail modal trigger |
| `SyncOverviewChart` | `src/components/integrations/SyncOverviewChart.tsx` | Recharts multi-line chart for 7-day synchronization volumes |
| `IntegrationSettings` | `src/components/integrations/IntegrationSettings.tsx` | Card listing 5 configuration categories |
| `IntegrationSettingItem` | `src/components/integrations/IntegrationSettingItem.tsx` | Individual setting row with icon, title, description, and chevron |
| `AddIntegrationModal` | `src/components/integrations/AddIntegrationModal.tsx` | Modal form to register new POS/ERP/API connections |
| `IntegrationConfigDrawer`| `src/components/integrations/IntegrationConfigDrawer.tsx` | Modal to test connection, sync now, and edit frequency |
| `TransactionDetailsModal`| `src/components/integrations/TransactionDetailsModal.tsx` | Detail view of specific POS transaction |
| `SettingConfigModal` | `src/components/integrations/SettingConfigModal.tsx` | Configuration editor for credentials, mapping, schedules, error handling, webhooks |

---

## Mock Data
File: `src/data/integrationMockData.ts`
- `INTEGRATION_SUMMARY_MOCK`: KPIs and percentage trends
- `INTEGRATIONS_LIST_MOCK`: 6 integrated retail platforms (EasyPOS, SAP, Tally, Inventory API, HR Sync, Supplier Portal)
- `RECENT_TRANSACTIONS_MOCK`: 7 real-time transaction records
- `DATA_SYNC_POINTS_MOCK`: 7-day historical sync volume records
- `INTEGRATION_SETTINGS_MOCK`: 5 configuration item definitions
