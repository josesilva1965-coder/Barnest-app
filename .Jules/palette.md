
## 2024-05-18 - Context-Aware ARIA Labels on Repeated List Items
**Learning:** Icon-only buttons (like +/-) within dynamic list items (like a cart) must use context-aware `aria-label`s. Without context, screen reader users navigating sequentially hear "Minus, Minus, Minus" and lose track of which item they are modifying.
**Action:** Always interpolate the item's name into the `aria-label` for buttons inside iterated lists (e.g., `aria-label="Decrease quantity of ${item.name}"`).
