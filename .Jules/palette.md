## 2024-04-06 - [Context-Aware ARIA Labels for Dynamic Cart Items]
**Learning:** Screen reader users lose context when encountering multiple icon-only "plus", "minus", and "trash" buttons in a dynamic shopping cart. Static `aria-label="Increase"` is insufficient when modifying different items in a list.
**Action:** Always interpolate the dynamic item name into the `aria-label` (e.g., `aria-label={\`Decrease quantity of ${item.name}\`}`) for action buttons within iterative lists.
