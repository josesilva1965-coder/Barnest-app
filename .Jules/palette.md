## 2024-05-24 - Missing ARIA labels and title tooltips on icon-only control buttons
**Learning:** Icon-only action buttons inside dynamic lists or cards (like increment/decrement/remove quantities in POS/Customer Order Screens) often lack `aria-label`s or native `title` attributes, causing screen readers to be unhelpful and mouse users to lack explicit tooltips.
**Action:** Add contextual `aria-label`s interpolating item names and use `title` tooltips for clarity on icon-only increment/decrement and trash buttons.
