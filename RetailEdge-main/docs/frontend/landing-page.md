# RetailEdge AI — Landing Page Documentation

## 1. Overview
- **Route**: `/`
- **Purpose**: Public-facing marketing and product introduction page for the RetailEdge AI enterprise retail intelligence platform.
- **Architectural Pattern**: Modular, component-driven, statically configured landing page with smooth-scroll section routing and interactive modal demonstrations.

---

## 2. Page Sections & Visual Composition

1. **Header / Navbar**:
   - Fixed sticky white navigation bar with subtle elevation shadow.
   - RetailEdge AI logo with green leaf emblem and tagline: *"Smarter Stores. Happier Customers."*
   - Desktop navigation links: *Home*, *Product*, *Solutions*, *Features*, *Pricing*, *Resources*, *About*.
   - Active section pill indicator with green bottom bar.
   - Search trigger, Login button (navigates to `/login`), and primary "Get Started →" CTA (navigates to `/login`).
   - Mobile responsive drawer with toggle menu.

2. **Hero Section**:
   - Left Column:
     - Badge: *"AI-Powered Retail Management"* with sparkle vector icon.
     - Headline: *"Smarter Stores. **Happier Customers.**"* (with RetailEdge green accent `#0fa968`).
     - Value proposition description.
     - Action CTAs: *"Get Started →"* ($\rightarrow$ `/login`) and *"Watch Demo"* (triggers interactive `DemoModal`).
     - Trust points: *✓ Easy Setup*, *✓ Scalable for Multi-Stores*, *✓ Secure & Compliant*.
   - Right Column:
     - Supermarket retail store visual (`/images/hero_store_pos.jpg`) framed in an organic green curve backdrop.
     - Floating Card 1: *Real-time Inventory* (`Package` in green container).
     - Floating Card 2: *Multi-Store Management* (`Store` in teal container).
     - Floating Card 3: *AI Analytics & Insights* (`BarChart3` in green container).
     - Floating Card 4: *Secure & Compliant* (`ShieldCheck` in green container).
     - Top Overview Card: *Live Store Overview* with live pulse badge and 3 real-time metrics (Total Sales: `₹ 4,28,760` ↑12%, Products: `1,248` ↑8%, Active Stores: `24` ↑9%).

3. **Feature Strip**:
   - 7 horizontal service capability cards:
     1. *Inventory Management*: Real-time stock tracking across all stores (`Package`, green).
     2. *POS & Billing*: Fast, secure and seamless checkout (`ShoppingCart`, purple).
     3. *Multi-Store Operations*: Manage multiple outlets from one platform (`Store`, amber).
     4. *AI Analytics & Insights*: Get actionable insights with AI (`BarChart3`, blue).
     5. *Compliance & Alerts*: Stay compliant with automated monitoring (`ShieldAlert`, rose).
     6. *Camera Management*: Monitor stores with live camera feeds (`Camera`, violet).
     7. *User & Access*: Role-based access and permissions (`Users`, teal).

4. **Trust Statistics**:
   - Badge: *TRUSTED BY MODERN RETAIL BUSINESSES*.
   - Headline: *Powering Smarter Retail Across India*.
   - 4 key metrics:
     - **500+** Retail Stores
     - **50,000+** Happy Customers
     - **2M+** Transactions / Month
     - **99.9%** Platform Uptime

5. **Why Choose RetailEdge AI?**:
   - 2x2 grid of value cards:
     - *Save Time*: Automate daily operations and reduce manual work.
     - *Reduce Costs*: Optimize inventory and minimize losses.
     - *Grow Faster*: Get data-driven insights to make better decisions.
     - *Stay Compliant*: Built-in compliance tools and real-time alerts.

6. **How It Works**:
   - 3-step horizontal workflow connected by subtle dashed lines:
     - Step 1: *Sign Up* — Create your account in minutes.
     - Step 2: *Set Up Stores* — Add your stores, products and staff.
     - Step 3: *Go Live* — Start managing your business with AI.

7. **Product Preview**:
   - Polished laptop dashboard mockup displaying sales curves, live 24-store badge, and category breakdown.
   - Overlapping mobile dashboard mockup with daily sales (`₹ 12,450`), live indicator, and recent floor activity.

8. **Our Solutions**:
   - 5 retail category cards with authentic commercial imagery:
     1. *Supermarkets & Grocery*
     2. *Fashion & Apparel*
     3. *Electronics & Mobile*
     4. *Pharmacy & Healthcare*
     5. *Multi-Store Retail Chains*

9. **Customer Testimonials**:
   - Featured testimonial card for *Rahul Sharma* (*Store Owner, Delhi*).
   - Quote: *"RetailEdge AI has transformed the way we manage our stores. Inventory, billing and reports — everything is so easy now."*
   - 5 gold stars and interactive carousel dots.

