---
name: Editorial Engineering Atelier
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#424844'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#727974'
  outline-variant: '#c1c8c3'
  surface-tint: '#486458'
  primary: '#07241a'
  on-primary: '#ffffff'
  primary-container: '#1e3a2f'
  on-primary-container: '#86a496'
  inverse-primary: '#aecebe'
  secondary: '#466556'
  on-secondary: '#ffffff'
  secondary-container: '#c6e8d4'
  on-secondary-container: '#4b695a'
  tertiary: '#400f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#641c00'
  on-tertiary-container: '#f47b50'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caeada'
  primary-fixed-dim: '#aecebe'
  on-primary-fixed: '#032017'
  on-primary-fixed-variant: '#304c41'
  secondary-fixed: '#c8ead7'
  secondary-fixed-dim: '#adcebc'
  on-secondary-fixed: '#022115'
  on-secondary-fixed-variant: '#2f4d3f'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#822801'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 2.5rem
    fontWeight: '500'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 1.875rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 1.375rem
    fontWeight: '500'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.625rem
    letterSpacing: '0'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.0625rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: '0'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system treats technical developer support not as an automated ticket funnel, but as a disciplined craft akin to architectural drafting or literary publishing. The brand personality is scholarly, deliberate, reassuring, and meticulous. It serves technical leads, staff engineers, and platform architects navigating critical API integrations, incident forensics, and high-stakes architecture reviews. 

The visual style marries classical editorial design with utilitarian engineering precision. It completely discards standard SaaS clichés—such as saturated purple-violet neon glows, glossy glassmorphic backdrops, synthetic gradient blur cards, and hyper-prominent AI iconography. In their place, the interface employs the tactile calm of heavy book paper, purposeful structural rules, fine-gauge borders, and disciplined ink contrast. It prioritizes sustained readability, low ocular fatigue during long diagnostic sessions, and absolute clarity across dense API telemetry, stack traces, and case narratives.

## Colors

The palette is anchored in tactile paper creams, deep arboreal greens, and ceramic terracotta accents, maintaining an organic and scholarly register:

- **Primary Canvas & Surfaces (`#FAF8F5`, `#F4EFEA`, `#EAE3D9`):** Represents unbleached paper grain. Base views rely on `#FAF8F5` for primary background, shifting to `#F4EFEA` for nested cards, and `#EAE3D9` for secondary dividers, panel backdrops, and active row selections.
- **Deep Forest Green (`#1E3A2F`, `#152A22`):** The primary ink and foundational authority token. Used for critical action buttons, prominent headings, and navigational anchors.
- **Muted Sage (`#5E7D6D`, `#7F9E8E`):** Secondary accent. Dictates secondary actions, subdued icons, metadata categorizations, and healthy status metrics.
- **Burnt Orange (`#C85A32`, `#B44E28`):** Editorial focus accent. Applied sparingly to critical alerts, HTTP 4xx/5xx status notices, active debug flags, and focal interactive calls-to-action.
- **Warm Amber (`#D99B26`):** Highlight tier for degraded latency, deprecation warnings, and pending queue tags.
- **Charcoal Text Hierarchy (`#1F2421`, `#4A554E`, `#7A8880`):** Pure black is avoided. Primary prose and numbers use deep charcoal (`#1F2421`); body labels use stone slate (`#4A554E`); tertiary timestamps and monospaced gutters utilize soft graphite (`#7A8880`).
- **Structural Lines (`#E3DBD0`):** Defines card edges, table rows, and panel borders with consistent 1px hairline precision.

## Typography

Typography establishes an intentional cadence between literary journalism and runtime instrumentation:

- **Newsreader (Display & Structural Headers):** Injects thoughtful intellectual authority into incident post-mortems, architectural summaries, and root-cause analyses. Headlines larger than 24px should utilize subtle negative tracking to preserve cohesion.
- **Plus Jakarta Sans (Interface Controls & Body Text):** Delivers clean readability across interactive controls, form elements, conversational tickets, and multi-column metadata grids. It provides humanist warmth while retaining crisp geometry at dense sizes.
- **JetBrains Mono (Technical Specifiers & Telemetry):** Reserved for technical data: API endpoints (`POST /v1/webhooks`), status codes (`429 Too Many Requests`), commit SHAs, headers, and stack frame parameters. Code elements must preserve tabular alignment and clear distinction between easily confused glyphs (such as `0` and `O`, `1` and `l`).

## Layout & Spacing

The layout philosophy follows a disciplined broadsheet grid system. The canvas prioritizes content hierarchy and horizontal breathing room over cramped multi-pane dashboards.

- **Desktop (1280px+):** A 12-column layout with a fixed max-width container of 1440px, centered on the viewport. Outer canvas margin is `2.5rem` (`margin`), with `1.5rem` gutters (`gutter`). Complex views use an asymmetrical 4/8 or 3/6/3 split: navigation and triage trees on the left, primary diagnostic reading pane in the center, telemetry and contextual API inspectors on the right.
- **Tablet (768px - 1279px):** An 8-column layout. The secondary inspector panel collapses into a contextual drawer or lower tab set. Margins reduce to `1.5rem`, maintaining `1.5rem` gutters.
- **Mobile (Below 768px):** A 4-column layout with `1rem` outer canvas margins and `1rem` gutters. Sidebars fold into standard top-level sheet drawers; data tables convert into vertically stacked index cards with monospaced key-value pairings.

