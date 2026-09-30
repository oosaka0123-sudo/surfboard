# HANDOFF.md — Surfboard Finder
Updated: 2026-09-30

## 1. Project overview

Production:
- https://surfboard.rss7.net/

Repository:
- https://github.com/oosaka0123-sudo/surfboard

Purpose:
- 45〜60歳の週末サーファー向け
- 「何Lに乗ればいい？」だけで決めず、「今の自分なら次にどんな1本を選べば失敗しにくいか」を案内する
- Longboardは対象外
- メーカー一次情報で確認できたモデルだけを本番診断に使う
- 不明スペックは推測しない

Current production/main SHA:
- f001414b4a4a16235449705f2d6c08d9d08c4476

## 2. Current public pages

Core:
- / — main landing
- /diagnosis/ — board diagnosis
- /boards/ — verified board library
- /method/ — methodology / trust
- /privacy/ — privacy
- /advertising-policy/ — advertising policy

Category top pages:
- /shortboard/
- /retro-fish/
- /midlength/

All three category pages are live and return HTTP 200.

## 3. Current category flow

Diagnosis STEP 1 asks the user to choose a board family.

Choices:
1. コンペ用サーフボード
2. レトロフィッシュ
3. ミッドレングス
4. まだ分からない

Routing:
- competition -> /shortboard/
- retro-fish -> /retro-fish/
- midlength -> /midlength/
- unsure -> generic diagnosis continues

When a category page CTA returns to diagnosis:
- family is preserved in the URL
- diagnosis starts from STEP 2
- existing issue query is also preserved

Family hard filters:
- competition -> performance only
- retro-fish -> fish / twin only
- midlength -> midlength only
- unsure -> all verified active categories

The matcher must never silently fall back to another board family.

## 4. Diagnosis flow

5 steps:
1. Board family
2. Height / weight / sessions per month
3. Observable skill / takeoff success rate
4. Current board pain point
5. Usual wave size / primary goal

Height:
- required
- 130〜210 cm

Weight:
- required
- 35〜140 kg

Important:
- placeholders are examples only: 例：170 / 例：65
- out-of-range values cannot advance
- errors use aria-live
- invalid input receives focus

Current-board detailed dimensions were removed from the input form because they were not being used by the matcher.

Results show:
- selected board family
- height
- weight
- surf frequency
- fired matching reasons
- representative SKU
- manufacturer source URL
- warnings when needed

Do not calculate a recommended liter value directly from height/weight.

## 5. Matcher architecture

Flow:
[input]
-> state classification
-> hard gates
-> deterministic matching
-> fired-rule explanation

Key rules:
- earlyStage excludes twin and performance
- overhead excludes boards without manufacturer hold/projection evidence
- research models are excluded
- family selection is a hard filter
- ad/commerce fields must not affect recommendation ranking
- no invented explanation text; reasons come from fired rules

Primary UI:
- avoid fake precision like 94%
- show evidence count / reasons instead

## 6. Verified board database

Active verified models: 10

1. Lost Original Puddle Jumper '25
2. Channel Islands Rocket Wide
3. Haydenshapes Hypto Krypto
4. Channel Islands Twin Pin
5. Firewire Dominator 2.0
6. Firewire Mashup
7. Firewire Seaside
8. Firewire Seaside & Beyond
9. Channel Islands Happy Everyday
10. JS Industries Black Baron 2.1

Research only:
- Slater Designs Cymatic

Cymatic remains excluded because source volume data conflicts. Do not activate it until the canonical specification is independently resolved.

Source file:
- src/data/boards.ts

## 7. Category top pages

Shared component:
- src/components/CategoryLanding.astro

Pages:
- src/pages/shortboard.astro
- src/pages/retro-fish.astro
- src/pages/midlength.astro

Design direction:
- ocean motion hero
- large category-specific board silhouette
- yellow CTA
- three category feature cards
- verified model recommendations
- lower diagnosis CTA
- mobile-first

