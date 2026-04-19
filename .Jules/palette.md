
## 2024-05-18 - Context-Aware ARIA Labels for Dynamic Cart Items
**Learning:** When dealing with dynamic lists of items like shopping carts or POS order lines, adding a generic `aria-label` like "Increase quantity" to an icon-only button is insufficient and confusing for screen reader users, as it doesn't indicate *which* item is being modified.
**Action:** Always interpolate the specific item's name into the `aria-label` for list item actions (e.g., `aria-label={\`Increase quantity of \${item.name}\`}`). Combine this with `focus-visible` styles to ensure proper keyboard navigation visibility.
