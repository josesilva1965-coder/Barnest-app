import { test, expect } from '@playwright/test';

test('Verify ARIA labels and focus states on order item modification buttons', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Login as Manager David
    await page.locator("div[aria-label='Login as David']").click();
    await page.getByPlaceholder('Enter Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    // Select a table to start an order from the Tables view
    await page.getByText('B1', { exact: true }).click();

    // Go to POS view
    await page.getByRole('menuitem', { name: 'Navigate to POS view' }).click();

    // Add an item to the order to test the POS buttons
    await page.getByText('Classic Mojito').click();

    // The item should now be in the order list.
    // Let's verify the ARIA labels on the modification buttons.
    const minusButton = page.getByRole('button', { name: 'Decrease quantity of Classic Mojito' });
    const plusButton = page.getByRole('button', { name: 'Increase quantity of Classic Mojito' });
    const removeButton = page.getByRole('button', { name: 'Remove Classic Mojito' });

    await expect(minusButton).toBeVisible();
    await expect(plusButton).toBeVisible();
    await expect(removeButton).toBeVisible();

    // Verify focus states (testing keyboard navigation simulation)
    await minusButton.focus();
    // Assuming focus ring classes are applied, let's just make sure it's focusable.
    await expect(minusButton).toBeFocused();

    // Also test modifying the quantity to ensure buttons work
    await plusButton.click();
    // Verify that quantity updated
    await expect(page.getByText('2', { exact: true }).first()).toBeVisible();

    await minusButton.click();
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible();

    await removeButton.click();
    await expect(page.getByText('1', { exact: true })).not.toBeVisible();
});
