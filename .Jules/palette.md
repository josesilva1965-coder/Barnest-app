## 2026-02-22 - Semantic Button Replacement for Cards
**Learning:** The application frequently uses styled `Card` components (divs) with `onClick` handlers for interactive elements like menu items, which breaks keyboard accessibility (no focus, no activation by keyboard) and semantic meaning.
**Action:** When encountering interactive cards, refactor them to use semantic `<button>` elements while preserving the visual style by applying the same utility classes (and focus states).
