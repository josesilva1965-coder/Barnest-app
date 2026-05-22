## 2024-05-22 - Dynamic Numeric Accessibility
**Learning:** Screen readers struggle to contextualize dynamic quantity changes (e.g., cart counts, item quantities) if the numbers update silently or the buttons lack context (like a generic "+" button).
**Action:** Always add `aria-live="polite"` and `aria-atomic="true"` to spans displaying dynamic numeric quantities. Furthermore, ensure icon-only action buttons next to these quantities use context-aware `aria-label`s (e.g., `aria-label={"Increase quantity of " + item.name}`) instead of static labels.
