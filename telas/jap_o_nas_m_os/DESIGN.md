---
name: Japão Nas Mãos
colors:
  surface: '#fff8f8'
  surface-dim: '#f0d3d9'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f2'
  surface-container: '#ffe8ed'
  surface-container-high: '#fee1e7'
  surface-container-highest: '#f9dbe2'
  on-surface: '#27171c'
  on-surface-variant: '#5a3f47'
  inverse-surface: '#3e2b31'
  inverse-on-surface: '#ffecf0'
  outline: '#8e6f77'
  outline-variant: '#e2bdc6'
  surface-tint: '#b90063'
  primary: '#b50061'
  on-primary: '#ffffff'
  primary-container: '#e10b7a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb1c8'
  secondary: '#6a5a64'
  on-secondary: '#ffffff'
  secondary-container: '#f3dce8'
  on-secondary-container: '#71606a'
  tertiary: '#006b11'
  on-tertiary: '#ffffff'
  tertiary-container: '#008818'
  on-tertiary-container: '#f8fff0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e2'
  primary-fixed-dim: '#ffb1c8'
  on-primary-fixed: '#3e001d'
  on-primary-fixed-variant: '#8e004a'
  secondary-fixed: '#f3dce8'
  secondary-fixed-dim: '#d6c1cc'
  on-secondary-fixed: '#241820'
  on-secondary-fixed-variant: '#52424c'
  tertiary-fixed: '#87fc7c'
  tertiary-fixed-dim: '#6bdf63'
  on-tertiary-fixed: '#002202'
  on-tertiary-fixed-variant: '#00530a'
  background: '#fff8f8'
  on-background: '#27171c'
  surface-variant: '#f9dbe2'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  price-display:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  button-text:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1200px
---

## Brand & Style

The design system is centered on an elegant, feminine, and premium skincare experience that remains approachable and trustworthy. It prioritizes the product as the hero, using a clean aesthetic that blends Modernism with soft, tactile elements. The emotional response should be one of freshness, ritual, and high-quality care.

The style leverages generous whitespace to create a "breathable" luxury feel, avoiding clutter to allow product photography to shine. It utilizes soft rounded edges and subtle depth to convey the gentleness associated with Asian skincare routines.

## Colors

The palette is dominated by a vibrant Magenta Pink primary color, used strategically for calls-to-action and key brand moments. This is balanced by a Soft Pink accent used for secondary UI elements like badges or subtle background highlights.

Neutral tones prioritize high legibility with a nearly-black text color and a cool-toned gray for metadata. Section backgrounds use a very light off-white to create soft visual separation between content blocks without the harshness of pure white.

## Typography

This design system uses a dual-font strategy. **Poppins** provides a structured, geometric, and bold feel for titles and marketing headlines, reinforcing the premium brand identity. **Inter** is used for all body copy, UI elements, and technical product information due to its exceptional legibility.

Prices are a critical UI element; they must always appear in the Primary Magenta color with Semibold weight. All currency formatting must follow the Brazilian Real standard: **R$ 00,00**.

## Layout & Spacing

The layout follows a fluid 12-column grid for desktop with a maximum container width of 1200px. For mobile, a 4-column grid with 16px side margins is standard.

Spacing is generous to evoke a sense of calm and luxury. Vertical rhythm should favor larger gaps between sections (64px+) to prevent the interface from feeling crowded. Product grids should use a 24px gutter to ensure each item has individual presence.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. 
- Surfaces: Cards and containers use the White background against the Section Background (#F7F7F9) to create a soft natural lift.
- Shadows: Use a very soft, diffused shadow for product cards (e.g., `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`).
- Hover states: On hover, shadows should become slightly more pronounced to provide tactile feedback without looking heavy or "dirty."

## Shapes

The shape language is consistently rounded to reflect the "softness" of skincare. 
- Standard UI elements (Inputs, secondary buttons) use a 0.5rem (8px) radius.
- Larger containers and Product Cards use a 1rem (16px) radius.
- Buttons and Badges use a 12px or Pill-shape (full round) to distinguish them from structural elements.

## Components

### Product Cards
Cards feature a 16px corner radius and a subtle shadow. The product image must be a 1:1 square. Content stack: Image &gt; Muted Category Text &gt; Product Name (Bold) &gt; Primary Color Price &gt; Primary Button.

### Buttons
- **Primary:** Solid Magenta (#E6157E) with White text. 12px border-radius.
- **Secondary:** Soft Pink (#FBE4F0) with Magenta text.
- **Icon Buttons:** Circular or slightly rounded with minimal strokes.

### Badges & Chips
- **Discount Badges:** Magenta pills positioned in the top-right corner of product images.
- **Category Chips:** Pill-shaped with a light gray border or soft pink fill, containing a small icon followed by the label.

### Inputs
Text fields use a light gray border (1px) and 8px border-radius. On focus, the border transitions to Primary Magenta with a subtle glow (2px spread).

### Lists & Navigation
Navigation items use Inter Medium with 16px spacing. Active states are indicated by a small magenta dot or underline to maintain a clean header.