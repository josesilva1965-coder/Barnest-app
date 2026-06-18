## 2024-06-18 - Accessible Cart Controls
**Learning:** Icon-only action buttons within dynamic list items (like cart quantities) must use context-aware `aria-label`s and `title`s that interpolate the item's name to ensure clear feedback for screen reader and mouse users. Dynamic numeric values like cart quantities need `aria-live="polite"` and `aria-atomic="true"`.
**Action:** When creating quantity controls or dynamic lists, always interpolate the item name into `aria-label` and `title` for action buttons, and use `aria-live` for the value display.
