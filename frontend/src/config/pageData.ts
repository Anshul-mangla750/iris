import type { FeatureItem, StatItem } from '../types/auth';

export const LOGIN_PAGE_CONFIG = {
  brandName: 'RetailEdge',
  brandSuffix: 'AI',
  tagline: 'Smarter Stores. Happier Customers.',
  headline: {
    line1: 'AI-powered',
    line2: 'Retail Intelligence',
    line3Prefix: 'for ',
    line3Highlight: 'Smarter Stores',
  },
  description:
    'Monitor shelves, understand customers, manage queues and get real-time insights — all in one platform.',
  backgroundImage: '/images/retail_shopper_bg.jpg',
  card: {
    heading: 'Sign in to your account',
    subtitle: 'Access your dashboard and manage your stores',
    emailLabel: 'Email',
    emailPlaceholder: 'admin@store.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••••••',
    rememberMeLabel: 'Remember me',
    forgotPasswordLabel: 'Forgot password?',
    submitButtonText: 'Sign In →',
    orContinueWith: 'Or continue with',
    footerText: 'New to RetailEdge AI? Contact your administrator.',
  },
};

export const LOGIN_FEATURES: FeatureItem[] = [
  {
    id: 'shopper-analytics',
    title: 'Shopper Analytics',
    description: 'Footfall, dwell time, heatmaps',
    iconName: 'bar-chart',
  },
  {
    id: 'inventory-monitoring',
    title: 'Inventory Monitoring',
    description: 'Real-time shelf & stock tracking',
    iconName: 'box',
  },
  {
    id: 'queue-intelligence',
    title: 'Queue Intelligence',
    description: 'Predict & reduce waiting time',
    iconName: 'users',
  },
  {
    id: 'planogram-compliance',
    title: 'Planogram Compliance',
    description: 'Ensure correct product placement',
    iconName: 'clipboard',
  },
  {
    id: 'alerts-notifications',
    title: 'Alerts & Notifications',
    description: 'Instant real-time alerts',
    iconName: 'bell',
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    description: 'Data-driven decisions',
    iconName: 'analytics',
  },
  {
    id: 'camera-management',
    title: 'Camera Management',
    description: 'Manage and monitor all cameras',
    iconName: 'camera',
  },
];

export const LOGIN_STATS: StatItem[] = [
  {
    id: 'stores-monitored',
    value: '500+',
    label: 'Stores Monitored',
    iconName: 'store',
  },
  {
    id: 'daily-visitors',
    value: '1M+',
    label: 'Daily Visitors',
    iconName: 'users',
  },
  {
    id: 'shelf-accuracy',
    value: '99%',
    label: 'Shelf Accuracy',
    iconName: 'cube',
  },
  {
    id: 'queue-reduction',
    value: '30%',
    label: 'Less Queue Time',
    iconName: 'clock',
  },
];