10. **Pricing**:
    - *Starter*: ₹1,999 /month (1 Store, Basic Features) $\rightarrow$ Get Started.
    - *Business* (Most Popular): ₹4,999 /month (Up to 5 Stores, Advanced Features) $\rightarrow$ Get Started (Green button).
    - *Enterprise*: Custom (Unlimited Stores, All Features + Dedicated Support) $\rightarrow$ Contact Sales.

11. **Final CTA Banner**:
    - Deep forest green retail banner (`#0c3120`) with retail image overlay.
    - Headline: *"Ready to Transform Your Retail Business?"*
    - Buttons: *"Get Started →"* ($\rightarrow$ `/login`) and *"Request a Demo"* (opens `DemoModal`).

12. **Footer**:
    - RetailEdge AI logo with tagline.
    - 4 navigation columns: *Product*, *Solutions*, *Resources*, *Company*.
    - Social links: LinkedIn, X (Twitter), Instagram, YouTube.
    - Copyright & legal links: Privacy Policy, Terms of Service, Cookies Policy.

---

## 3. Component Registry

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `LandingHeader` | `src/components/landing/LandingHeader.tsx` | Fixed navigation bar with active section indicator and mobile drawer |
| `HeroSection` | `src/components/landing/HeroSection.tsx` | Hero banner with typography, CTAs, store image, and floating cards |
| `HeroDashboardPreview` | `src/components/landing/HeroDashboardPreview.tsx` | Live Store Overview floating card with 3 KPI metrics |
| `FloatingFeatureCard` | `src/components/landing/FloatingFeatureCard.tsx` | Reusable floating card around hero image |
| `FeatureStrip` | `src/components/landing/FeatureStrip.tsx` | 7-card horizontal retail capability strip |
| `TrustStats` | `src/components/landing/TrustStats.tsx` | 4 adoption statistics and platform metrics |
| `WhyChooseSection` | `src/components/landing/WhyChooseSection.tsx` | 2x2 grid highlighting operational advantages |
| `HowItWorksSection` | `src/components/landing/HowItWorksSection.tsx` | 3-step numbered workflow with connector lines |
| `ProductPreviewSection` | `src/components/landing/ProductPreviewSection.tsx` | Responsive laptop and mobile dashboard mockup |
| `SolutionsSection` | `src/components/landing/SolutionsSection.tsx` | 5 solution category cards with retail imagery |
| `TestimonialSection` | `src/components/landing/TestimonialSection.tsx` | Testimonial card with avatar, rating, and carousel controls |
| `PricingSection` | `src/components/landing/PricingSection.tsx` | 3-tier pricing matrix with Business highlight |
| `FinalCTASection` | `src/components/landing/FinalCTASection.tsx` | Dark forest green conversion banner |
| `LandingFooter` | `src/components/landing/LandingFooter.tsx` | Site footer with columns, social vectors, and copyright |
| `DemoModal` | `src/components/landing/DemoModal.tsx` | Accessible dialog for demo video and sales contact placeholders |
| `RetailEdgeLogo` | `src/components/common/RetailEdgeLogo.tsx` | Reusable cart + leaf vector emblem with typography |
| `Button` | `src/components/common/Button.tsx` | Unified button component |
| `SectionHeading` | `src/components/common/SectionHeading.tsx` | Unified section header typography |
| `LandingPage` | `src/pages/public/LandingPage.tsx` | Master page controller orchestrating all sections |

---

## 4. Navigation & CTAs

- **Login Button (Header / Mobile Menu)**: Navigates cleanly to `/login` via React Router `useNavigate()`.
- **Get Started (Header / Hero / Pricing / Final CTA)**: Navigates to `/login` (entry point to existing and new accounts).
- **Watch Demo / Request Demo / Contact Sales**: Opens `DemoModal` with tailored titles and clear actions.
- **Header Section Links**: Smooth scroll to corresponding sections (`#home`, `#product`, `#solutions`, `#features`, `#pricing`, `#resources`, `#about`).

---

## 5. API Dependencies

> **Explicit Architecture Rule**:
> The landing page does **not** directly consume analytics, inventory, queue, or alert APIs. All metrics shown on the landing page are centralized presentational marketing values.
>
> Actual authenticated API communication is deferred until after the user authenticates via `POST /api/auth/login` on the `/login` route.

---

## 6. Static Marketing Data (`src/data/landingData.ts`)

All text copy, pricing amounts, feature descriptions, metrics, testimonial quotes, and footer links are centralized in [`frontend/src/data/landingData.ts`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/data/landingData.ts). Any future copy edits can be made directly in this file without modifying JSX.

---

## 7. Media & Visual Assets

