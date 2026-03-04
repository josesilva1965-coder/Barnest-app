
## 2024-10-24 - Interactive List Accessibility
**Learning:** Found an accessibility issue pattern where cart item quantity adjusters used icon-only buttons without `aria-label`s or focus rings, making them invisible to screen readers and difficult to navigate via keyboard. Additionally, the dynamic quantity displays were not announced by screen readers when updated.
**Action:** Always include descriptive `aria-label`s (e.g., "Decrease quantity", "Increase quantity") and visible focus states (`focus:ring-2`, `focus:outline-none`) on all icon-only interactive elements. Use `aria-live="polite"` on containers displaying dynamic numeric values so updates are announced to screen readers.
