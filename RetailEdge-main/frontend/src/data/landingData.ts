export interface NavLink {
  label: string;
  href: string;
}

export interface MetricItem {
  label: string;
  value: string;
  change: string;
  icon: 'currency' | 'box' | 'store';
}

export interface FloatingCardItem {
  id: string;
  title: string;
  icon: 'package' | 'store' | 'bar-chart' | 'shield';
}

export interface FeatureStripItem {
  id: string;
  title: string;
  description: string;
  icon: 'box' | 'shopping-cart' | 'store' | 'bar-chart' | 'shield-alert' | 'camera' | 'users';
  theme: 'green' | 'purple' | 'amber' | 'blue' | 'rose' | 'violet' | 'teal';
}

export interface TrustStatItem {
  value: string;
  label: string;
  icon: 'store' | 'users' | 'trending-up' | 'shield-check';
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: 'zap' | 'currency' | 'trending-up' | 'shield';
  color: 'amber' | 'green' | 'emerald' | 'blue';
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface SolutionItem {
  id: string;
  name: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  storeCount: string;
  featuresSummary: string;
  buttonText: string;
  isPopular?: boolean;
  popularBadge?: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const LANDING_DATA = {
  navLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Product', href: '#product' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Resources', href: '#resources' },
    { label: 'About', href: '#about' },
  ] as NavLink[],

  hero: {
    badge: 'AI-Powered Retail Management',
    headlinePart1: 'Smarter Stores.',
    headlinePart2: 'Happier Customers.',
    description:
      'RetailEdge AI helps you manage products, inventory, billing, stores and compliance — all in one intelligent platform powered by AI and real-time insights.',
    ctaPrimary: 'Get Started →',
    ctaSecondary: 'Watch Demo',
    trustPoints: [
      'Easy Setup',
      'Scalable for Multi-Stores',
      'Secure & Compliant',
    ],
    storeImage: '/images/hero_store_pos.jpg',
  },

  heroFloatingCards: [
    {
      id: 'inventory',
      title: 'Real-time\nInventory',
      icon: 'package',
    },
    {
      id: 'multistore',
      title: 'Multi-Store\nManagement',
      icon: 'store',
    },
    {
      id: 'analytics',
      title: 'AI Analytics\n& Insights',
      icon: 'bar-chart',
    },
    {
      id: 'secure',
      title: 'Secure &\nCompliant',
      icon: 'shield',
    },
  ] as FloatingCardItem[],

  heroLiveOverview: {
    title: 'Live Store Overview',
    status: 'Live',
    metrics: [
      {
        label: 'Total Sales',
        value: '₹ 4,28,760',
        change: '↑ 12%',
        icon: 'currency',
      },
      {
        label: 'Products',
        value: '1,248',
        change: '↑ 8%',
        icon: 'box',
      },
      {
        label: 'Active Stores',
        value: '24',
        change: '↑ 9%',
        icon: 'store',
      },
    ] as MetricItem[],
  },

  featureStrip: [
    {
      id: 'inventory-mgmt',
      title: 'Inventory Management',
      description: 'Real-time stock tracking across all stores',
      icon: 'box',
      theme: 'green',
    },
    {
      id: 'pos-billing',
      title: 'POS & Billing',
      description: 'Fast, secure and seamless checkout',
      icon: 'shopping-cart',
      theme: 'purple',
    },
    {
      id: 'multi-store',
      title: 'Multi-Store Operations',
      description: 'Manage multiple outlets from one platform',
      icon: 'store',
      theme: 'amber',
    },
    {
      id: 'ai-analytics',
      title: 'AI Analytics & Insights',
      description: 'Get actionable insights with AI',
      icon: 'bar-chart',
      theme: 'blue',
    },
    {
      id: 'compliance-alerts',
      title: 'Compliance & Alerts',
      description: 'Stay compliant with automated monitoring',
      icon: 'shield-alert',
      theme: 'rose',
    },
    {
      id: 'camera-mgmt',
      title: 'Camera Management',
      description: 'Monitor stores with live camera feeds',
      icon: 'camera',
      theme: 'violet',
    },
    {
      id: 'user-access',
      title: 'User & Access',
      description: 'Role-based access and permissions',
      icon: 'users',
      theme: 'teal',
    },
  ] as FeatureStripItem[],

  trustStats: {
    badge: 'TRUSTED BY MODERN RETAIL BUSINESSES',
    headline: 'Powering Smarter Retail Across India',
    stats: [
      {
        value: '500+',
        label: 'Retail Stores',
        icon: 'store',
      },
      {
        value: '50,000+',
        label: 'Happy Customers',
        icon: 'users',
      },
      {
        value: '2M+',
        label: 'Transactions / Month',
        icon: 'trending-up',
      },
      {
        value: '99.9%',
        label: 'Platform Uptime',
        icon: 'shield-check',
      },
    ] as TrustStatItem[],
  },

  whyChoose: {
    heading: 'Why Choose RetailEdge AI?',
    subtitle: 'Everything you need to run and grow your retail business.',
    cards: [
      {
        title: 'Save Time',
        description: 'Automate daily operations and reduce manual work.',
        icon: 'zap',
        color: 'amber',
      },
      {
        title: 'Reduce Costs',
        description: 'Optimize inventory and minimize losses.',
        icon: 'currency',
        color: 'green',
      },
      {
        title: 'Grow Faster',
        description: 'Get data-driven insights to make better decisions.',
        icon: 'trending-up',
        color: 'emerald',
      },
      {
        title: 'Stay Compliant',
        description: 'Built-in compliance tools and real-time alerts.',
        icon: 'shield',
        color: 'blue',
      },
    ] as WhyChooseItem[],
  },

  howItWorks: {
    heading: 'How It Works',
    subtitle: 'Get started in just a few simple steps.',
    steps: [
      {
        stepNumber: 1,
        title: 'Sign Up',
        description: 'Create your account in minutes.',
      },
      {
        stepNumber: 2,
        title: 'Set Up Stores',
        description: 'Add your stores, products and staff.',
      },
      {
        stepNumber: 3,
        title: 'Go Live',
        description: 'Start managing your business with AI.',
      },
    ] as HowItWorksStep[],
  },

  solutions: {
    heading: 'Our Solutions',
    subtitle: 'Designed for every type of retail business.',
    items: [
      {
        id: 'supermarket',
        name: 'Supermarkets & Grocery',
        image: '/images/solution_supermarket.jpg',
      },
      {
        id: 'fashion',
        name: 'Fashion & Apparel',
        image: '/images/solution_fashion.jpg',
      },
      {
        id: 'electronics',
        name: 'Electronics & Mobile',
        image: '/images/solution_electronics.jpg',
      },
      {
        id: 'pharmacy',
        name: 'Pharmacy & Healthcare',
        image: '/images/solution_pharmacy.jpg',
      },
      {
        id: 'multistore',
        name: 'Multi-Store Retail Chains',
        image: '/images/solution_multistore.jpg',
      },
    ] as SolutionItem[],
  },

  testimonials: {
    heading: 'What Our Customers Say',
    items: [
      {
        id: 'rahul',
        name: 'Rahul Sharma',
        role: 'Store Owner, Delhi',
        avatar: '/images/customer_rahul.jpg',
        rating: 5,
        quote:
          'RetailEdge AI has transformed the way we manage our stores. Inventory, billing and reports — everything is so easy now.',
      },
      {
        id: 'ananya',
        name: 'Ananya Verma',
        role: 'Operations Director, Mumbai',
        avatar: '/images/customer_rahul.jpg',
        rating: 5,
        quote:
          'With real-time camera and queue intelligence, cashier line waiting dropped by 35% in our flagship supermarket.',
      },
      {
        id: 'vikram',
        name: 'Vikram Singhania',
        role: 'Chain Director, Bengaluru',
        avatar: '/images/customer_rahul.jpg',
        rating: 5,
        quote:
          'Multi-store visibility gave our regional managers instantaneous control over out-of-stock items and planogram compliance.',
      },
    ] as TestimonialItem[],
  },

  pricing: {
    heading: 'Pricing',
    subtitle: 'Flexible plans for businesses of all sizes.',
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        price: '₹1,999',
        period: '/month',
        storeCount: '1 Store',
        featuresSummary: 'Basic Features',
        buttonText: 'Get Started',
        isPopular: false,
      },
      {
        id: 'business',
        name: 'Business',
        price: '₹4,999',
        period: '/month',
        storeCount: 'Up to 5 Stores',
        featuresSummary: 'Advanced Features',
        buttonText: 'Get Started',
        isPopular: true,
        popularBadge: 'Most Popular',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        storeCount: 'Unlimited Stores',
        featuresSummary: 'All Features + Support',
        buttonText: 'Contact Sales',
        isPopular: false,
      },
    ] as PricingPlan[],
  },

  finalCta: {
    heading: 'Ready to Transform Your Retail Business?',
    subtitle:
      'Join thousands of retailers who are already growing with RetailEdge AI.',
    ctaPrimary: 'Get Started →',
    ctaSecondary: 'Request a Demo',
    bgImage: '/images/retail_shopper_bg.jpg',
  },

  footer: {
    brandName: 'RetailEdge AI',
    tagline: 'Smarter Stores. Happier Customers.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Integrations', href: '#product' },
        ],
      },
      {
        title: 'Solutions',
        links: [
          { label: 'Retail Stores', href: '#solutions' },
          { label: 'Multi-Store Chains', href: '#solutions' },
          { label: 'Finance', href: '#solutions' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Blog', href: '#resources' },
          { label: 'Help Center', href: '#resources' },
          { label: 'Documentation', href: '#resources' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '#about' },
          { label: 'Careers', href: '#about' },
          { label: 'Contact Us', href: '#about' },
        ],
      },
    ] as FooterColumn[],
    socials: [
      { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com' },
      { name: 'X', icon: 'twitter', href: 'https://x.com' },
      { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com' },
      { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com' },
    ],
    copyright: '© 2026 RetailEdge AI. All rights reserved.',
    legalLinks: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookies Policy', href: '#cookies' },
    ],
  },
};
