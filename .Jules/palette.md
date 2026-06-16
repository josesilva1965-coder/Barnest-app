
## 2026-06-16 - Dynamic List Icon-only Buttons
**Learning:** Icon-only action buttons within dynamic lists (like cart quantity controls) need context-aware `aria-label`s and `title` attributes that interpolate the item's name to ensure clear feedback for screen reader and mouse users. Also, dynamic numeric containers like cart quantities need `aria-live="polite"` and `aria-atomic="true"` to ensure screen readers announce updates accurately.
**Action:** When creating or reviewing dynamic lists with icon-only buttons or dynamic values, ensure interpolated `aria-label`s/`title`s are present and `aria-live` is configured correctly.
