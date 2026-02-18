# Bug Report: Blocking Alert Dialog on Order Submission

## Description
When a user clicks the "Send Order" button in the POS interface, the application uses a native browser `alert()` dialog to confirm that the order has been sent. This creates a jarring user experience as it blocks the entire browser window until dismissed and requires an extra click from the user.

## Expected Behavior
- The "Send Order" button should show a loading state (spinner/disabled) while the request is processing.
- Upon successful submission, a non-blocking inline success message or toast notification should appear.
- The UI should not be blocked by a modal dialog.

## Current Behavior
- The "Send Order" button does not indicate loading state.
- A blocking `alert()` dialog appears immediately after the API call completes.
- The user must click "OK" to continue using the application.

## Steps to Reproduce
1. Open the POS interface.
2. Select a table.
3. Add items to the order.
4. Click "Send Order to Kitchen/Bar".
5. Observe the browser alert dialog.

## Impact
- Interrupts workflow for high-volume users (bartenders/servers).
- Feels unprofessional and unpolished.
- Requires unnecessary interaction (clicking "OK").
