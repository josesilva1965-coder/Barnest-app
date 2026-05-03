## 2024-05-15 - Missing ARIA Labels on Quantity Buttons
**Learning:** Icon-only buttons used for adjusting quantities in the cart (`components/customer/CustomerOrderScreen.tsx`, `components/pos/PosScreen.tsx`) lack `aria-label` attributes, making them inaccessible to screen readers. Context-aware aria-labels (e.g., "Decrease quantity of Burger") are needed.
**Action:** Add context-aware `aria-label`s to all icon-only buttons, especially quantity adjustment and removal buttons, and ensure they have visible focus states.
