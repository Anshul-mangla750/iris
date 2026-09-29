export type PlanogramIssueType =
  | 'Missing'
  | 'Misplaced'
  | 'Extra Product'
  | 'Wrong Position'
  | 'Correct';

export interface PlanogramOverview {
  overallCompliance: number; // 96
  overallComplianceTrend: number; // 3
  correctlyPlaced: number; // 1248
  correctlyPlacedTrend: number; // 5
  misplacedProducts: number; // 32
  misplacedTrend: number; // -20
  missingProducts: number; // 18
  missingTrend: number; // -28
  extraProducts: number; // 12
  extraTrend: number; // -14
}

export interface LiveShelfDetectionData {
  aisle: string;
  camera: string;
  imageUrl: string;
}

export interface PlanogramComparisonData {
  expectedImageUrl: string;
  actualImageUrl: string;
  legend: {
    name: string;
    color: string;
  }[];
}

export interface CategoryComplianceItem {
  category: string;
  percentage: number;
  status: 'high' | 'medium' | 'low';
}

export interface ShelfComplianceTrendPoint {
  date: string;
  overall: number;
  correct: number;
  misplaced: number;
  missing: number;
}

export interface NonCompliantProductItem {
  id: string;
  productName: string;
  sku: string;
  issueType: PlanogramIssueType;
  aisleShelf: string;
  image: string;
  actionText: 'Restock' | 'Reposition' | 'Remove';
}

export interface PlanogramAIInsight {
  id: string;
  iconType: 'warning' | 'lightbulb' | 'trend' | 'info' | 'barchart';
  title: string;
  description: string;
}

export type PlanogramStatus = 'Active' | 'Draft' | 'Archived';

export interface PlanogramPosition {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  position: number;
  expectedQuantity: number;
  category: string;
  status: 'Correct' | 'Misplaced' | 'Missing' | 'Extra';
}

export interface PlanogramShelf {
  id: string;
  name: string;
  label: string; // e.g., "Shelf 4"
  tierSubtitle?: string; // e.g., "Premium", "Core", "High Turnover", "Value"
  priority?: string;
  positions: PlanogramPosition[];
}

export interface PlanogramItem {
  id: string;
  organizationId: string;
  storeId: string;
  zoneId?: string;
  name: string;
  location: string; // "Aisle 2"
  description?: string;
  status: PlanogramStatus;
  shelfCount: number;
  totalSkus: number;
  complianceRate: number;
  assignedTo: string;
  thumbnail: string;
  lastUpdated?: string;
  shelves?: PlanogramShelf[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanogramComplianceSummary {
  planogramId: string;
  complianceRate: number;
  correct: number;
  misplaced: number;
  missing: number;
  extra: number;
  lastCheckedAt?: string;
}

