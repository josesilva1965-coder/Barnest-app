## 2026-03-07 - Missing ARIA labels on Icon-only Buttons
**Learning:** Found that multiple components across POS and Customer views rely heavily on icon-only buttons for critical actions (adjusting quantities, deleting items) without aria-labels or keyboard focus states. These interactions are invisible to screen readers and difficult to use via keyboard navigation.
**Action:** Always verify icon-only interactive elements include `aria-label` for screen readers and visible focus states (e.g., `focus:outline-none focus:ring-2`) for keyboard users.
