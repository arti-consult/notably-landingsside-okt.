# Artikler på notably.no

Artiklene på `/artikler` ligger som filer i dette repoet. Det finnes ingen database og ingen
admin-side for artikler – en ny artikkel publiseres ved å legge til **én fil + bilder** i en
pull request. Når PR-en er merget og Vercel har bygget, ligger artikkelen ute.

```
content/artikler/<slug>.md          ← artikkelen (frontmatter + tekst)
public/artikler/<slug>/…            ← bilder for artikkelen (forsidebilde m.m.)
public/artikler/forfattere/…        ← forfatterbilder (gjenbrukes)
```

URL-en blir `https://notably.no/artikler/<slug>`, der `<slug>` er filnavnet uten `.md`.
Slug kan bare inneholde `a-z`, `0-9` og `-` (æ→ae, ø→o, å→a). **Endre aldri slug på en
publisert artikkel** – da brytes lenker og søkeresultater.

## Mal

```markdown
---
title: "Slik får du gode møtereferater med AI"           # H1 på siden (påkrevd)
seoTitle: "Gode møtereferater med AI – praktisk guide"   # <title>, maks ~60 tegn (valgfri, ellers title)
description: "Lær hvordan …"                            # meta description, 120–160 tegn (påkrevd)
excerpt: ""                                             # kort ingress i artikkellisten (valgfri, ellers description)
tldr: "Kort oppsummering i 2–3 setninger."              # blå TLDR-boks øverst (valgfri)
published: "2026-10-20T08:00:00+02:00"                  # publiseringstidspunkt (påkrevd)
updated: "2026-10-20T08:00:00+02:00"                    # sist endret (valgfri, ellers published)
author:
  name: "Jørgen Helmers-Olsen"
  image: "/artikler/forfattere/jorgen-helmers-olsen.png" # valgfri
category:
  name: "Verktøy"
  slug: "verktoy"
tags:
  - "møtereferat"
  - "AI"
image:
  src: "/artikler/slik-far-du-gode-moetereferater-med-ai/forsidebilde.webp"
  alt: "Beskrivende alt-tekst"
readingTime: 5            # valgfri – regnes ut automatisk (200 ord/min)
draft: false              # true = bygges ikke
faq:                      # valgfri – vises som «Ofte stilte spørsmål»
  - question: "Hva koster det?"
    answer: "…"
---

Brødteksten skrives i **Markdown**. Bruk `##` og `###` for mellomtitler – de blir
automatisk innholdsfortegnelse. Ikke bruk `#` (H1) i teksten; tittelen er H1.

Vanlig Markdown fungerer: lister, **fet**, *kursiv*, [lenker](https://notably.no),
tabeller og bilder: ![alt-tekst](/artikler/<slug>/figur-1.webp)
```

Feltet `format: html` betyr at teksten er ren HTML i stedet for Markdown (brukt for de tre
artiklene som ble flyttet fra den gamle Bolt-editoren). Nye artikler skal bruke Markdown.

### CTA-boks («Prøv Notably gratis»)

Lim inn denne HTML-blokken i Markdown-teksten der boksen skal stå (med tom linje før og etter):

```html
<div class="notably-inline-cta" data-notably-cta="true"><div class="notably-inline-cta__inner"><div class="notably-inline-cta__logo"><img class="notably-inline-cta__logo-image" src="/artikler/felles/notably-logo.png" alt="Notably logo" loading="lazy"></div><div class="notably-inline-cta__text"><h3 class="notably-inline-cta__title">Vil du slippe manuelle møtereferater?</h3><p class="notably-inline-cta__description">Notably transkriberer møter på 90+ språk, lager oppsummeringer og henter ut handlingspunkter automatisk.</p></div><div class="notably-inline-cta__actions"><a class="notably-inline-cta__button" href="https://app.notably.no/no/sign-up">Prøv Notably gratis</a></div></div></div>
```

## Bilder

- Legg bildene i `public/artikler/<slug>/` og referer til dem med `/artikler/<slug>/<fil>`.
- Bruk `.webp` (eller `.jpg`), maks ca. 1600 px bredt og helst under 300 kB.
  Eksempel: `cwebp -q 85 -resize 1600 0 original.png -o forsidebilde.webp`
- Forsidebildet brukes også som delingsbilde (Open Graph) – 1200×630 eller 16:9 fungerer best.

## Hva skjer ved bygg

`npm run build` (Vercel) gjør dette automatisk:

1. `scripts/generate-sitemap.mjs` legger alle publiserte artikler i `public/sitemap.xml`.
2. Vite bygger appen; artiklene leses fra filene via `scripts/vite-plugin-articles.mjs`.
3. `scripts/prerender-articles.mjs` skriver ferdig HTML for `/artikler` og hver artikkel med
   riktig `<title>`, meta description, canonical, Open Graph og JSON-LD (`Article`), slik at
   søkemotorer og AI-crawlere ser innholdet uten JavaScript.

Artikler med `draft: true` eller `published` fram i tid tas ikke med (de publiseres ved
neste bygg etter tidspunktet).

## Sjekk før PR

```bash
npm ci
npm run test:artikler   # validerer alle artikkelfiler, statisk HTML og sitemap
npm run build           # feiler hvis en artikkel mangler påkrevde felt eller bilde
npm run dev             # se artikkelen på http://localhost:5173/artikler/<slug>
```
