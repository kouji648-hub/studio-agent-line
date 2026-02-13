import { firefox } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyPatternA(page) {
  console.log('\n=== Pattern A 確認開始 ===');

  await page.goto(`file://${join(__dirname, 'pattern-a-interest.html')}`);
  await sleep(2000);

  // 選択肢が表示されるまで待つ
  await page.waitForSelector('.choices button', { timeout: 10000 });

  // ハーフバースデーが削除されているか確認
  console.log('✓ ハーフバースデー削除確認中...');
  await page.screenshot({ path: 'screenshots/pattern-a-initial.png', fullPage: true });

  // バースデー・記念日をクリック
  console.log('✓ バースデー・記念日クリック...');
  await page.click('.choices button:has-text("🎂 バースデー・記念日")');
  await sleep(2000);

  // カルーセルが表示されるまで待つ
  await page.waitForSelector('.carousel .card', { state: 'attached', timeout: 10000 });
  await sleep(1000);
  await page.screenshot({ path: 'screenshots/pattern-a-birthday.png', fullPage: true });

  // カード数を確認
  const cards = await page.locator('.carousel .card').count();
  console.log(`  → カード数: ${cards}枚 (期待値: 2枚)`);

  // ハーフバースデーカードがないか確認
  const halfBirthdayCard = await page.locator('.card:has-text("ハーフバースデー")').count();
  console.log(`  → ハーフバースデーカード: ${halfBirthdayCard}枚 (期待値: 0枚)`);

  return cards === 2 && halfBirthdayCard === 0;
}

async function verifyPatternB(page) {
  console.log('\n=== Pattern B 確認開始（最重要） ===');

  await page.goto(`file://${join(__dirname, 'pattern-b-timing.html')}`);
  await sleep(2000);

  // 選択肢が表示されるまで待つ
  await page.waitForSelector('.choices button', { timeout: 10000 });

  // テスト1: 妊娠中フロー（2段階選択）
  console.log('✓ テスト1: 妊娠中フロー');
  await page.screenshot({ path: 'screenshots/pattern-b-initial.png', fullPage: true });

  await page.click('.choices button:has-text("🤰 妊娠中です")');
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/pattern-b-pregnant-1.png', fullPage: true });

  // タイムライン確認（ハーフバースデーがないこと）
  const timelineText = await page.textContent('.chat');
  const hasHalfBirthday = timelineText.includes('生後6ヶ月') || timelineText.includes('ハーフバースデー');
  console.log(`  → ハーフバースデー表示: ${hasHalfBirthday ? 'あり（NG）' : 'なし（OK）'}`);

  // 次の選択肢を待つ
  await page.waitForSelector('.choices button', { timeout: 10000 });
  await page.click('.choices button:has-text("🤔 もう少し考えたい")');
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/pattern-b-pregnant-2.png', fullPage: true });

  // サブ選択肢を待つ
  await page.waitForSelector('.choices button', { timeout: 10000 });
  await page.click('.choices button:has-text("🏠 スタジオの雰囲気を見たい")');
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/pattern-b-pregnant-3.png', fullPage: true });

  // Instagramリンク確認
  const instagramText = await page.textContent('.chat');
  const hasInstagram = instagramText.includes('instagram.com');
  console.log(`  → Instagramリンク: ${hasInstagram ? '表示あり' : '表示なし'}`);

  // ページをリロード
  await page.reload();
  await sleep(2000);
  await page.waitForSelector('.choices button', { timeout: 10000 });

  // テスト2: ニューボーンフロー
  console.log('✓ テスト2: ニューボーンフロー');
  await page.click('.choices button:has-text("👶 生後1ヶ月以内")');
  await sleep(2000);

  await page.waitForSelector('.choices button', { timeout: 10000 });
  await page.click('.choices button:has-text("👶 ニューボーン撮影がしたい")');
  await sleep(2000);

  await page.waitForSelector('.choices button', { timeout: 10000 });
  await page.click('.choices button:has-text("📸 スタジオ撮影")');
  await sleep(4000); // sendNewbornStudioInfo()の実行を待つ
  await page.screenshot({ path: 'screenshots/pattern-b-newborn.png', fullPage: true });

  // 予約リンク確認
  const chatContent = await page.textContent('.chat');
  const hasReservation = chatContent.includes('bit.ly/3GSS8c');
  console.log(`  → 予約リンク: ${hasReservation ? '表示あり' : '表示なし'}`);

  // 写真確認
  const images = await page.locator('img[src*="hikarinostudio.com"]').count();
  console.log(`  → 表示画像数: ${images}個`);

  return hasInstagram && hasReservation && images > 0;
}

async function verifyPatternC(page) {
  console.log('\n=== Pattern C 確認開始 ===');

  await page.goto(`file://${join(__dirname, 'pattern-c-needs.html')}`);
  await sleep(2000);

  // 選択肢が表示されるまで待つ
  await page.waitForSelector('.choices button', { timeout: 10000 });
  await page.screenshot({ path: 'screenshots/pattern-c-initial.png', fullPage: true });

  // 兄弟撮影フロー
  console.log('✓ 兄弟撮影フロー');
  await page.click('.choices button:has-text("👨‍👩‍👧‍👦 兄弟も一緒に撮りたい")');
  await sleep(2000);
  await page.screenshot({ path: 'screenshots/pattern-c-siblings.png', fullPage: true });

  // 詳細説明が表示されているか
  const detailText = await page.textContent('.chat');
  const hasDetails = detailText.includes('着物＆洋装') &&
                     detailText.includes('ソロカット') &&
                     detailText.includes('家族全員');

  console.log(`  → 詳細説明表示: ${hasDetails ? 'OK' : 'NG'}`);

  return hasDetails;
}

async function main() {
  console.log('🚀 ブラウザ動作確認開始\n');

  // screenshotsディレクトリ作成
  await import('fs/promises').then(fs => fs.mkdir('screenshots', { recursive: true }));

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 } // iPhone X サイズ
  });
  const page = await context.newPage();

  try {
    const resultA = await verifyPatternA(page);
    const resultB = await verifyPatternB(page);
    const resultC = await verifyPatternC(page);

    console.log('\n========== 検証結果 ==========');
    console.log(`Pattern A: ${resultA ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Pattern B: ${resultB ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Pattern C: ${resultC ? '✅ PASS' : '❌ FAIL'}`);
    console.log('==============================\n');

    if (resultA && resultB && resultC) {
      console.log('✅ 全テスト合格！本番展開可能です。');
    } else {
      console.log('⚠️ 一部テストが失敗しました。修正が必要です。');
    }

  } catch (error) {
    console.error('❌ エラー発生:', error.message);
  } finally {
    await browser.close();
  }
}

main();
