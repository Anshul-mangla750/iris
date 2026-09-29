# Products & Planogram

## Route
`/products-planogram`

## Purpose
Manage the centralized retail product catalog, pricing, category taxonomy, shelf placement, and planograms with visual gondola layouts and compliance tracking.

---

## Page Architecture & Sections

1. **Top Application Header & Global Navigation**
   - Active route display with store context (`Store 001 - City Mall, Delhi`), live stream pulse, system notification indicators, and current user avatar.
   - Global Search: `Search products, SKUs, categories...`

2. **Product Management Header**
   - Title: `Products Management`
   - Subtitle: `Manage your product catalog, pricing, categories and shelf placement details.`
   - Controls: Category dropdown filter (`All Categories`), search input (`Search products...`), primary `+ Add Product` button, secondary `Import/Export ▼` dropdown.

3. **Product KPI Cards (5 Cards)**
   - **Total Products**: `1,248` (`↑ 8%`) — Green box icon
   - **Active SKUs**: `1,156` (`↑ 5%`) — Green barcode icon
   - **Low Stock Items**: `32` (`↓ 28%`) — Amber alert triangle icon
   - **Out of Stock**: `18` (`↓ 40%`) — Purple package/gift icon
   - **Categories**: `24` (`↑ 4%`) — Yellow tag icon

4. **Product Table ("All Products")**
   - Filters: Category (`All Categories`), Status (`All Status`), Stock Level (`Stock Level`), and Reset Filter button.
   - Columns:
     1. Selection Checkbox
     2. `#` (Index)
     3. `Product` (Thumbnail image + Name)
     4. `SKU`
     5. `Category`
     6. `Price (₹)`
     7. `Stock`
     8. `Status` (`In Stock` [emerald], `Low Stock` [amber], `Out of Stock` [rose])
     9. `Planogram` (Location link, e.g., `Aisle 2 - Shelf 3`)
     10. `Actions` (Edit Pencil, Analytics/Inventory BarChart, More Vertical ⋮)
   - Row Actions Menu:
     - View Product (opens Product Details Drawer)
     - Edit Product (opens Edit Product Modal)
     - View Planogram (focuses planogram layout)
     - View Inventory (cross-links to `/inventory?product=...`)
     - Delete Product (removes from catalog)

5. **Product Category Distribution (Donut Chart)**
   - Recharts Donut Pie Chart displaying category breakdown:
     - Snacks: 28% (#10B981)
     - Beverages: 18% (#F59E0B)
     - Dairy: 12% (#06B6D4)
     - Personal Care: 10% (#3B82F6)
     - Home Care: 8% (#8B5CF6)
     - Bakery: 8% (#EC4899)
     - Confectionery: 6% (#F97316)
     - Others: 20% (#94A3B8)
   - Centered Metric: `1,248 Products`

6. **Planogram Management Header**
   - Title: `Planogram Management`
   - Subtitle: `Create, assign and monitor planograms for optimal product placement and shelf compliance.`
   - Controls: Store selector (`Store 001 - City Mall, Delhi`), Aisle selector (`Aisle 2 - Snacks`), `+ Create Planogram` primary button, `More Actions ▼` menu.

7. **Planogram Library (Left Column)**
   - Search input (`Search planograms...`)
   - 5 Planograms with realistic thumbnails, metadata (Aisle, Shelves, SKUs), active/draft status badges, and 3-dot context menu (View, Edit, Duplicate, Assign, Archive).
     - Snacks - Standard (Active)
     - Beverages - Premium (Active)
     - Dairy - Chilled (Active)
     - Personal Care (Active)
     - Home Care (Draft)

8. **Planogram Editor (Center Column)**
   - View Mode Switcher:
     - **Visual View** (Default): 4 Shelf indicators (`Shelf 4 / Premium`, `Shelf 3 / Core`, `Shelf 2 / High Turnover`, `Shelf 1 / Value`) and 4-tier snack gondola visual layout with product rows.
     - **Table View**: Shelf position table with SKU, expected quantity, and placement statuses (`Correct`, `Misplaced`, `Missing`, `Extra`).
     - **Compliance View**: Overall compliance score (96%), progress bar, and breakdown counters.

9. **Planogram Details (Right Column)**
   - Status: `● Active`
   - Last Updated: `24 Sep 2024, 10:30 AM`
   - Total Shelves: `4`
   - Total SKUs: `48`
   - Assigned To: `Store 001 - City Mall`
   - Compliance Rate: `96%` with green progress bar
   - Action Button: `View Compliance Report` (navigates to `/planogram`)

---

## Components Directory
Location: `src/components/products-planogram/`

| Component | Responsibility |
|---|---|
| `ProductManagementHeader.tsx` | Category selector, search bar, Add Product & Import/Export buttons |
| `ProductKpiCard.tsx` | Individual metric card with icon container, trend indicator, and SVG sparkline |
| `ProductKpiGrid.tsx` | 5-column responsive KPI grid |
| `ProductTable.tsx` | All Products table with multi-select, filters, and row action menus |
| `ProductCategoryChart.tsx` | Recharts donut chart with centered total count and category legend |
| `PlanogramManagementHeader.tsx` | Planogram section title, store/aisle selectors, Create Planogram & More Actions |
| `PlanogramLibrary.tsx` | Searchable list of planograms |
| `PlanogramLibraryItem.tsx` | Individual planogram card with thumbnail, badge, and context menu |
| `PlanogramEditor.tsx` | Container for Visual, Table, and Compliance views with mode toggle |
| `PlanogramVisualView.tsx` | 4-tier shelf indicators and gondola visual display |
| `PlanogramTableView.tsx` | Tabular shelf-position assignments and compliance statuses |
| `PlanogramComplianceView.tsx` | Detailed compliance breakdown metrics |
| `PlanogramDetails.tsx` | Metadata card with compliance rate and report navigation button |
| `AddProductModal.tsx` | Modal form for creating catalog products |
| `EditProductModal.tsx` | Modal form for editing product pricing, stock, and metadata |
| `ProductDetailsDrawer.tsx` | Slide-over drawer with full product details and quick actions |
| `CreatePlanogramModal.tsx` | Modal form for configuring new planogram layouts |

---

## Mock Data Source
Location: `src/data/productPlanogramMockData.ts`
- `INITIAL_PRODUCTS`: 5 primary catalog products (Lays Classic, Coca Cola, Amul Milk, Maggi, Dove Soap)
- `PRODUCT_SUMMARY_MOCK`: Top KPI statistics and trends
- `CATEGORY_DISTRIBUTION_MOCK`: Category counts, percentages, and color hexes
- `PLANOGRAM_ITEMS_MOCK`: 5 library planograms with full shelf positions
- `PLANOGRAM_SHELVES_MOCK`: 4 shelf tiers with product position assignments
- `PLANOGRAM_COMPLIANCE_MOCK`: Overall compliance rate (96%), correct (48), misplaced (3), missing (5), extra (2)
