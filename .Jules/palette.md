## 2024-05-23 - Interactive Card Accessibility
**Learning:** Using `div` with `onClick` for interactive cards (like menu items) excludes keyboard users and screen readers because they lack native focus behaviors and role identification.
**Action:** Use `<button>` elements for interactive cards, even if they contain complex layouts. Style them to look like cards but gain native accessibility benefits (focus, enter/space activation, role="button") for free.
