## 2026-07-01 - Add ARIA Labels to Cart Icon Buttons
**Learning:** The +/- and trash buttons in the PosScreen and CustomerOrderScreen are missing aria-labels and tooltips, making them inaccessible for screen readers and unclear without hover context.
**Action:** Add context-aware `aria-label` and `title` to these icon-only buttons (e.g. `aria-label="Decrease quantity for ${item.name}"` and `title="Decrease quantity"`). Ensure keyboard focus states.
