# Design Guidelines: Meu Barbeiro Landing Page

## Design Approach & Reference

**Selected Approach:** Reference-Based (SaaS/Productivity)
**Primary References:** Stripe (payment clarity), Linear (bold typography), Notion (visual hierarchy)
**Justification:** Marketing/landing page requiring high conversion rates through visual trust, professional presentation, and clear value communication for barbershop professionals.

**Core Principles:**
- Bold, confidence-inspiring design that appeals to barbershop owners
- Clear visual hierarchy driving users toward lead capture
- Professional with personality (emojis used strategically, not childishly)
- High contrast sections to maintain engagement throughout scroll

---

## Color Palette

### Primary Colors (Dark Mode Optimized)
- **Primary Blue:** 220 85% 55% (vibrant, trustworthy blue for CTAs and key elements)
- **Deep Navy:** 220 30% 15% (professional dark base for contrast sections)
- **Pure White:** 0 0% 100% (clean, open sections)
- **Rich Black:** 220 15% 8% (deep backgrounds for premium feel)

### Supporting Colors
- **Accent Blue:** 220 100% 65% (lighter blue for hover states and highlights)
- **Success Green:** 145 70% 45% (for benefits, checkmarks, positive indicators)
- **Subtle Gray:** 220 10% 96% (borders, dividers in light sections)
- **Dark Gray:** 220 10% 25% (secondary text on light backgrounds)

### Section Alternation Pattern
- **Sections 1, 3, 5, 7:** White backgrounds (0 0% 100%) with dark text
- **Sections 2, 4, 6, 8:** Deep Navy/Rich Black backgrounds (220 30% 15%) with white text
- **Hero Section:** White with large imagery and bold blue CTAs

---

## Typography

**Font Families:**
- **Primary (Headlines):** Inter (700-800 weight) - bold, modern, professional
- **Secondary (Body):** Inter (400-500 weight) - excellent readability
- **Accent (Numbers/Stats):** Inter (900 weight) - maximum impact

**Type Scale:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl font-bold
- Section Titles: text-3xl md:text-4xl lg:text-5xl font-bold
- Subsections: text-xl md:text-2xl font-semibold
- Body Text: text-base md:text-lg leading-relaxed
- Small Text/Captions: text-sm md:text-base

**Emoji Integration:**
- Hero section: 💈 (barber pole) next to main headline
- Feature benefits: ✅ checkmarks, 🚀 rockets, 💡 lightbulbs
- CTA buttons: 👉 for primary actions
- Social proof: 💬 for testimonials
- Urgency indicators: ⚠️ for scarcity

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Container max-width: max-w-7xl mx-auto px-6
- Grid gaps: gap-8 md:gap-12 lg:gap-16
- Element spacing: space-y-6 to space-y-12

**Grid Structures:**
- Hero: Single column centered content with side imagery
- Plans: 3-column grid (grid-cols-1 md:grid-cols-3) with center emphasis
- Benefits: 2-column layout (md:grid-cols-2) with icons
- Testimonials: 2-3 column masonry style
- Footer: 4-column grid collapsing to single on mobile

---

## Component Library

### Navigation
- Sticky header with logo left, CTA button right
- Logo: "Meu Barbeiro" text with scissors icon in black
- Background: white with subtle shadow on scroll
- CTA: Primary blue button "Criar meu link grátis"

### Hero Section
- **Layout:** 60/40 split (content/image) on desktop, stacked mobile
- **Image:** Mockup of barbershop using WhatsApp automation (professional barber or phone showing app interface)
- **Headline:** Large, bold with 💈 emoji, primary blue accent color on key words
- **CTA:** Oversized button (px-8 py-4) with arrow icon, blue background
- **Supporting:** Trust indicators below CTA (e.g., "⭐ 500+ barbeiros cadastrados")

### Popup Lead Capture
- Radix Dialog with blur backdrop
- Two-step process: 
  1. Contact info (WhatsApp/Email)
  2. Plan selection with visual cards
