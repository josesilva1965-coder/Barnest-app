## 2024-04-10 - Accessible Cart Controls
**Learning:** Icon-only buttons for modifying cart items (plus, minus, trash) and dynamic quantity spans lack accessible context, causing screen readers to misread the buttons and miss updates.
**Action:** Always add context-aware `aria-label`s interpolating the item name on dynamic list item action buttons. Additionally, ensure the container showing the quantity update has `aria-live="polite"` and `aria-atomic="true"` so screen readers announce changes clearly.
