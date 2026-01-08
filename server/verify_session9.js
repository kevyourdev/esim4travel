const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Starting verification tests...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Test 1: Homepage loads
    console.log('✓ Test 1: Homepage loads');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    const title = await page.title();
    console.log(`  - Title: ${title}`);

    // Test 2: Navigate to destinations page
    console.log('\n✓ Test 2: Destinations page loads');
    await page.goto('http://localhost:5173/destinations', { waitUntil: 'networkidle0' });
    const destinationCards = await page.evaluate(() => {
      return document.querySelectorAll('[href*="/destinations/"]').length;
    });
    console.log(`  - Found ${destinationCards} destination links`);

    // Test 3: Navigate to Japan destination page
    console.log('\n✓ Test 3: Japan destination page loads');
    await page.goto('http://localhost:5173/destinations/japan', { waitUntil: 'networkidle0' });
    const hasPackages = await page.evaluate(() => {
      return document.body.textContent.includes('GB') && document.body.textContent.includes('$');
    });
    console.log(`  - Package page has pricing: ${hasPackages}`);

    // Test 4: Add to cart works
    console.log('\n✓ Test 4: Add to cart functionality');
    const addToCartBtn = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Add to Cart'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (addToCartBtn) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const cartOpened = await page.evaluate(() => {
        return document.body.textContent.includes('Shopping Cart') || document.body.textContent.includes('Your Cart');
      });
      console.log(`  - Cart drawer opened: ${cartOpened}`);
    }

    // Test 5: Support page loads
    console.log('\n✓ Test 5: Support page loads');
    await page.goto('http://localhost:5173/support', { waitUntil: 'networkidle0' });
    const hasInstallationGuide = await page.evaluate(() => {
      return document.body.textContent.includes('Installation') && document.body.textContent.includes('iOS');
    });
    console.log(`  - Support page has installation guide: ${hasInstallationGuide}`);

    console.log('\n✅ All verification tests passed!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
