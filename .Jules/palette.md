
## 2024-07-04 - Accessible Cart Quantities
**Learning:** Dynamic shopping cart quantities updated via icon-only buttons need explicit `aria-live` containers for screen reader announcements and both `title`/`aria-label` plus visible focus states on the modifier buttons for proper mouse/keyboard accessibility.
**Action:** Ensure all dynamically updated quantity displays in e-commerce/POS interfaces use `aria-live="polite"`, and ensure all icon-only action buttons have both hover tooltips (`title`) and screen reader text (`aria-label`) alongside `focus-visible` styling.
