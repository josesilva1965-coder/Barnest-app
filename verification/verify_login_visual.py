
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000")

        # Wait for any text that appears on the page
        page.wait_for_selector("text=BarNest")

        print("Checking for 'David' button...")
        try:
            # Attempt to find the button with text "David"
            david_button = page.locator("button", has_text="David")

            if david_button.count() > 0:
                print("SUCCESS: Found <button> for David.")
            else:
                print("FAILURE: Did not find <button> for David.")
                return

            # Take screenshot of the buttons
            page.screenshot(path="verification/login_a11y.png")
            print("Screenshot taken.")

        except Exception as e:
            print(f"Error locating element: {e}")

        browser.close()

if __name__ == "__main__":
    run()
