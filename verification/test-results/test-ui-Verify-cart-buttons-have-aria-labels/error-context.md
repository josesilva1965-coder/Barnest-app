# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-ui.spec.ts >> Verify cart buttons have aria-labels
- Location: test-ui.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "BarNest" [level=1] [ref=e4]
  - heading "Select your profile to sign in" [level=2] [ref=e5]
  - generic [ref=e6]:
    - generic "Login as Anna" [ref=e7] [cursor=pointer]:
      - generic [ref=e8]:
        - img [ref=e9]
        - paragraph [ref=e11]: Anna
        - paragraph [ref=e12]: Server
    - generic "Login as John" [ref=e13] [cursor=pointer]:
      - generic [ref=e14]:
        - img [ref=e15]
        - paragraph [ref=e17]: John
        - paragraph [ref=e18]: Server
    - generic "Login as Mike" [ref=e19] [cursor=pointer]:
      - generic [ref=e20]:
        - img [ref=e21]
        - paragraph [ref=e23]: Mike
        - paragraph [ref=e24]: Bartender
    - generic "Login as Chloe" [ref=e25] [cursor=pointer]:
      - generic [ref=e26]:
        - img [ref=e27]
        - paragraph [ref=e29]: Chloe
        - paragraph [ref=e30]: Bartender
    - generic "Login as David" [ref=e31] [cursor=pointer]:
      - generic [ref=e32]:
        - img [ref=e33]
        - paragraph [ref=e35]: David
        - paragraph [ref=e36]: Manager
    - generic "Login as Maria" [ref=e37] [cursor=pointer]:
      - generic [ref=e38]:
        - img [ref=e39]
        - paragraph [ref=e41]: Maria
        - paragraph [ref=e42]: Kitchen
  - button "Are you a customer? Make a Reservation" [ref=e44] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Verify cart buttons have aria-labels', async ({ page }) => {
  4  |   // Login as Manager
  5  |   await page.goto('http://localhost:3000/');
  6  |   await page.waitForTimeout(2000);
  7  |   await page.locator('text=David').first().click();
  8  |   await page.locator('input[type="password"]').fill('admin');
  9  |   await page.locator('button', { hasText: 'Login' }).click();
  10 |
  11 |   // Navigate to Tables, select table 1
  12 |   await page.waitForTimeout(1000);
  13 |   await page.locator('text=Tables').first().click();
  14 |   await page.waitForTimeout(1000);
  15 |   await page.locator('text=B1').click();
  16 |
  17 |   // Add an item to the POS order
  18 |   await page.waitForTimeout(1000);
  19 |
  20 |   // Try to find IPA Beer
  21 |   const itemLocator = page.locator('text=IPA Beer').first();
  22 |   await itemLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => console.log("Not found"));
  23 |   if (await itemLocator.isVisible()) {
  24 |     await itemLocator.click();
  25 |   } else {
  26 |       // Fallback
  27 |       await page.locator('text=Drink').first().click().catch(() => {});
  28 |       await page.waitForTimeout(1000);
  29 |       await page.locator('text=Wagyu Burger').first().click().catch(() => {});
  30 |       await page.locator('text=Add to Order').first().click().catch(() => {});
  31 |   }
  32 |   await page.waitForTimeout(1000);
  33 |
  34 |   // Verify POS screen buttons
  35 |   const posDecreaseBtn = page.locator('button[aria-label^="Decrease quantity of"]');
  36 |   const posIncreaseBtn = page.locator('button[aria-label^="Increase quantity of"]');
  37 |   const posTrashBtn = page.locator('button[aria-label^="Remove"]').and(page.locator('button[aria-label$="from order"]'));
  38 |
  39 |   await expect(posDecreaseBtn).toBeVisible();
  40 |   await expect(posIncreaseBtn).toBeVisible();
  41 |   await expect(posTrashBtn).toBeVisible();
  42 |
  43 |   // Test Customer View
  44 |   await page.goto('http://localhost:3000/?view=customer&table=1');
  45 |   await page.waitForTimeout(2000);
  46 |
  47 |   // Click the first item to add to order
  48 |   const customerItem = page.locator('text=IPA Beer').first();
  49 |   await customerItem.waitFor({ state: 'visible', timeout: 5000 }).catch(() => console.log("Not found"));
  50 |   if (await customerItem.isVisible()) {
  51 |       await customerItem.click();
  52 |   } else {
  53 |       await page.locator('text=Wagyu Burger').first().click().catch(() => {});
  54 |       await page.locator('text=Add to Order').first().click().catch(() => {});
  55 |   }
> 56 |   await page.waitForTimeout(1000);
     |              ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  57 |
  58 |   // Look for the Decrease/Increase buttons with the aria-label
  59 |   // The aria-label pattern is `Decrease quantity of ${itemName}`
  60 |   const decreaseBtn = page.locator('button[aria-label^="Decrease quantity of"]');
  61 |   const increaseBtn = page.locator('button[aria-label^="Increase quantity of"]');
  62 |
  63 |   // Assert they exist and are visible
  64 |   await expect(decreaseBtn).toBeVisible();
  65 |   await expect(increaseBtn).toBeVisible();
  66 | });
  67 |
```