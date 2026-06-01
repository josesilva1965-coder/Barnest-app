
## 2024-05-24 - Context-Aware ARIA Labels
**Learning:** Dynamic list items with icon-only action buttons (like cart quantity +/-) need context-aware ARIA labels (interpolating item name) to be understandable by screen readers.
**Action:** Always interpolate `item.name` in `aria-label` for action buttons inside map loops, and add `aria-live="polite"` to dynamically updating quantities.
