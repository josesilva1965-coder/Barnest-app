
## 2024-05-18 - Context-Aware ARIA Labels for Dynamic Lists
**Learning:** For actions like quantity adjustments (+/-) or deletion in dynamic lists (like carts or POS orders), generic "Increase" or "Decrease" labels are confusing for screen reader users when multiple items are present. Additionally, dynamic numeric displays (like the current quantity or item count) need `aria-live="polite"` and `aria-atomic="true"` to announce changes accurately.
**Action:** When implementing list item controls, always interpolate the item's name into the `aria-label` (e.g., ``aria-label={`Decrease quantity of ${item.name}`}``). For dynamic numbers, use `aria-live` regions.
