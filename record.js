const { chromium } = require('playwright');
const url = process.argv[2];

if (!url) {
  console.error('אנא ספק כתובת אתר.');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  
  // הגדרת הרזולוציה ל- 1920x1080
  const context = await browser.newContext({
    recordVideo: { dir: 'videos/' },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Scrolling down for 5 seconds...');
  
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const duration = 5000;
      const intervalTime = 50;
      const totalScrollDistance = document.body.scrollHeight - window.innerHeight;
      const ticks = duration / intervalTime;
      const scrollStep = totalScrollDistance / ticks;

      const timer = setInterval(() => {
        window.scrollBy(0, scrollStep);
      }, intervalTime);

      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, duration);
    });
  });

  await context.close();
  await browser.close();
  console.log('Video saved successfully!');
})();
