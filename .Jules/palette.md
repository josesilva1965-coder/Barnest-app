## 2026-02-25 - Semantic Buttons for Interactive Cards
**Learning:** Interactive cards implemented as clickable `<div>` elements are inaccessible to keyboard and screen reader users, lacking focus states and role announcements.
**Action:** Replace `div` wrappers with semantic `<button>` elements for interactive cards, ensuring `type="button"`, proper `aria-label`, and maintaining visual design with `group-hover` and `focus-visible` styles.
