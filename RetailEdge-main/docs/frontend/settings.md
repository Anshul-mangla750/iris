# Settings

## Route
`/settings`

## Purpose
Configure organization, store-specific rules, notification dispatch routing, third-party POS/ERP and cloud integrations, AI & analytics vision pipelines, security policies, and system diagnostics for the RetailEdge AI platform.

## Visual Design Reference
The `/settings` route strictly reproduces the visual hierarchy and density from the authoritative platform screenshot:
- **Global Application Shell**: Integrated with the unified RetailEdge AI sidebar, active item highlighting (`#e8f8f0` background, `#0fa968` icon/text), active store dropdown (`Store 001 - City Mall, Delhi`), live heartbeat indicator (`● Live`), notification bell with unread badge (`3`), message bubble with unread badge (`2`), and user avatar.
- **Header**: Title "Settings", subtitle "Configure your stores, system preferences, integrations and all platform settings.", and outlined top-right "Reset to Default" button.
- **7 Navigation Tabs**:
  1. `General` (Default active view)
  2. `Store Configuration`
  3. `Integrations`
  4. `Notifications`
  5. `AI & Analytics`
  6. `Security`
  7. `System`

---

## Tab 1: General (Visual Source of Truth)

### Four Status Cards
1. **System Status**: Gear icon, "System Status", `● Healthy`, "All services are running".
2. **Data Sync**: Database icon, "Data Sync", `● Up to date`, "Last sync: 24 Sep 2024, 03:20 PM".
3. **Security**: Shield icon, "Security", `● Protected`, "2FA enabled".
4. **Storage Usage**: Cloud icon, "Storage Usage", `62% Used`, horizontal emerald progress bar, "12.4 GB of 20 GB".

### Three-Column Settings Grid

#### Column 1: Core Configuration
- **General Settings**:
  - `Organization Name`: Text input (`RetailEdge AI`)
  - `Timezone`: Dropdown (`Asia/Kolkata (GMT+5:30)`)
  - `Date Format`: Dropdown (`DD MMM YYYY (24 Sep 2024)`)
  - `Currency`: Dropdown (`INR (₹) - Indian Rupee`)
  - `Language`: Dropdown (`English`)
  - `Save Changes`: Primary emerald button with optimistic feedback
- **Store Settings**:
  - `Default Store`: Dropdown (`Store 001 - City Mall, Delhi`)
  - `Store Operating Hours`: Dual time input (`09:00 AM` to `10:00 PM`) with clock icons
  - `Default Planogram`: Dropdown (`Snacks - Standard`)
  - `Auto Stock Alert Threshold`: Input `10 units`
  - `Queue Alert Threshold`: Input `10 people`
  - `Save Changes`: Primary emerald button

#### Column 2: Alerts & Security
- **Notification Preferences**:
  - 5 Rows: Inventory Alerts, Queue Alerts, Planogram Alerts, System Alerts, Daily Reports
  - Each with an active emerald toggle switch and selectable channel pills: `Email`, `SMS`, `In-App`
  - `Save Preferences`: Primary emerald button
- **Security Settings**:
  - `Two-Factor Authentication (2FA)`: Toggle ON
  - `Session Timeout`: Dropdown (`30 minutes`)
  - `Password Policy`: Outlined `Configure` button (opens policy modal)
  - `IP Access Control`: Outlined `Manage IPs` button (opens allowlist modal)
  - `Audit Logging`: Toggle ON

#### Column 3: Connectors & Maintenance
- **Integration Settings**:
  - 9 Enterprise Connectors:
    1. POS - EasyPOS (`● Connected`)
    2. ERP - SAP (`● Connected`)
    3. ERP - Tally (`● Connected`)
    4. Inventory API (`● Connected`)
    5. Weather API (IMD) (`● Connected`)
    6. Map API (OSRM) (`● Connected`)
    7. Email Service (SMTP) (`● Connected`)
    8. SMS Service (`● Not Connected`)
    9. WhatsApp Business (`● Not Connected`)
  - Each item includes branded provider logo, connection indicator, `Configure` button, and context menu.
- **System Maintenance**:
  - `Software Version`: `v2.4.1` with `Up to date` pill badge
  - `Last Backup`: `24 Sep 2024, 02:00 AM` with `Backup Now` outlined button
  - `Database Size`: `12.4 GB` with `Manage` outlined button
  - `Clear Cache`: `Free up system cache` with `Clear Cache` outlined button

---

## Interactive Modals & Drawers
1. **ResetSettingsModal**: Prompts confirmation before resetting configuration to baseline defaults.
2. **IntegrationConfigModal**: Configures endpoints, masked API keys, SMTP credentials, or WhatsApp business accounts. Includes ping test tool.
3. **PasswordPolicyModal**: Sets character lengths, uppercase/lowercase rules, numbers, symbols, and expiration cycles.
4. **IpAccessModal**: Administers CIDR blocks and IP addresses authorized to access the console.
5. **BackupConfirmModal**: Triggers immediate cloud snapshot backup.
6. **DatabaseManageModal**: Inspects disk storage breakdown (events, images, Postgres, audit logs) and triggers table vacuuming.
7. **ClearCacheModal**: Invalidates Redis query cache and reclaims memory.

---

## Other Tab Views
- **Store Configuration**: Full store address, contact coordinates, zone topology, and billing counter setup.
- **Integrations**: Expanded connector directory with webhook endpoints and sync latency monitors.
- **Notifications**: Granular channel dispatch rules, push notification toggles, and digest frequency selectors.
- **AI & Analytics**: Edge vs. Cloud processing mode, automated face/PII blurring, data retention policies, and computer vision confidence thresholds.
- **Security**: Security posture evaluation, 2FA enforcement, audit log status, and session policies.
- **System**: Host health diagnostics, server uptime, database allocation, and software update checks.

---

## API Integration Architecture
All operations interact with `settingsService.ts` which encapsulates calls via `apiClient.ts` with graceful mock fallbacks:
- `GET /api/settings`
- `PATCH /api/settings`
- `GET /api/settings/general`
- `PATCH /api/settings/general`
- `GET /api/settings/store`
- `PATCH /api/settings/store`
- `GET /api/settings/notifications`
- `PATCH /api/settings/notifications`
- `GET /api/settings/security`
- `PATCH /api/settings/security`
- `GET /api/settings/integrations`
- `PATCH /api/settings/integrations/:id`
- `POST /api/settings/integrations/:id/test`
- `GET /api/settings/ai`
- `PATCH /api/settings/ai`
- `GET /api/settings/system`
- `POST /api/settings/system/backup`
- `POST /api/settings/system/clear-cache`
- `POST /api/settings/reset`
