# studio-agent-line-pages プロジェクトルール

## テスト基準URL
- Playwright等でのテストは GitHub Pages の本番URLを基準にすること
- **テストURL**: https://kouji648-hub.github.io/studio-agent-line/pattern-b-timing.html
- ローカルファイル (`file://`) ではなく、上記URLに対してテストを実行する

## ブラウザ
- Playwright 使用時は Firefox エンジンを使用（Chromium のクラッシュ問題を回避）

## デプロイ
- `git push origin master` で GitHub Pages に自動デプロイ
- デプロイ後、反映まで1〜2分かかる場合がある

## 画像ギャラリー実装の重要ルール ⚠️

### ❌ 失敗例（2026-02-15）
画像を `assets/images/` にアップロードしただけで、表示コードを実装せずにプッシュした結果、GitHub Pages上で画像が表示されなかった。

### ✅ 正しい手順
1. **画像のアップロード**: `assets/images/[プラン名]/` にコピー
2. **表示コードの実装**: `addImageGallery()` を使って画像ギャラリーを追加
3. **複数経路の確認**: 同じプランに複数の経路からアクセスできる場合、すべての経路で同じ処理を実装
4. **ローカル確認**: コード実装後、GitHub Pagesにプッシュ
5. **本番確認**: デプロイ後、実際のフローを手動で確認

### 複数経路チェックリスト
プラン追加時は以下を確認すること：

- [ ] メインメニューからのアクセス（例：「📷 その他の撮影」→「🤰 マタニティフォト」）
- [ ] サブフローからのアクセス（例：ニューボーンフロー内の「🤰 マタニティフォトも撮りたい」）
- [ ] すべての経路で同じ画像ギャラリーと料金カードが表示されるか
- [ ] `grep -n "choice === '[プラン名]'" pattern-b-timing.html` で全ての処理箇所を確認

### 画像ギャラリー実装パターン
```javascript
// 料金カードの前に画像ギャラリーを追加
addImageGallery([
  { src: 'assets/images/[プラン名]/[ファイル名].jpg', alt: '説明' },
  // ...
], '← 横にスライドできます →');

await new Promise(r => setTimeout(r, 2000));

// その後、料金カードを表示
addRichMsg({ ... });
```
