import type {
  PlanogramOverview,
  LiveShelfDetectionData,
  PlanogramComparisonData,
  CategoryComplianceItem,
  ShelfComplianceTrendPoint,
  NonCompliantProductItem,
  PlanogramAIInsight,
} from '../types/planogram';

export const PLANOGRAM_OVERVIEW_MOCK: PlanogramOverview = {
  overallCompliance: 96,
  overallComplianceTrend: 3,
  correctlyPlaced: 1248,
  correctlyPlacedTrend: 5,
  misplacedProducts: 32,
  misplacedTrend: -20,
  missingProducts: 18,
  missingTrend: -28,
  extraProducts: 12,
  extraTrend: -14,
};

export const LIVE_SHELF_DETECTION_MOCK: LiveShelfDetectionData = {
  aisle: 'Aisle 2 - Snacks',
  camera: 'Camera 1',
  imageUrl: '/images/planogram/live_shelf_detection.png',
};

export const PLANOGRAM_COMPARISON_MOCK: PlanogramComparisonData = {
  expectedImageUrl: '/images/planogram/expected_planogram.png',
  actualImageUrl: '/images/planogram/actual_shelf.png',
  legend: [
    { name: 'Correct', color: '#10B981' },
    { name: 'Misplaced', color: '#F59E0B' },
    { name: 'Missing', color: '#EF4444' },
    { name: 'Extra', color: '#8B5CF6' },
  ],
};

export const CATEGORY_COMPLIANCE_MOCK: CategoryComplianceItem[] = [
  { category: 'Snacks', percentage: 98, status: 'high' },
  { category: 'Beverages', percentage: 95, status: 'high' },
  { category: 'Dairy', percentage: 92, status: 'high' },
  { category: 'Personal Care', percentage: 97, status: 'high' },
  { category: 'Home Care', percentage: 93, status: 'high' },
  { category: 'Packaged Food', percentage: 88, status: 'medium' },
  { category: 'Bakery', percentage: 96, status: 'high' },
  { category: 'Confectionery', percentage: 91, status: 'medium' },
  { category: 'Others', percentage: 94, status: 'high' },
];

export const SHELF_COMPLIANCE_TREND_MOCK: ShelfComplianceTrendPoint[] = [
  { date: '18 Sep', overall: 86, correct: 84, misplaced: 16, missing: 10 },
  { date: '19 Sep', overall: 87, correct: 85, misplaced: 15, missing: 9 },
  { date: '20 Sep', overall: 89, correct: 87, misplaced: 14, missing: 9 },
  { date: '21 Sep', overall: 92, correct: 90, misplaced: 14, missing: 8 },
  { date: '22 Sep', overall: 92, correct: 91, misplaced: 13, missing: 8 },
  { date: '23 Sep', overall: 90, correct: 89, misplaced: 14, missing: 9 },
  { date: '24 Sep', overall: 94, correct: 93, misplaced: 13, missing: 8 },
];

export const NON_COMPLIANT_ITEMS_MOCK: NonCompliantProductItem[] = [
  {
    id: '1',
    productName: 'Lays Classic 52g',
    sku: 'LAY003',
    issueType: 'Missing',
    aisleShelf: 'Aisle 2 - Shelf 3',
    image: '/images/planogram/thumb_lays.png',
    actionText: 'Restock',
  },
  {
    id: '2',
    productName: 'Doritos Nacho 75g',
    sku: 'DOR002',
    issueType: 'Misplaced',
    aisleShelf: 'Aisle 2 - Shelf 2',
    image: '/images/planogram/thumb_doritos.png',
    actionText: 'Reposition',
  },
  {
    id: '3',
    productName: 'Pringles Original',
    sku: 'PRI001',
    issueType: 'Extra Product',
    aisleShelf: 'Aisle 2 - Shelf 1',
    image: '/images/planogram/thumb_pringles.png',
    actionText: 'Remove',
  },
  {
    id: '4',
    productName: 'Kurkure Masala',
    sku: 'KUR010',
    issueType: 'Wrong Position',
    aisleShelf: 'Aisle 2 - Shelf 3',
    image: '/images/planogram/thumb_kurkure.png',
    actionText: 'Reposition',
  },
  {
    id: '5',
    productName: 'Coca Cola 500ml',
    sku: 'COC002',
    issueType: 'Missing',
    aisleShelf: 'Aisle 4 - Shelf 2',
    image: '/images/planogram/thumb_coca_cola.png',
    actionText: 'Restock',
  },
];

export const PLANOGRAM_AI_INSIGHTS_MOCK: PlanogramAIInsight[] = [
  {
    id: 'ins-1',
    iconType: 'warning',
    title: 'High non-compliance in Snacks',
    description: '3 products missing, 2 misplaced in Aisle 2',
  },
  {
    id: 'ins-2',
    iconType: 'lightbulb',
    title: 'Replenish Lays Classic 52g',
    description: 'Out of stock for 45 minutes',
  },
  {
    id: 'ins-3',
    iconType: 'trend',
    title: 'Shelf compliance improved',
    description: 'Overall compliance increased by 3%',
  },
  {
    id: 'ins-4',
    iconType: 'info',
    title: 'Frequent misplacement detected',
    description: 'Kurkure products often placed in wrong section',
  },
  {
    id: 'ins-5',
    iconType: 'barchart',
    title: 'Optimize shelf space',
    description: 'Consider increasing facing count for top products',
  },
];
