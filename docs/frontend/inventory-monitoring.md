# Inventory Monitoring

## Route
`/inventory`

## Purpose
Real-time shelf monitoring, stock status, and product analytics for retail stores.

## Page Sections
1. **Page Header**: Title "Inventory Management", subtitle, date selector ("Today, 24 Sep 2024"), time range pills ("Today", "7 Days", "30 Days"), and CSV "Export" action button.
2. **KPI Cards (6 Cards)**:
   - Total Products: `1,248` (↑ 3%)
   - In Stock: `1,181 (95%)` (↑ 4%)
   - Low Stock: `42 (3%)`
   - Out of Stock: `25 (2%)` (↓ 12%)
   - Planogram Compliance: `96%` (↑ 3%)
   - Restock Required: `18` (View List →)
3. **Main Analytics Grid**:
   - **Live Shelf View**: Shelf image with real-time detection boxes, status badges, Aisle/Camera dropdowns.
   - **Inventory Status Distribution**: Recharts donut chart with centered product count and stock breakdown.
   - **Category-wise Stock Status**: Stacked horizontal progress bars across retail categories.
   - **Stock Trend**: Recharts LineChart tracking In Stock, Low Stock, and Out of Stock levels.
   - **Shelf Health - AI Analysis**: Thermal shelf health map with status legend.
4. **Bottom Tables**:
   - **Low Stock & Out of Stock Items**: Table with product images, SKU, stock metrics, status pills, and last detected timestamp.
   - **Recent Inventory Events**: Chronological activity log of stock changes and restocks.
