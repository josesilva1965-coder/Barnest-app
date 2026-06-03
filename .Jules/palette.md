
## 2023-10-27 - Dynamic List Action Button Accessibility
**Learning:** Icon-only action buttons inside dynamic lists (like cart item quantity adjusters) need context-aware `aria-label`s (e.g., "Increase quantity of Wagyu Burger") because screen readers will otherwise just announce "Plus" multiple times with no context. Furthermore, the container holding the numeric value needs `aria-live="polite"` and `aria-atomic="true"` to ensure the screen reader announces the updated quantity when changed.
**Action:** Always interpolate the item name into `aria-label`s for list actions and add `aria-live`/`aria-atomic` to numeric displays that change dynamically without page reloads.
