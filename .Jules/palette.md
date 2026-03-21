
## 2025-03-21 - Cart Action Buttons Accessibility
**Learning:** Icon-only action buttons (increase/decrease/remove) inside dynamic list items (like the POS cart) lack context for screen readers if they don't interpolate the item's name in their `aria-label`. Without this context, visually impaired users hear "Remove, Remove, Remove" instead of "Remove Classic Mojito".
**Action:** Always add context-aware `aria-label`s to dynamic action buttons (e.g. `aria-label={\`Remove \${item.name} from order\`}`) and ensure visible focus states (`focus:ring-2`) are present for keyboard navigation.
