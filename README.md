# SURFBOARD FINDER

45〜60歳の週末サーファーを主対象に、「今の自分に合う次の1本」を見つける日本向けサーフボード診断サイト。

## Product direction

- ロングボードは対象外
- Short / Hybrid / Groveler / Fish / Twin / Midlength / Step-up を中心に扱う
- L数だけで判定しない
- 現在の板、入水頻度、テイクオフ成功率、普段の波、困りごとを重視
- 診断理由はルールベースで説明可能にする
- 広告・アフィリエイト情報は診断順位から分離する

## Design direction

- Target: 45〜60
- Pop + Modern + Adult-friendly
- Heroのみ背景動画
- 2セクション目以降はStatic First / CSS-first motion
- 見ているだけでも楽しい小さなギミックを多数配置
- 読みやすさ、タップしやすさ、軽さを優先
- ローディング画面は禁止

## Domain

Production target: https://surfboard.rss7.net/

## Development

```bash
npm install
npm run check
npm run build
```

GitHub / AI共通ルールは `oosaka0123-sudo/ai-master` の `AGENTS.md` と `WEB_DEVELOPMENT.md` を正本とする。
