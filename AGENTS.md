# AGENTS.md — SURFBOARD FINDER

このRepositoryは `oosaka0123-sudo/ai-master` の共通ルールとWeb制作標準に従う。

## Project rules

- GitHubをSSOTとする。
- Mobile First / Static First / CSS-first motion。
- Heroのみ背景動画を許可し、それ以外は原則として静止画・HTML・CSSを優先する。
- 動画がなくてもHeroが成立するフォールバックを必須とする。
- ロングボードは診断対象外。
- 対象は主に45〜60歳の週末サーファー。
- L数単独で適合判定しない。
- メーカー未公表スペックを推測で埋めない。未知値はUNKNOWNとして扱う。
- 診断順位は広告報酬・ショップ在庫・アフィリエイト報酬を参照してはならない。
- 診断理由は発火ルールから生成し、AI自由作文を正本にしない。
- 外部依存を追加する前に必要性を確認する。
- `npm run check` / `npm run build` を完了条件に含める。
