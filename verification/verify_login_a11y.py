
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000")

        # Wait for any text that appears on the page. "BarNest" is definitely there.
        page.wait_for_selector("text=BarNest")

        print("Checking for 'David' button...")
        try:
            # Attempt to find the button with text "David"
            # This selector specifically looks for a <button> element
            david_button = page.locator("button", has_text="David")

            if david_button.count() > 0:
                print("SUCCESS: Found <button> for David.")
            else:
                print("FAILURE: Did not find <button> for David. Checking for div...")
                # Check if it's a div (current state)
                david_div = page.locator("div", has_text="David").first
                if david_div.count() > 0:
                     print("FOUND: 'David' exists as a div (or inside a div), but not as a top-level button.")
                else:
                     print("FAILURE: Could not find 'David' element at all.")

        except Exception as e:
            print(f"Error locating element: {e}")

        # accessibility check: try to tab to it
        print("Attempting to Tab to the element...")

        focused_david = False
        # Try to tab through the page
        for i in range(20):
            page.keyboard.press("Tab")
            # Get the active element's text content or innerText
            try:
                focused_element_text = page.evaluate("document.activeElement.innerText")
                # print(f"Tab {i+1}: Focused element text: '{focused_element_text}'")
                if "David" in focused_element_text:
                    print("SUCCESS: Tabbed to 'David' element.")
                    focused_david = True
                    break
            except Exception as e:
                pass

        if not focused_david:
            print("FAILURE: Could not Tab to 'David' element.")

        browser.close()

if __name__ == "__main__":
    run()
