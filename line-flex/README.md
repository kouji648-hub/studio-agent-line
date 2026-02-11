# LINE Flex Message JSON

このディレクトリには、LINE公式アカウントで使用できるFlex Message形式のJSONファイルが含まれています。

## 📁 ファイル一覧

| ファイル | 用途 | 形式 |
|---------|------|------|
| `carousel-newborn.json` | ニューボーンプランのカルーセル | Carousel (2枚) |
| `carousel-omiyamairi.json` | お宮参りプランのカルーセル | Carousel (2枚) |
| `carousel-shichigosan.json` | 七五三プランのカルーセル | Carousel (2枚) |
| `needs-selection.json` | ニーズ選択ボタン（10個） | Bubble |
| `comparison-table.json` | プラン比較表（4プラン） | Carousel (4枚) |
| `rich-message-template.json` | リッチメッセージテンプレート | Bubble |
| `cta-buttons.json` | 予約・相談ボタン | Bubble |

## 🎨 デザイン仕様

### カラー

| 用途 | カラーコード |
|------|------------|
| メインピンク | `#ff6b9d` |
| LINE緑 | `#06C755` |
| テキスト（濃） | `#333333` |
| テキスト（中） | `#666666` |
| テキスト（薄） | `#aaaaaa` |
| グレー | `#999999` |
| 背景ピンク | `#fff9fb` |
| 白 | `#ffffff` |

### フォントサイズ

| 要素 | サイズ |
|------|--------|
| タイトル（大） | `xxxl` / `xxl` / `xl` |
| 本文 | `md` / `sm` |
| 補足テキスト | `xs` |

## 🔧 使用方法

### 1. LINE Flex Message Simulatorで確認

```
https://developers.line.biz/flex-simulator/
```

各JSONファイルの内容をコピー＆ペーストして、実際の表示を確認できます。

### 2. Messaging APIで送信

```javascript
const message = {
  type: 'flex',
  altText: 'プラン詳細',
  contents: require('./carousel-newborn.json')
};

await client.pushMessage(userId, message);
```

### 3. カスタマイズ方法

#### 画像URLの変更

各JSONファイルの `hero.url` を実際のスタジオ写真URLに変更してください：

```json
"hero": {
  "type": "image",
  "url": "https://hikarinostudio.com/wp-content/uploads/actual-photo.jpg",
  ...
}
```

#### アクションURIの変更

ボタンの `action.uri` を実際の予約フォームURLに変更してください：

```json
"action": {
  "type": "uri",
  "label": "詳しく見る",
  "uri": "https://hikarinostudio.com/プラン/newbornplan/"
}
```

#### 電話番号の設定

`cta-buttons.json` の電話番号を実際の番号に変更してください：

```json
{
  "type": "text",
  "text": "0985-XX-XXXX", // ← 実際の電話番号に変更
  ...
}
```

## 📊 プラン比較表の使い方

`comparison-table.json` は4つのプラン（ニューボーン、お宮参り、七五三、バースデー）を横スワイプで比較できるカルーセルです。

### 比較項目

1. 料金（税込）
2. 撮影カット数
3. 衣装内容
4. 兄弟撮影
5. ママ訪問着
6. 神社ロケ
7. 出張撮影
8. ベストタイミング

### カスタマイズ

- 各プランの情報を更新する場合は、対応するbubbleのbody部分を編集してください
- 新しいプランを追加する場合は、既存のbubbleをコピーして `contents` 配列に追加してください

## 🎯 ニーズ選択ボタンの使い方

`needs-selection.json` は10個のニーズ別ボタンを表示します。

### Postbackデータ

各ボタンは `postback` アクションで以下のデータを送信します：

```javascript
need=nervous   // プロに撮ってもらいたいけど緊張する
need=costume   // 撮影用の衣装をどうすればいいか
need=crying    // 赤ちゃんが泣かないか心配
need=price     // 料金やプランがよくわからない
need=location  // ロケ撮影に興味がある
need=kimono    // 訪問着を着たい（ママ向け）
need=oneday    // 1日で撮影もお参りも済ませたい
need=siblings  // 兄弟も一緒に撮りたい
need=shrine    // 神社でお参りもしたい
need=athome    // 自宅で自然な雰囲気で撮りたい
```

### バックエンドでの処理例

```javascript
if (event.type === 'postback') {
  const data = new URLSearchParams(event.postback.data);
  const need = data.get('need');

  switch(need) {
    case 'nervous':
      // 緊張するお客様向けのフローを開始
      break;
    case 'kimono':
      // お宮参りベーシックプラン（訪問着無料）を提案
      break;
    // ...
  }
}
```

## 🚀 実装手順

1. **画像の準備**: 各プランの実際の写真をアップロードし、URLを取得
2. **JSONのカスタマイズ**: 画像URL、料金、アクションURIを更新
3. **Simulatorで確認**: 実機と同じ表示を確認
4. **Messaging APIで送信**: バックエンドに組み込んで送信テスト
5. **スマホ実機で確認**: 実際のLINEアプリで表示を確認

## ⚠️ 注意点

### 画像サイズ

- アスペクト比: `20:13` または `1:1`
- 推奨サイズ: 1024x660px（20:13の場合）
- 最大ファイルサイズ: 10MB

### altText

Flex Messageを送信する際は、必ず `altText` を設定してください：

```javascript
{
  type: 'flex',
  altText: 'ニューボーンプラン詳細', // ← 必須
  contents: {...}
}
```

### テスト環境

- **Simulator**: https://developers.line.biz/flex-simulator/
- **LINE Official Account**: テストアカウントで送信テスト
- **実機確認**: iPhone / Android両方で確認

## 📝 変更履歴

- 2026-02-11: 初版作成（Task 7完了）
  - 7種類のFlexMessage JSONを作成
  - ブランドカラー（#ff6b9d, #06C755）を統一
  - 10個のニーズ選択ボタンを実装
  - 4プラン比較表を実装

---

**プロジェクト**: studio-agent-line
**デモサイト**: https://kouji648-hub.github.io/studio-agent-line/
