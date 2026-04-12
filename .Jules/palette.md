## 2024-05-16 - Context-Aware ARIA Labels for Dynamic Lists
**Learning:** When adding ARIA labels to buttons inside dynamic lists (like cart items), interpolating the item's name into the label (e.g., `aria-label="Decrease quantity of ${item.name}"`) is significantly more helpful for screen reader users than static labels like "Decrease quantity".
**Action:** Always use dynamic, context-aware `aria-label` attributes for recurring actions within lists or tables to ensure the target of the action is explicitly announced.