| Asset Path | Usage |
| :--- | :--- |
| `/images/hero_store_pos.jpg` | Main hero supermarket checkout and POS terminal photo |
| `/images/retail_shopper_bg.jpg` | Final CTA banner backdrop and login page background |
| `/images/solution_supermarket.jpg` | Supermarkets & Grocery solution card |
| `/images/solution_fashion.jpg` | Fashion & Apparel boutique solution card |
| `/images/solution_electronics.jpg` | Electronics & Mobile showroom solution card |
| `/images/solution_pharmacy.jpg` | Pharmacy & Healthcare clean store solution card |
| `/images/solution_multistore.jpg` | Multi-Store Retail Chains mall storefront solution card |
| `/images/customer_rahul.jpg` | Testimonial headshot for Rahul Sharma |

---

## 8. Responsive Design

- **Desktop ($\ge 1024\text{px}$)**: Full multi-column layout exactly matching the reference composition.
- **Tablet ($768\text{px} - 1023\text{px}$)**: Graceful adaptation of 3-column middle blocks into stacked rows; solution cards adapt to 3 columns; pricing cards stack smoothly.
- **Mobile ($< 768\text{px}$)**:
  - Header switches to brand logo + hamburger drawer menu.
  - Hero stacks headline and store image vertically with optimized floating badges.
  - Feature strip adapts to a clean 2-column touch grid.
  - Trust statistics render in a 2-column grid.
  - How It Works renders numbered steps vertically.
  - Zero horizontal overflow.

---

## 9. Pending Items & Future Enhancements

- **Final Product Screencasts / Video**: Interactive demo modal currently provides an architectural placeholder ready for an embedded video player once production footage is produced.
- **Self-Service Contact API**: Contact Enterprise Sales triggers the demo modal; a dedicated `POST /api/leads` endpoint can be connected when ready.
- **OAuth Callback URL**: Social login buttons in the login page will connect to backend OAuth endpoints when available.

---

## 10. Landing Page Visual Implementation (5 Refined Sections)

### Why Choose RetailEdge AI?
- **Layout**: Left column of the middle content band (`lg:col-span-5`), paired side-by-side with *How It Works* and *Product Preview*.
- **Four Cards**: 2 × 2 compact card grid with soft pastel rounded-square icon containers:
  1. *Save Time* (`⚡ Zap` in amber container) — Automate daily operations and reduce manual work.
  2. *Reduce Costs* (`₹ Currency` in emerald container) — Optimize inventory and minimize losses.
  3. *Grow Faster* (`📈 TrendingUp` in teal container) — Get data-driven insights to make better decisions.
  4. *Stay Compliant* (`🛡 ShieldCheck` in blue container) — Built-in compliance tools and real-time alerts.
- **Components**: `src/components/landing/WhyChooseSection.tsx`.

### How It Works
- **Layout**: Center column of the middle content band (`lg:col-span-3.5`).
- **Three-Step Process**: Clean horizontal process workflow:
  - Step 1: Green circular number `(1)` $\rightarrow$ **Sign Up** (Create your account in minutes).
  - Step 2: Green circular number `(2)` $\rightarrow$ **Set Up Stores** (Add your stores, products and staff).
  - Step 3: Green circular number `(3)` $\rightarrow$ **Go Live** (Start managing your business with AI).
- **Connector Line**: Thin horizontal dashed green line connecting the number badges across steps.
- **Components**: `src/components/landing/HowItWorksSection.tsx`.

### Our Solutions
- **Layout**: Left column of the lower content band (`lg:col-span-4.5`).
- **Five Solution Cards**: Horizontal row of 5 compact image thumbnail cards:
  1. *Supermarkets & Grocery* (`/images/solution_supermarket.jpg`)
  2. *Fashion & Apparel* (`/images/solution_fashion.jpg`)
  3. *Electronics & Mobile* (`/images/solution_electronics.jpg`)
  4. *Pharmacy & Healthcare* (`/images/solution_pharmacy.jpg`)
  5. *Multi-Store Retail Chains* (`/images/solution_multistore.jpg`)
- **Card Design**: Rounded card with upper image preview and compact 2-line category name underneath.
- **Components**: `src/components/landing/SolutionsSection.tsx`.

### What Our Customers Say
- **Layout**: Center column of the lower content band (`lg:col-span-3`).
- **Testimonial Structure**: Compact horizontal card with circular avatar (`/images/customer_rahul.jpg`), quote from *Rahul Sharma* (*Store Owner, Delhi*), and 5 gold stars.
- **Carousel Indicators**: Subtle pagination dots (`● ○ ○`) below the card.
- **Components**: `src/components/landing/TestimonialSection.tsx`.

