## 2026-02-23 - Interactive Menu Cards Accessibility
**Learning:** Implementing interactive menu cards as `div` elements with `onClick` handlers creates an accessibility barrier for keyboard users and screen readers, as they lack native focus and activation semantics.
**Action:** Replace `div` implementations with semantic `<button>` elements for all interactive cards, ensuring proper styling (e.g., `text-left`, `w-full`) to maintain visual design while providing built-in accessibility.
