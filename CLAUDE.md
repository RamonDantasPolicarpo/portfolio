# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal portfolio site for Ramon Dantas Policarpo — a **single static page**, plain HTML + CSS + vanilla JS, no framework, no build step, no package manager. Target host is GitHub Pages.

The site is built. Three files carry everything: `index.html` (structure + all card-visible copy), `styles.css` (tokens first, then sections in the order the page renders), `script.js` (an IIFE of numbered, independent blocks). `brief-portfolio-claude-code.md` holds the original spec in Portuguese; it is historical context, not current truth — the design has moved past it in places (dark theme by default, hover previews replaced by always-visible summaries). All code comments and user-facing copy are in Portuguese.

**Case studies live in `script.js`, in the `CASOS` object — not in `.md` files.** They *are* markdown, rendered by a ~50-line converter in block 2 (handles `##`, `-`, `**bold**`, `` `code` ``, escapes HTML first). They are embedded rather than fetched because `fetch()` on a `file://` page is blocked by CORS, which would break the "double-click index.html and it works" requirement. Don't move them to separate files without raising that tradeoff.

## Commands

There is no build, lint or test tooling. To view the site, open `index.html` directly in a browser, or serve the folder:

```
python -m http.server 8000
```

If you add tooling, the "zero build dependency" constraint below has to be reconsidered with the user first.

## Constraints from the brief (non-negotiable unless the user says otherwise)

- **No framework, no build.** Opening `index.html` from the filesystem must work.
- **Greyscale, plus one accent used sparingly.** No gradients. The original brief banned accent colour entirely; the user overrode that deliberately in July 2026. `--accent` (`#818cf8` dark / `#4f46e5` light) is allowed in **exactly three places, and nowhere else**: the hero pipeline stage at the instant it lights (plus the `200 OK` pulse), the card arrows on hover/focus only, and the theme-toggle dot. The whole point is scarcity — if a fourth use appears, remove one. Palcos stay strictly greyscale.
- **Dark is the default theme** (bg `#0f0f0f`, ink `#f2f2f2`, `#c2c2c2`/`#8a8a8a` secondary, hairline `#2b2b2b`); light is the inverse (`#ffffff`/`#111111`/`#333333`/`#6b6b6b`/`#e3e3e3`). Every color lives in the token block at the top of `styles.css` — no hex anywhere else in the file. **There is no `@media (prefers-color-scheme)` rule**: an inline script in `<head>` reads the system preference once and writes `data-tema` on `<html>`, so the toggle button can override the system without a specificity fight and each palette lives in one place. That script must stay in `<head>` — moved to `script.js` it would run after first paint and the page would flash the wrong theme. It also adds the `.js` class that gates `.revelar`, without which the page renders blank for anyone without JavaScript.
- **Type:** Inter for body/name, JetBrains Mono for labels, section eyebrows, dates and categories. Loaded from Google Fonts.
- **Motion is the signature, but it must serve the content.** Scroll reveal = fade + 10px rise, 420ms, 55ms stagger. Name hover = one-shot letter-scramble settling in 450ms. Hero has an infinite `GET /request → Controller → Service → Repository → DB → 200 OK` pipeline whose stages light in sequence (6s cycle, 260ms apart, paused off-screen); the accent travels with the wave rather than colouring the whole line. Each project card holds a themed "palco" micro-animation (PDF scan / terminal / task list / waste classification) that plays on hover, focus, or — on touch — first scroll into view. Honor `prefers-reduced-motion`. Explicitly banned: autoplay carousels, parallax, animated blobs/gradients, neon glow, floating particles, any single effect over 600ms.
- **Palco rule (important):** a palco's *resting* CSS is the animation's final frame; the `animation` property exists only under `.projeto.is-ativo`. Adding the class starts a fresh animation from frame zero, removing it drops the animation and the drawing snaps back to rest. This is why there are no timers and no reset hacks in `script.js`, and why reduced-motion needs no per-element overrides — don't refactor it into JS-driven keyframes.
- **Page order:** Hero → Sobre → Tecnologias (grouped as text, not a logo wall) → Projetos → Contato. Every section is a two-column grid: mono label in the left gutter, content right. Do **not** add certifications, project timeline or testimonials.
- **Card anatomy:** topo (category + period) · título · resumo (always visible — the old hover-reveal preview was removed so it wouldn't compete with the palco) · palco · ação. Clicking opens the case-study `<dialog>`.
- Content is real, in Portuguese — no lorem ipsum. The SaaS de Gestão de Apólices project keeps video/case-study placeholders until its deploy exists; ByteShop API and Ponto-Notes are the other two projects.
- Code is meant to be reviewed and edited by someone who is not a front-end specialist: comment it, keep it flat and readable.
- Semantic HTML, visible keyboard focus, `alt` on images, responsive down to mobile.

## Gotchas

- The stylesheet is `styles.css` (plural). An older empty `style.css` was removed — don't recreate it.
- `assets/img` and `assets/video` each hold a one-line `README.md` only so git tracks the folder. An `assets/cases/` folder existed briefly and was deleted — case text is in `script.js`; don't recreate it.
- Unfinished content is marked `[PREENCHER]`. `grep -rn "PREENCHER" .` lists it — 3 spots left, all "what would you do differently today" reflections only the user can write.
- Case-study content was written from the actual repos, not from memory: `github.com/RamonDantasPolicarpo/{byteshop-api,ponto-notes-api,eco-descart}` and the sibling checkout at `../crm` (project name **Apoli**, package `br.com.apoli.crm`). Card periods come from the GitHub API `created_at`/`pushed_at`. **`../crm`'s README is behind its own code** — it lists "importação completa" and the vigências dashboard as roadmap, but `ImportacaoController` and `ApoliceVencimentoFlowTest` both exist. Read the source, not the README, before restating anything about that project.
- `.term__requisicao` in the ByteShop palco hardcodes the character count twice: `width: 16ch` and `steps(16)`. Changing the command text means changing both.
- `assets/favicon.svg` is the source of truth for the icon; `assets/favicon-32.png`, `assets/apple-touch-icon.png`, `assets/og-image.png` and root `favicon.ico` were rendered from it (and from the hero layout) by a one-off Pillow script. Change the SVG and the rest go stale — regenerate rather than hand-editing them.
- **`favicon.ico` is the one icon that must stay at the repo root**, and it has no `<link>` on purpose: browsers and non-HTML-parsing bots probe `/favicon.ico` by convention. Everything else is found only through its `<link>`/`<meta>`, so it lives in `assets/`.
- **The Open Graph URLs in `<head>` are absolute and still point at a repo that does not exist yet.** Three lines are tagged `[URL]`; they must all change when the GitHub repo is named. Relative paths do not work for link previews.
- Directory name is `portifolio` (typo pre-existing). The local folder name does not affect the published URL — only the GitHub repo name does, and that is still undecided.
- Default branch here is `master`, while PRs generally target `main`.

## Adding or changing a project

Invoke the **`novo-projeto`** skill (`.claude/skills/novo-projeto/SKILL.md`). It carries the four-file checklist, the palco invariants, the timing budget, the catalogue of palco ideas already used, and the bugs this project has already hit. Don't improvise a card from scratch.

## Workflow expectation

The user wants a short design plan (tokens, structure, timing) approved **before** any visual change gets written. He reviews the result himself in the browser, so state plainly what you could not verify.
