
## 2024-05-18 - Dynamic List Action Accessibility
**Learning:** Found an accessibility issue pattern in the app's components regarding dynamic list items (like cart items). The action buttons within these lists lack context for screen reader users and missing ARIA live regions for quantity changes.
**Action:** Always add context-aware `aria-label`s that interpolate the item's name for buttons within dynamic lists (e.g., cart increase/decrease). Also ensure dynamic numeric values (like cart quantities) use `aria-live="polite"` and `aria-atomic="true"` to ensure updates are announced accurately.
