# SURFBOARD FINDER — Project Specification

## Goal
45〜60歳の週末サーファーが、現在の板・普段の波・最近の悩みから「次の1本」を失敗しにくく選べる日本向け診断サイト。

## Scope
対象: Short / Groveler / Hybrid / Fish / Twin / Midlength / Step-up
対象外: Longboard

## Diagnosis principles
- L数のみで判定しない。
- 現板との差分を重視する。
- 自己申告の「初級/中級/上級」だけに依存しない。
- テイクオフ成功率、入水頻度、現板の不満、普段の波、改善したいことを主要入力にする。
- メーカー未公表スペックを捏造しない。
- 診断理由はルールIDから生成する。
- 広告・アフィリエイト情報は診断順位に影響させない。

## MVP
必須入力は8項目前後。
ボードDBは30〜50モデルから開始し、モデルとサイズ別SKUを分離する。
まず既知quiver再現テストと人間レビューで診断ロジックを検証する。

## Design
- Target age: 45–60
- Pop + Modern + Adult-friendly
- Full-overlay Hero
- 背景動画はHeroのみ
- 本文セクションはHTML/CSSと静止画中心
- 小さなギミックを多く、重いJSは避ける
- 大きめの文字・タップ領域・高コントラスト
- prefers-reduced-motion対応

## Performance
- No loading splash
- Static First
- CSS-first motion
- Hero videoは短尺・muted・loop・playsinline
- Hero動画不在時も成立するfallback必須
- LCP 2.5s / INP 200ms / CLS 0.1を目標

## Production
Target URL: https://surfboard.rss7.net/
SSLはLolipop側で設定中のため、公開前にHTTPS到達確認を行う。
