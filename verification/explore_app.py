
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the app
        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for content to load
        page.wait_for_timeout(2000)

        # Take screenshot of login screen
        page.screenshot(path="verification/1_login_screen.png")
        print("Login screen screenshot taken.")

        # Try to login as Manager (David)
        # Find the card with "David"
        page.click("text=David")

        # Take screenshot of password input
        page.screenshot(path="verification/2_password_input.png")

        # Type password
        page.fill("input[type='password']", "admin")
        page.click("button:has-text('Login')")

        # Wait for dashboard
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/3_dashboard.png")

        print("Dashboard screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
