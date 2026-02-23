from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    print("Navigating to app...")
    page.goto("http://localhost:3000")

    # Wait for initial load
    try:
        page.wait_for_selector('div[aria-label="Login as David"]', timeout=10000)
    except:
        print("Login screen not found or timed out. Checking if logged in...")
        if page.locator('nav[aria-label="Main Navigation"]').is_visible():
            print("Already logged in.")
        else:
            print("Page content:", page.content())
            raise

    if page.locator('div[aria-label="Login as David"]').is_visible():
        print("Logging in as David...")
        page.click('div[aria-label="Login as David"]')
        page.fill('input#password-input', "admin")
        page.click('button[type="submit"]')
        page.wait_for_selector('nav[aria-label="Main Navigation"]')
        print("Logged in successfully.")

    print("Navigating to Tables view...")
    # Navigate to Tables view if not there (default might be Tables)
    # Check if we are already on tables view (active state)
    is_tables_active = page.locator('button[aria-label="Navigate to Tables view"][aria-current="page"]').is_visible()

    if not is_tables_active:
         page.click('button[aria-label="Navigate to Tables view"]')
         # Wait for navigation
         page.wait_for_selector('button[aria-label="Navigate to Tables view"][aria-current="page"]', timeout=5000)

    print("Selecting a table...")
    # Wait for tables to load
    try:
        page.wait_for_selector('div[title^="Table "]', timeout=10000)
        # Click the first table
        page.locator('div[title^="Table "]').first.click()
    except Exception as e:
        print(f"Could not find any table: {e}")
        print(page.content())
        raise

    print("Waiting for POS screen...")
    # POS screen should load menu items
    page.wait_for_selector('button[aria-label^="Add "]', timeout=10000)

    print("Verifying menu items are buttons...")
    menu_item_btn = page.locator('button[aria-label^="Add "]').first
    assert menu_item_btn.is_visible()

    tag_name = menu_item_btn.evaluate("el => el.tagName")
    assert tag_name == "BUTTON", f"Expected BUTTON, got {tag_name}"

    item_aria_label = menu_item_btn.get_attribute("aria-label")
    item_name = item_aria_label.replace("Add ", "").split(" to order")[0]
    print(f"Found item: {item_name}")

    print(f"Clicking item: {item_name}")
    menu_item_btn.click()

    print("Verifying order item controls...")
    decrease_btn_selector = f'button[aria-label="Decrease quantity of {item_name}"]'
    page.wait_for_selector(decrease_btn_selector)

    assert page.locator(decrease_btn_selector).is_visible()
    assert page.locator(f'button[aria-label="Increase quantity of {item_name}"]').is_visible()
    assert page.locator(f'button[aria-label="Remove {item_name} from order"]').is_visible()

    print("Taking screenshot...")
    page.screenshot(path="verification_pos.png")
    print("Verification successful!")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
