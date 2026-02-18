from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    try:
        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for "BarNest" header
        page.wait_for_timeout(2000)

        # Login
        print("Logging in as David...")
        page.get_by_text("David", exact=True).click()
        page.fill("input[type='password']", "admin")
        page.click("button[type='submit']")

        print("Logged in. Waiting for dashboard...")
        page.wait_for_timeout(2000)

        print("Looking for B1...")
        # Use B1 as it is visible in Bar Area (default)
        page.get_by_text("B1", exact=True).click()
        print("Clicked B1.")

        # Verify POS screen
        expect(page.get_by_text("Order for B1")).to_be_visible()

        # Add Item
        print("Adding item...")
        page.get_by_text("Classic Mojito").click()

        alert_info = {"triggered": False, "message": ""}
        def handle_dialog(dialog):
            alert_info["triggered"] = True
            alert_info["message"] = dialog.message
            print(f"Dialog appeared: {dialog.message}")
            dialog.accept()

        page.on("dialog", handle_dialog)

        print("Sending order...")
        send_button = page.get_by_role("button", name="Send Order to Kitchen/Bar")
        send_button.click()

        # Check for success message immediately (it handles waiting)
        try:
             expect(page.get_by_text("Order sent successfully!")).to_be_visible(timeout=5000)
             print("SUCCESS: Message displayed.")
             page.screenshot(path="tests/success_verification.png")
        except Exception as e:
             print(f"FAILURE: No success message. Error: {e}")
             # Check if alert was triggered instead
             if alert_info["triggered"]:
                 print(f"FAILURE: Alert triggered instead: {alert_info['message']}")

             page.screenshot(path="tests/success_msg_fail.png")
             exit(1)

        # Also ensure no alert was triggered
        if alert_info["triggered"]:
             print("FAILURE: Alert triggered even though success message appeared (unexpected).")
             exit(1)

    except Exception as e:
        print(f"Test failed: {e}")
        # page.screenshot(path="tests/error.png")
        exit(1)
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
