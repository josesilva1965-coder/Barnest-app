## 2024-03-24 - Initial Palette Setup
**Learning:** Started tracking UX/a11y insights.
**Action:** Will add critical learnings here.

## 2024-06-18 - Cart Item Quantity Controls Accessibility
**Learning:** Icon-only buttons in dynamic lists (like cart items) require context-aware `aria-label`s (e.g., "Decrease quantity of [Item Name]") so screen reader users know which item they are modifying. Additionally, dynamic numerical values like cart quantities should be wrapped in elements with `aria-live="polite"` and `aria-atomic="true"` to announce changes accurately when the user interacts with the controls.
**Action:** Ensure all similar dynamic lists in the app (e.g., inventory management, ingredient list) use interpolated aria-labels and aria-live regions for quantity displays.
