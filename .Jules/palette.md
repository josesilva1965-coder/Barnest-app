
## 2024-05-15 - [Dynamic list items and action buttons]
**Learning:** Action buttons inside dynamic lists (like cart quantities) must use context-aware `aria-label`s interpolating the item's name to provide clear feedback for screen reader users. Additionally, numeric containers updated dynamically should include `aria-live="polite"` to announce updates naturally.
**Action:** Consistently use template strings for `aria-label`s inside arrays of dynamically rendered components (e.g. `Decrease quantity of ${item.name}`), and use `aria-live="polite"` for any dynamic text that gets updated based on user actions.