## Elevation & Depth

This design system avoids blurry drop shadows, colored ambient glows, and deep synthetic elevation. Instead, depth is constructed via tactile tonal layering, architectural hairline borders, and subtle cast shadows:

- **Level 0 (Base Canvas):** Uncoated paper tone `#FAF8F5`. Serves as the substrate for standard application views and layout gutters.
- **Level 1 (Panels & Cards):** Surface `#F4EFEA` bordered by a crisp `1px solid #E3DBD0`. Shadow is absent or restricted to a tiny tactile offset: `0 1px 2px rgba(30, 58, 47, 0.04)`.
- **Level 2 (Dropdowns, Popovers, Active Drawers):** Surface `#F4EFEA` or pure white `#FFFFFF` layered over the base, bounded by a `1px solid #E3DBD0` rule and supported by an ink shadow: `0 4px 12px -2px rgba(21, 42, 34, 0.08)`.
- **Level 3 (Modal Dialogs & Critical Incident Overlays):** Grounded by a semi-opaque neutral wash (`#152A22` at 40% opacity), with the foreground container framed by `1px solid #E3DBD0` and cast with `0 12px 32px -4px rgba(21, 42, 34, 0.14)`.
- **Hairline Dividers:** Section cutoffs inside data displays always prefer thin 1px horizontal and vertical borders (`#E3DBD0`) over blank tonal shifts, reflecting printed broadsheets.

## Shapes

The interface adopts a disciplined, low-radius shape language (`roundedness: 1`, Soft). High-radius pill shapes and circular consumer bubbles are avoided in favor of firm, tailored geometry that honors physical stationery and index cards:

- **Containers & Cards:** Styled with `0.25rem` (4px) corner radii.
- **Modals & Drawers:** Styled with `0.5rem` (8px) corner radii (`rounded-lg`).
- **Buttons & Input Fields:** Formed with `0.25rem` (4px) corner radii, giving controls a clean, precise, structural presence.
- **Badges, Tags, and HTTP Method Chips:** Strict `0.125rem` (2px) or `0.25rem` (4px) corner radii; full pill pills are never used for system tags.

## Components

### Buttons
- **Primary:** Solid Deep Forest Green (`#1E3A2F`) background, `#FAF8F5` text, 0.25rem border radius. Hover shifts to `#152A22` with a subtle transform `translateY(-0.5px)`.
- **Secondary:** Surface `#F4EFEA`, border `1px solid #E3DBD0`, text `#1F2421`. Hover shifts background to `#EAE3D9`.
- **Tertiary / Destructive:** Burnt Orange outline or solid background (`#C85A32`) with ivory text for breaking actions.

### Badges & Status Indicators
- **Method Badges:** Monospaced (`JetBrains Mono`), uppercase, 0.25rem padding.
  - `GET`: Background `#EAE3D9`, text `#1E3A2F`, border `1px solid #5E7D6D`.
  - `POST`: Background `#F4EFEA`, text `#1E3A2F`, border `1px solid #1E3A2F`.
  - `DELETE` / `ERROR`: Background `#FBF0EB`, text `#B44E28`, border `1px solid #C85A32`.
- **Demo Data Tag:** Small uppercase badge with `JetBrains Mono` at `code-sm`, border `1px dashed #7F9E8E`, background transparent, text `#5E7D6D`.

### Cards & Ticket Panels
- Structured with `#F4EFEA` background and `1px solid #E3DBD0` outer border.
- Header zones feature `Newsreader` titles paired with a bottom hairline divider `#E3DBD0`.
- Footer zones feature tabular metadata in `Plus Jakarta Sans` or monospaced timestamps.

### Form Inputs & Code Fields
- **Text Inputs:** Neutral canvas `#FFFFFF`, `1px solid #E3DBD0` border, `Plus Jakarta Sans` body typography. Focus ring: `1px solid #1E3A2F` with an inset `0 0 0 1px #1E3A2F`.
- **Code Mirrors & Trace Viewers:** Inset background `#F4EFEA`, border `1px solid #E3DBD0`, `JetBrains Mono` typography. Syntax token colors: Sage (`#5E7D6D`), Burnt Orange (`#C85A32`), and Forest Green (`#1E3A2F`).

### Data Tables & Charts
- **Tables:** Compact rows with clear `1px solid #E3DBD0` borders. Table headers are styled in `JetBrains Mono` label sizes with uppercase, letterspaced graphite text (`#7A8880`).
- **Horizontal Bar Charts (Latency & Distribution):** Minimalist track backgrounds in `#EAE3D9` with active progress fills in `#5E7D6D` (nominal) or `#C85A32` (degraded/outlier), eliminating round caps and visual gradients in favor of sharp, rectangular bars.