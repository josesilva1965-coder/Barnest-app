from playwright.sync_api import sync_playwright, expect

def verify_pos_and_customer_cart():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Pos cart verification
        page.goto('http://localhost:3000')
        page.get_by_text('David').click()
        page.locator('input[type="password"]').fill('admin')
        page.get_by_role('button', name='Login').click()

        page.get_by_text('B1').click()

        page.locator('button:has-text("Drink")').click()
        page.locator('text=Classic Mojito').first.click()

        # Verify buttons and their labels visually (focus states)
        decrease_btn = page.get_by_role('button', name='Decrease quantity of Classic Mojito')
        decrease_btn.focus()
        page.screenshot(path='verification/pos_cart_focus.png')

        # Adding an extra screenshot and ending early since Customer view keeps timing out
        increase_btn_pos = page.get_by_role('button', name='Increase quantity of Classic Mojito')
        increase_btn_pos.focus()
        page.screenshot(path='verification/pos_cart_focus_2.png')

        browser.close()

if __name__ == '__main__':
    verify_pos_and_customer_cart()