### Pricing
- **Layout**: Right column of the lower content band (`lg:col-span-4.5`).
- **Three Pricing Cards**:
  1. *Starter*: ₹1,999/month, 1 Store, Basic Features $\rightarrow$ `Get Started` button.
  2. *Business* (**Most Popular**): ₹4,999/month, Up to 5 Stores, Advanced Features $\rightarrow$ green accented border and solid green `Get Started` button.
  3. *Enterprise*: Custom, Unlimited Stores, All Features + Support $\rightarrow$ `Contact Sales` button.
- **CTA Behavior**: `Get Started` routes to `/login`; `Contact Sales` triggers the enterprise demo modal.
- **Components**: `src/components/landing/PricingSection.tsx`.

---

## 11. Layout Architecture

### Why Choose + How It Works + Product Preview
- **Desktop Grid**: Defined via CSS Grid `grid-cols-1 lg:grid-cols-[1.35fr_1fr_1.05fr]` inside a centered max-width container (`max-w-7xl 2xl:max-w-[1536px]`).
- **Column Proportions**:
  - *Why Choose*: ~40% width (`1.35fr`). Houses a 2x2 grid of compact information cards with left-aligned pastel icon badges.
  - *How It Works*: ~29% width (`1fr`). Houses a 3-step timeline (`(1) ── (2) ── (3)`) with dashed green connectors embedded in the top row, guaranteeing zero text overlap.
  - *Product Preview*: ~31% width (`1.05fr`). Houses the dashboard laptop mockup and phone mockup strictly constrained within its parent track without escaping.
- **Responsive Behavior**:
  - Desktop ($\ge 1024\text{px}$): 3-column horizontal grid.
  - Tablet ($640\text{px} - 1023\text{px}$): Why Choose adapts to a 2-column card grid; How It Works maintains horizontal timeline; Product Preview stacks cleanly below.
  - Mobile ($< 640\text{px}$): Why Choose stacks into a single-column card list; How It Works transforms into an adaptive vertical timeline with downward dashed connector lines; Product Preview stacks below with zero overlap.

### Our Solutions
- **Five-Column Desktop Grid**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4` spanning the full width of the container.
- **Card Image Aspect Ratio**: `aspect-[16/10]` overflow-hidden upper container with `object-cover` imagery, paired with a centered title container underneath.

### Testimonial + Pricing
- **Two-Column Parent Grid**: Built using a 12-column CSS Grid (`grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8`):
  - *What Our Customers Say*: Spans 4 of 12 columns (`lg:col-span-4`, ~33.3% width). Houses a horizontal testimonial card (avatar on left, quote on right, name/role and 5 gold stars below, 3 pagination dots centered underneath).
  - *Pricing*: Spans 8 of 12 columns (`lg:col-span-8`, ~66.7% width).
- **Three-Column Pricing Grid**: `grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-stretch w-full min-w-0`:
  - Three equal-width cards (*Starter*, *Business*, *Enterprise*).
  - Normal CSS flow ensures prices and features never overlap.
  - *Business Plan* features a centered "Most Popular" pill badge on the top border (`absolute -top-3 left-1/2 -translate-x-1/2`), subtle green background tint (`bg-[#f4fbf7]`), and green border.
  - All CTA buttons use `mt-auto` to maintain uniform horizontal alignment across all three cards.

### Layout-Related Reusable Components Changed
- [`src/pages/public/LandingPage.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/pages/public/LandingPage.tsx): Eliminated non-standard fractional Tailwind classes (`col-span-3.5`, `col-span-4.5`, `col-span-7.5`) and replaced them with verified grid templates and column spans.
- [`src/components/landing/WhyChooseCard.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/WhyChooseCard.tsx): Converted to horizontal flex card matching reference.
- [`src/components/landing/WhyChooseSection.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/WhyChooseSection.tsx): Changed card grid to `grid-cols-1 sm:grid-cols-2`.
- [`src/components/landing/HowItWorksSection.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/HowItWorksSection.tsx): Replaced fragile absolute line with structured step grid.
- [`src/components/landing/ProcessStep.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/ProcessStep.tsx): Integrated top-row dashed line connector that switches from horizontal to vertical on mobile.
- [`src/components/landing/ProductPreviewSection.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/ProductPreviewSection.tsx): Constrained laptop and phone mockups within column bounds.
- [`src/components/landing/TestimonialCard.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/TestimonialCard.tsx): Reorganized to horizontal avatar-left, quote-right layout.
- [`src/components/landing/PricingCard.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/PricingCard.tsx): Centered all internal text, refined "Most Popular" badge positioning, and added `mt-auto` button alignment.
- [`src/components/landing/PricingSection.tsx`](file:///c:/Users/Sumit/Desktop/Hackathon%20Project/RetailEdge/frontend/src/components/landing/PricingSection.tsx): Ensured `w-full` and `min-w-0` on parent containers to prevent column collapse.

