## 2026-06-10 - [Missing ARIA Labels on POS Screen Cart Buttons]
**Learning:** Found that the minus, plus, and trash icons in the POS Screen and Customer Order Screen cart items are missing ARIA labels and focus styles. This is a common accessibility issue for icon-only buttons. The learning here is that when dealing with dynamic list items, dynamic ARIA labels (e.g., 'Decrease quantity of Wagyu Burger') provide much better context than static ones ('Decrease quantity').

**Action:** Added context-aware `aria-label` attributes and keyboard focus styles (`focus:outline-none focus:ring-2 focus:ring-brand-secondary`) to these buttons.
