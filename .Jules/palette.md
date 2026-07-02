## 2024-11-20 - Accessible Icon Buttons & Dynamic Values

**Learning:** Screen readers won't announce the purpose of icon-only action buttons (like plus/minus/trash icons) unless explicitly given an `aria-label` or visually hidden text. Additionally, without a native `title` attribute, mouse users do not get a hover tooltip. For keyboard navigation, icon buttons need clear focus styles (like `focus-visible:ring-2`). Moreover, when numeric values (like cart quantities) update dynamically, they need `aria-live="polite"` and `aria-atomic="true"` so that the screen reader announces the change to users.
**Action:** Consistently apply `aria-label`, `title`, and `focus-visible` styles to all icon-only buttons. Add `aria-live` and `aria-atomic` to elements that frequently change content.
