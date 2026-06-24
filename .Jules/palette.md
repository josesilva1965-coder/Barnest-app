## 2026-06-24 - Add accessibility labels to dynamic list buttons
**Learning:** Action buttons within dynamic list items (like cart quantity controls) require context-aware `aria-label`s and native `title` tooltips that interpolate the item's name to ensure clear feedback for screen reader and mouse users. Focus visible styles are also needed.
**Action:** Always add interpolated `aria-label` and `title` to icon-only buttons in maps, e.g., `aria-label={\`Decrease quantity of ${item.name}\`}`.
