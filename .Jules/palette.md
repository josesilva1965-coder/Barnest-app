## 2024-03-03 - Quantity Control Accessibility in Order Screens
**Learning:** Icon-only quantity adjustment buttons in the cart/order lists (both POS and Customer screens) lacked screen reader context and visible focus states, hindering keyboard and assistive technology users from managing their orders.
**Action:** Ensure all interactive icon buttons, especially critical ones like quantity controls and remove buttons, have descriptive `aria-label` attributes and clear `focus-visible` styling (e.g. `focus:outline-none focus:ring-2 focus:ring-brand-secondary`) for native keyboard accessibility.
