
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture console messages
        messages = []
        page.on('console', lambda msg: messages.append(msg.text))

        await page.goto('http://localhost:3000')

        # Wait for 5 seconds to ensure all rendering is complete
        await asyncio.sleep(5)

        await page.screenshot(path='jules-scratch/verification/verification.png')

        await browser.close()

        print('Captured messages:', messages)

        if any('Hello from the backend!' in message for message in messages):
            print('Verification successful: Found "Hello from the backend!" in console.')
        else:
            print('Verification failed: Did not find "Hello from the backend!" in console.')

if __name__ == '__main__':
    asyncio.run(main())
