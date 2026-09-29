# Users & Access

## Route
`/users`

## Purpose
Manage users, system roles, granular permissions, store access scopes, and security audit logs across all stores and modules within RetailEdge AI.

---

## Sections

### 1. KPI Summary
Five high-level access management metrics:
- **Total Users**: `28` (↑ 12%, green users icon `#0fa968`)
- **Active Users**: `24` (↑ 9%, purple user-check icon `#8b5cf6`)
- **Inactive Users**: `4` (↓ 33%, red user-x icon `#ef4444`)
- **User Roles**: `6` (— 0%, blue shield icon `#2563eb`)
- **Permission Groups**: `12` (↑ 20%, amber key icon `#f59e0b`)

### 2. Functional Tab Navigation
- **Users** (Default View): All user records, role assignments, store access, and real-time status.
- **Roles**: Dedicated role management view with user counts and scope boundaries.
- **Permissions**: Granular module-level action permissions matrix.
- **Access Control**: Store authorization policies and session parameters.
- **Activity Logs**: Complete security access and audit trail.

### 3. All Users Table
Comprehensive user management table with:
- Search input (`Search users...`)
- Filter dropdowns (`All Roles`, `All Stores`, `All Status`) and `Filter` trigger.
- Checkbox selection with bulk actions (Activate, Deactivate, Clear).
- Columns: Checkbox, `#`, Name (with circular avatar/initials), Email, Role Badge, Store Access, Status (`● Online` / `● Offline`), Last Login, and Actions (Edit & context menu).
- Bottom pagination: `Showing 1 to 8 of 28 users` with interactive page switches (`<` `1` `2` `3` `4` `>`).

### 4. User Roles Panel
Right-side system roles panel:
- Super Admin: Full system access (`2 users`, Crown icon)
- Store Manager: Manage store operations (`6 users`, Users icon)
- Inventory Staff: Manage inventory & stock (`5 users`, Package icon)
- Cashier: POS operations & billing (`6 users`, Receipt icon)
- Security: Camera monitoring & alerts (`3 users`, Shield icon)
- Analyst: View reports & analytics (`4 users`, BarChart icon)
- Primary action: `+ Add Role` modal.

### 5. Permission Matrix
Cross-module access authorization matrix:
- **Modules**: Dashboard, Shopper Analytics, Inventory Monitoring, Queue Intelligence, Planogram Compliance.
- **Roles**: Super Admin, Store Manager, Inventory Staff, Cashier, Security, Analyst, Viewer.
- Allowed (✓) and Restricted (✕) badges with interactive click-to-edit granular permissions modal.

### 6. Recent Access Activity
Audit log monitoring recent user logins, configuration updates, and security events:
- User avatar, Name, Action, Target Module, and Timestamp.
- Interactive `View All →` trigger.

---

## Component Architecture

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| `UsersAccessPage` | `src/pages/users/UsersAccessPage.tsx` | Main coordinator managing state, active tab, and modals |
| `UsersAccessHeader` | `src/components/users/UsersAccessHeader.tsx` | Page title, subtitle, date selector, and Add User trigger |
| `UserKpiGrid` | `src/components/users/UserKpiGrid.tsx` | Container for the 5 KPI summary cards |
| `UserKpiCard` | `src/components/users/UserKpiCard.tsx` | Individual KPI card with sparkline and trend |
| `UsersAccessTabs` | `src/components/users/UsersAccessTabs.tsx` | Sub-navigation bar with active bottom indicator |
| `UsersTable` | `src/components/users/UsersTable.tsx` | Filterable and paginated user table with multi-select |
| `UserTableRow` | `src/components/users/UserTableRow.tsx` | Individual row with role badges, status dots, and 3-dot menu |
| `UserRolesPanel` | `src/components/users/UserRolesPanel.tsx` | Roles overview card with user counts and action menus |
| `PermissionMatrix` | `src/components/users/PermissionMatrix.tsx` | Module x Role permission visualization matrix |
| `RecentAccessActivity` | `src/components/users/RecentAccessActivity.tsx` | Access audit table displaying latest operational actions |
| `AddUserModal` | `src/components/users/AddUserModal.tsx` | Modal form to invite and register a new user |
| `EditUserModal` | `src/components/users/EditUserModal.tsx` | Modal form to edit user details and assigned store scopes |
| `UserProfileDrawer` | `src/components/users/UserProfileDrawer.tsx` | Detail view of user metadata and security status |
| `AddRoleModal` | `src/components/users/AddRoleModal.tsx` | Modal to create custom system/store roles |
| `PermissionDetailsModal`| `src/components/users/PermissionDetailsModal.tsx` | Granular CRUD permission editor for a role/module pair |

---

## Mock Data Source
File: `src/data/usersAccessMockData.ts`
- `USER_SUMMARY_MOCK`: KPIs and percentage trends
- `USERS_LIST_MOCK`: 8 user records matching reference screenshot
- `ROLES_LIST_MOCK`: 6 system roles
- `PERMISSION_MATRIX_MOCK`: 5 module access rows
- `ACCESS_ACTIVITIES_MOCK`: 6 audit log entries
