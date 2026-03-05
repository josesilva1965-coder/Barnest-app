

## 2025-03-05 - Semantic Interactive Cards
**Learning:** Found that the `MenuItemCard` in the POS screen was a `div` element wrapped by the `Card` component but styled and used as an interactive button with `onClick`. Using `div` for interactive elements that act as buttons lacks native keyboard accessibility (focus, activation via Enter/Space) and proper ARIA roles.
**Action:** When an entire card or card-like UI functions as a single interactive action (e.g. adding an item to the order), wrap the layout in a native `<button>` element with appropriate `focus` styling (`focus:ring-2 focus:ring-brand-secondary focus:outline-none`) and `aria-label` attribute.
