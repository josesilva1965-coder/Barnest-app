## 2026-02-26 - [Interactive Component Nesting]
**Learning:** When replacing a `div` wrapper with a semantic `button` to improve accessibility for a complex component (like `Card`), mouse-dependent styles (like `hover:border-...`) on the child component will fail if `pointer-events-none` is applied to the child.
**Action:** Use Tailwind's `group` utility on the parent `button` and `group-hover:` variants on the child component to ensure styles trigger correctly based on the parent's interaction state, while maintaining keyboard accessibility.
