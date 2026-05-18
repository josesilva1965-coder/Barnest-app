
## 2024-05-18 - Cart Quantity Accessibility
**Learning:** Screen readers need dynamic UI updates (like cart quantities) to be explicitly announced, otherwise the user misses context. Also, generic +/- buttons inside lists need their names injected into their `aria-label` to provide context when navigated out of flow.
**Action:** Always wrap dynamic quantity displays in a span with `aria-live="polite"` and `aria-atomic="true"`. Make sure +/- icon buttons have interpolated `aria-label`s like "Increase quantity of [Item Name]".
