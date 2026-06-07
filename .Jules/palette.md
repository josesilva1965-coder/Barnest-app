
## 2024-06-07 - Accessible Cart Quantities
**Learning:** Action buttons within dynamic list items (like increase/decrease/remove in a cart) must use context-aware `aria-label`s that interpolate the item's name (e.g., "Decrease quantity of Wagyu Burger") to ensure clear feedback for screen reader users. Furthermore, containers displaying these dynamic numeric values must use `aria-live="polite"` and `aria-atomic="true"` so that the updated quantity is announced immediately without requiring the user to navigate to read the updated number.
**Action:** Always add item-specific context to icon-only buttons in lists, and use `aria-live`/`aria-atomic` on numerical displays that update dynamically based on user interaction.