- Plan cards: Bordered, hover scale effect, checkmark icons for features
- Submit button: Full-width, primary blue, disabled state until valid

### Plan Comparison Cards
- **"Mais Vendido" badge** on Profissional plan (green background)
- Card elevation: shadow-lg on hover with transform scale-105
- Feature lists: Green checkmarks (✅) with benefit text
- Price display: Large numbers (text-5xl) with small /mês
- CTAs: Variant styling - Outline for free, Solid blue for paid

### Benefits Section (Pros/Cons Grid)
- Two-column layout: Pros (left) with green accents, subtle cons handled as "Traditional way" comparison
- Icon boxes: 80px rounded backgrounds with emoji/icon
- Comparison table optional: Before/After Meu Barbeiro

### Social Proof
- Testimonial cards: White cards on dark background with subtle border
- Profile photos: Circular 60px with name/location below
- Quote marks: Large blue quotation marks
- Star ratings: Gold stars (⭐⭐⭐⭐⭐) prominently displayed

### Call-to-Action Sections
- Multiple CTAs throughout (every 2-3 sections)
- Variation in presentation: Centered, side-aligned, banner-style
- Button states: Blue background, darker blue hover, scale transform
- Secondary CTAs: Outline variant with blue border

### Footer
- Dark background (Rich Black)
- Logo in white variation
- 4 columns: Product, Recursos, Empresa, Contato
- Newsletter signup: Inline form with blue submit button
- Social links with icon hover animations

---

## Animations & Interactions

**Scroll Animations (Framer Motion):**
- Fade in + slide up (20px) for section content: transition duration 0.6s
- Stagger children animations for feature grids (0.1s delay between items)
- Scale on scroll for statistics/numbers (1.0 to 1.05)

**Micro-interactions:**
- Button hover: scale-105 with transition-transform duration-200
- Card hover: lift effect (shadow-lg to shadow-2xl) with scale-[1.02]
- Plan selection: Checkmark animation (scale from 0 to 1)
- Logo pulse on page load (subtle scale animation)

**Popup Animations:**
- Enter: fade + scale from 0.95 to 1
- Exit: fade + scale to 0.95
- Backdrop blur transition: 300ms

---

## Images & Visual Assets

**Hero Image:**
- Large, professional photo of barbershop owner using phone/tablet with satisfied smile
- Alternative: Split screen showing traditional chaos vs. organized Meu Barbeiro dashboard
- Placement: Right 40% of hero on desktop, full-width above headline on mobile
- Style: Slight vignette overlay, subtle blue tint filter

**Section Images:**
- Dashboard mockup: Clean screenshot showing agendamento link generation
- WhatsApp conversation: Mockup showing automated booking messages
- Before/After comparison: Side-by-side traditional paper calendar vs. digital dashboard
- Team/barbershop photos: Authentic, high-quality images showing real barbershops

**Icons & Illustrations:**
- Scissors icon: Featured in logo (black on light, white on dark)
- Feature icons: Mix of emojis and simple line icons for benefits
- Success indicators: Animated checkmarks in green
- Loading states: Spinning scissors icon animation

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Single column, stacked sections, full-width CTAs
- Tablet: 768px - 1024px - 2-column grids, side-by-side content
- Desktop: > 1024px - Full 3-column grids, 60/40 hero split

**Mobile-Specific:**
- Sticky CTA button at bottom of viewport on scroll
- Hamburger menu for navigation
- Larger touch targets (min 44px) for all interactive elements
- Simplified plan cards (vertical stack instead of comparison)

---

## Admin Route Visual Design

**Layout:** Grid gallery view showing all landing page variations
- Card-based: Each page as thumbnail with title overlay
- Quick preview: Hover shows page description and key metrics
- Filter options: By plan type, by conversion rate (mocked)
- Lead dashboard: Table showing captured leads from Firebase with status indicators