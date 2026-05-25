
## 2024-05-25 - Context-Aware ARIA Labels for Dynamic Cart Items
**Learning:** In dynamic lists like shopping carts, icon-only action buttons (e.g., `-`, `+`, `Trash`) need context-aware `aria-label`s that interpolate the item's name (e.g., `Decrease quantity of Wagyu Burger`). Without this, screen reader users navigating button-to-button just hear "Minus", "Plus", "Trash" repeatedly with no idea which item they are affecting. Additionally, the numeric quantity display needs `aria-live="polite"` and `aria-atomic="true"` to ensure updates are announced when the buttons are activated.
**Action:** Always interpolate the item name into `aria-label`s for action buttons within repeating list items or map functions. Use `aria-live` on containers displaying dynamic numeric values.
