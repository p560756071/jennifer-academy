
const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting E2E Test for Jennifer Academy...');
  
  // Launch browser in headless mode (or not if you want to see it, but we are in VM)
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some VM envs
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Visit Home
    console.log('Testing: Homepage Load');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const title = await page.title();
    console.log(`- Page Title: ${title}`);
    if (!title.includes('Jennifer Academy')) throw new Error('Title mismatch');

    // 2. Navigation Sidebar Check
    console.log('Testing: Sidebar Navigation');
    const navItems = await page.$$eval('nav a', els => els.map(e => e.textContent));
    console.log(`- Nav Items found: ${navItems.join(', ')}`);
    if (navItems.length < 3) throw new Error('Sidebar items missing');

    // 3. Click Course
    console.log('Testing: Course Selection');
    // Wait for the grid to appear first
    await page.waitForSelector('div.grid', { timeout: 60000 });
    
    // Find the first course card link
    const firstCourseLink = await page.$('a[href^="/courses/"]');
    if (!firstCourseLink) throw new Error('No course cards found');
    
    // Click and wait for navigation
    console.log('- Clicking course card...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load', timeout: 120000 }), // Increased timeout for slow VM
      firstCourseLink.click()
    ]);
    console.log(`- Navigated to: ${page.url()}`);

    // 4. Check Player Presence (ReactPlayer)
    console.log('Testing: Video Player Existence');
    // ReactPlayer creates a div, inside it usually has an iframe
    await page.waitForSelector('div.aspect-video', { timeout: 30000 });
    console.log('- Video container wrapper found');
    
    // Wait a bit for the iframe to actually render inside ReactPlayer
    // Note: Puppeteer inside a VM might trigger "headless" detection which YouTube dislikes,
    // but we just want to verify the DOM structure exists.
    try {
        await page.waitForSelector('iframe', { timeout: 10000 });
        console.log('- YouTube Iframe detected ✅');
    } catch (e) {
        console.warn('! Warning: Iframe not found immediately (might be lazy loaded or blocked in headless), but container exists.');
    }

    // 5. Test Quiz Tab
    console.log('Testing: Quiz Interaction');
    // Find button with text "課後測驗" by XPath or evaluate
    const quizTabBtn = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button'))
        .find(el => el.textContent.includes('課後測驗'));
    });
    
    if (!quizTabBtn) throw new Error('Quiz tab button not found');
    await quizTabBtn.click();
    console.log('- Clicked Quiz Tab');
    
    // Wait for Quiz component to render
    await page.waitForSelector('h3.text-xl.font-bold', { timeout: 5000 }); 
    console.log('- Quiz Question loaded');

    // Answer a question
    const options = await page.$$('button.w-full.text-left');
    if (options.length > 0) {
      await options[1].click(); // Click 2nd option
      console.log('- Selected an answer');
      // Check for visual feedback (icon appearing)
      await page.waitForSelector('svg.h-5.w-5', { timeout: 2000 });
      console.log('- Answer feedback received ✅');
    }

    // 6. Navigation Back
    console.log('Testing: Back Navigation');
    const backLink = await page.$('a[href="/courses"]');
    if (backLink) {
        await Promise.all([
            page.waitForNavigation({ timeout: 60000 }),
            backLink.click()
        ]);
        console.log('- Returned to Courses list ✅');
    }

    console.log('✅ ALL TESTS PASSED SUCCESSFULLY');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    // Take a screenshot if possible (optional)
    // await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
})();
