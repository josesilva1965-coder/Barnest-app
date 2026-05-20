
## 2024-05-17 - Context-Aware ARIA Labels & Live Regions in Dynamic Lists
**Learning:** Action buttons inside dynamic list items (like cart quantity increment/decrement/remove buttons) need context-aware `aria-label`s that interpolate the item name. Additionally, dynamically updating numerical displays (like item quantity) require `aria-live="polite"` and `aria-atomic="true"` for accurate screen reader announcements. Using focus-visible styles also improves keyboard navigation without compromising mouse interaction.
**Action:** Always interpolate item names in `aria-label`s for action buttons in mapped lists, and add `aria-live` attributes to changing numeric spans in carts.
