
## 2025-02-28 - Context-Aware Quantity Buttons
**Learning:** In POS screens, quantity adjustment buttons (`+`, `-`, `delete`) need context-aware `aria-label`s. Saying "Increase quantity" isn't enough when there are multiple items in the order list.
**Action:** Always interpolate the item name into the aria-label for repeated list item actions (e.g., `aria-label="Increase quantity of {item.name}"`).
