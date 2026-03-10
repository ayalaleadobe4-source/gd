const { chromium } = require('playwright');
const url = process.argv[2];

if (!url) {
  console.error('אנא ספק כתובת אתר.');
  process.exit(1);
}

(async () => {
  // פתיחת דפדפן כרום
  const browser = await chromium.launch();
  
  // יצירת הקשר (Context) והגדרת תיקיית השמירה של הוידאו וגודל המסך
  const context = await browser.newContext({
    recordVideo: { dir: 'videos/' },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  console.log(`Navigating to ${url}...`);
  // מעבר לכתובת והמתנה עד שהרשת תהיה שקטה (הכל נטען)
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Scrolling down for 5 seconds...');
  
  // פונקציית גלילה חלקה במשך 5 שניות
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const duration = 5000; // 5 שניות
      const intervalTime = 50; // כל 50 מילישניות נבצע גלילה קטנה
      const totalScrollDistance = document.body.scrollHeight - window.innerHeight;
      const ticks = duration / intervalTime;
      const scrollStep = totalScrollDistance / ticks;

      const timer = setInterval(() => {
        window.scrollBy(0, scrollStep);
      }, intervalTime);

      // עצירת הגלילה אחרי 5 שניות
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, duration);
    });
  });

  // סגירת ההקשר שומרת את הוידאו באופן סופי
  await context.close();
  await browser.close();
  console.log('Video saved successfully!');
})();
