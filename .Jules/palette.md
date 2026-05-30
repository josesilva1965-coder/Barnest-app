## 2024-05-30 - Context-Aware ARIA Labels for Cart Buttons
**Learning:** Icon-only action buttons within dynamic list items (e.g., increase/decrease quantity in a cart) need context-aware `aria-label`s that interpolate the item name (e.g., "Decrease quantity of Wagyu Burger") to provide clear feedback for screen reader users.
**Action:** Always interpolate the dynamic item name into the `aria-label` for list item actions, and ensure `focus-visible` states are present for keyboard accessibility.
