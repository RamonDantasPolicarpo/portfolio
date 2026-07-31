# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal portfolio site for Ramon Dantas Policarpo — a **single static page**, plain HTML + CSS + vanilla JS, no framework, no build step, no package manager. Target host is GitHub Pages.

As of now the repo is only scaffolding: `index.html` is the empty VS Code boilerplate and `style.css` / `script.js` are zero bytes. The actual spec for what to build lives in `brief-portfolio-claude-code.md` (written in Portuguese) — **read it before writing any site code**; it is the source of truth for content, palette, sections and animation rules.

## Commands

There is no build, lint or test tooling. To view the site, open `index.html` directly in a browser, or serve the folder:

```
python -m http.server 8000
```

If you add tooling, the "zero build dependency" constraint below has to be reconsidered with the user first.

## Constraints from the brief (non-negotiable unless the user says otherwise)

- **No framework, no build.** Opening `index.html` from the filesystem must work.
- **Strictly black/white/grey.** No accent color, no gradients. Tokens: ink `#111111`, secondary text `#333333` and `#6b6b6b`, hairline `#e3e3e3`, background `#ffffff`. Define these as CSS custom properties.
- **Type:** Inter for body/name, JetBrains Mono for labels, section eyebrows, dates and categories. Loaded from Google Fonts.
- **Animations must be subtle.** Scroll reveal = fade + 8–12px rise, ~400ms, small stagger — nothing else on scroll. Card hover = slight elevation/border change. Name hover = one-shot "matrix" letter-scramble settling within 0.5s. Honor `prefers-reduced-motion`. Explicitly banned: autoplay carousels, parallax, animated blobs/gradients, neon glow, anything over 0.6s.
- **Page order:** Hero → Sobre → Tecnologias (grouped as text, not a logo wall) → Projetos (cards; hover reveals a use-case preview, click opens full case study with demo video + markdown write-up) → Footer. Do **not** add certifications, project timeline or testimonials.
- Content is real, in Portuguese — no lorem ipsum. The SaaS de Gestão de Apólices project keeps video/case-study placeholders until its deploy exists; ByteShop API and Ponto-Notes are the other two projects.
- Code is meant to be reviewed and edited by someone who is not a front-end specialist: comment it, keep it flat and readable.
- Semantic HTML, visible keyboard focus, `alt` on images, responsive down to mobile.

## Gotchas

- The brief names the stylesheet `styles.css`; the file actually in the repo is `style.css`. Pick one and make `index.html` match — don't leave both.
- Directory name is `portifolio` (typo intentional/pre-existing); don't "fix" it, the GitHub Pages URL depends on it.
- Default branch here is `master`, while PRs generally target `main`.

## Workflow expectation

The brief asks for a 3–4 line design plan (tokens + structure) to be approved **before** any site code is written. Follow that when starting the build from scratch.
