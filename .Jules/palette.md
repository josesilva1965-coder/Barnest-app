## 2024-03-24 - Accessibility improvements for Cart UI Actions
**Learning:** Icon-only buttons used for cart quantity adjustments lacked `aria-label`s, preventing screen readers from understanding the action. Additionally, numeric quantity text dynamically changes but lacks `aria-live` preventing real-time announcements.
**Action:** Added context-aware `aria-label`s (interpolating item name) to the increase/decrease/remove buttons and added `aria-live="polite"` and `aria-atomic="true"` to dynamic cart quantity containers.
