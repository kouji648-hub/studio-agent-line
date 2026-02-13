import { firefox } from 'playwright';

(async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 }
  });

  try {
    await page.goto('https://kouji648-hub.github.io/studio-agent-line/pattern-b-timing.html', {
      waitUntil: 'networkidle'
    });

    await page.waitForTimeout(2000);
    await page.click('text=👶 生後1ヶ月以内');
    await page.waitForTimeout(2000);
    await page.click('text=👶 ニューボーン撮影');
    await page.waitForTimeout(2000);
    await page.click('text=📸 スタジオ撮影');
    await page.waitForTimeout(3000);

    // スクリーンショット撮影
    await page.screenshot({ path: '/tmp/newborn-gallery.png', fullPage: true });
    console.log('✅ スクリーンショット保存: /tmp/newborn-gallery.png');

  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
})();
