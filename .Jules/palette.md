## 2024-05-23 - Interactive Card Accessibility
**Learning:** The application heavily used custom `Card` components (implemented as `div`s) for primary interactions like menu selection and staff login, making them inaccessible to keyboard users.
**Action:** When creating interactive card-like components, always wrap them in semantic `<button>` elements (using `group` utility for nested hover styles) rather than attaching `onClick` handlers directly to `div`s. This ensures native keyboard focus and activation support.
