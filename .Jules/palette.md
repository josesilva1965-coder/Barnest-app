
## 2024-05-18 - Cart Quantity Button Accessibility
**Learning:** Icon-only buttons for quantity adjustments in the POS and customer cart list lack context-aware labels and focus indicators, making them difficult for screen-reader users to understand and keyboard users to navigate. Additionally, dynamic values like cart quantity need `aria-live="polite"` to be announced correctly.
**Action:** Added `aria-label` with item names to plus/minus/trash buttons, `aria-live` to the quantity span, and `focus-visible` styling to ensure proper keyboard navigation visibility.