Important:
- use only verified DB models
- do not invent model names to fill cards
- if a category has fewer than 3 verified boards, explicitly show that the DB is still expanding

Current DB means some category pages intentionally have fewer than 3 cards.

## 8. Main visual direction

Target:
- 45〜60歳
- readable
- pop + modern
- adult-friendly
- visually fun but not tiring

Hero:
- top only uses background video
- video: public/media/hero-surf.mp4
- CSS/SVG fallback exists
- current hero uses retro-fish visual treatment

Board category silhouettes:
- SMALL WAVE
- HYBRID
- FISH / TWIN
- MIDLENGTH
- STEP-UP

They are category-specific SVG silhouettes, not the old generic CSS pill shape.

## 9. QA / CI

CI:
- .github/workflows/ci.yml

Visual mobile QA:
- .github/workflows/visual-mobile-qa.yml
- .github/scripts/visual-qa.mjs

Mobile QA viewport:
- 390 x 844

Checks include:
- horizontal overflow
- missing h1
- pageerror
- console error
- home issue -> diagnosis flow
- category top routing
- family + issue preservation
- range guard (e.g. 999cm cannot advance)
- diagnosis completion
- result cards
- family-filtered result categories
- duplicate route labels
- result overflow
- screenshots of primary pages

Current state:
- CI SUCCESS
- Visual Mobile QA SUCCESS

Do not merge UI/diagnosis changes until both pass.

## 10. Deployment

Production deployment is handled through the deployment bridge repository:

- oosaka0123-sudo/web-de-nandemo-dekiru

Workflow:
- .github/workflows/deploy-surfboard.yml

Deployment target:
- Lolipop /surfboard

The workflow:
1. checks out surfboard/main
2. installs dependencies
3. runs checks/build
4. uploads dist by FTPS
5. verifies production

Trigger:
```
gh workflow run deploy-surfboard.yml --repo oosaka0123-sudo/web-de-nandemo-dekiru --ref main
```

After deployment verify:
- workflow SUCCESS
- https://surfboard.rss7.net/deploy.json
- production SHA matches surfboard/main
- important pages return HTTP 200

## 11. Restore / Git rule

Before risky changes:
- create a branch / commit / restore point

Do not make large direct edits on main.

Normal workflow:
1. branch from latest main
2. edit
3. PR
4. CI + Visual Mobile QA
5. merge only after green
6. run production deploy
7. verify live production

## 12. Current known next improvements

Priority candidates:

### A. Expand verified DB
Especially:
- performance shortboards
- retro fish / twin
- midlength

Goal:
- at least 3 strong verified models per category without inventing data

### B. Full SKU coverage
Representative SKU is currently displayed.
Eventually add model -> size/SKU parent-child data so final sizing can be evaluated per SKU.

### C. Real product/category visual assets
Current category pages use lightweight SVG board visuals + surf video.
Future improvement can use real licensed/original board/product photography while keeping performance acceptable.

### D. Real-user validation
Collect observations from actual 45〜60-year-old surfers:
- where users hesitate
- whether category choice is understood
- completion rate
- whether result reasons make sense
- whether suggested board family matches expectations

Do not change matching weights only from intuition; use evidence.

## 13. Important product rules

- Do not reduce recommendation to liters alone.
- Age is supporting context, not a direct “older = more liters” rule.
- Prefer observable skill / takeoff success / surf frequency / current pain points.
- Do not use beginner/intermediate/advanced self-label as the primary skill input.
- Unknown manufacturer specs stay UNKNOWN.
- Separate FACT / CLASSIFIED / UNKNOWN.
- Source URLs and verified dates matter.
- Recommendation logic must remain explainable.
- Do not let commercial data influence diagnosis order.

## 14. Current completion status

MVP:
- public
- production deployed
- category-first flow implemented
- 3 category top pages implemented
- deterministic diagnosis implemented
- verified board library implemented
- CI + mobile visual QA implemented
- privacy / method / advertising-policy pages implemented

This is a publishable MVP.
Next phase is DB expansion and evidence-based tuning, not a ground-up redesign.
