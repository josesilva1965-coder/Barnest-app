from playwright.sync_api import Page, expect, sync_playwright
import os
import glob

def verify_feature(page: Page):
  # Navigate to the app
  page.goto("http://localhost:3000")
  page.wait_for_timeout(1000)

  # Login as David (Manager)
  page.locator("div[aria-label='Login as David']").click()
  page.wait_for_timeout(500)
  page.get_by_placeholder("Enter Password").fill("admin")
  page.wait_for_timeout(500)
  page.get_by_role("button", name="Login").click()
  page.wait_for_timeout(1000)

  # Navigate to Tables and select a table
  page.get_by_text("Tables").click()
  page.wait_for_timeout(500)
  page.get_by_text("B1").click()
  page.wait_for_timeout(1000)

  # Add an item to the order to show the cart
  page.get_by_text("Food").click()
  page.wait_for_timeout(500)
  page.get_by_text("Margherita Pizza").first.click()
  page.wait_for_timeout(1000)

  # Margherita Pizza has modifiers, we need to add to order
  page.get_by_role("button", name="Add to Order").click()
  page.wait_for_timeout(1000)

  # Focus the increase quantity button to show focus ring and check aria-label
  increase_btn = page.locator("button[aria-label='Increase quantity of Margherita Pizza']")
  expect(increase_btn).to_be_visible()
  increase_btn.focus()
  page.wait_for_timeout(500)

  # Focus the decrease quantity button to show focus ring and check aria-label
  decrease_btn = page.locator("button[aria-label='Decrease quantity of Margherita Pizza']")
  expect(decrease_btn).to_be_visible()
  decrease_btn.focus()
  page.wait_for_timeout(500)

  # Focus the remove button to show focus ring and check aria-label
  remove_btn = page.locator("button[aria-label='Remove Margherita Pizza from order']")
  expect(remove_btn).to_be_visible()
  remove_btn.focus()
  page.wait_for_timeout(500)

  # Check the aria-live span
  quantity_span = page.locator("span[aria-live='polite']")
  expect(quantity_span).to_be_visible()
  expect(quantity_span).to_have_text("1")

  # Screenshot the focused cart item
  page.screenshot(path="verification/verification.png")
  page.wait_for_timeout(1000)

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(record_video_dir="verification/video")
    page = context.new_page()
    try:
      verify_feature(page)
    finally:
      context.close()  # Important: close context to save the video
      browser.close()
