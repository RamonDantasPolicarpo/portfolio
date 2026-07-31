# Brief do Portfólio — Ramon Dantas Policarpo

Guia pra gerar o site no Claude Code. Siga na ordem: **(1)** instale a skill, **(2)** rode o comando de setup, **(3)** cole o prompt de design.

---

## 1. Instalar a skill oficial de design (uma vez só)

No Claude Code, rode:

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/reload-plugins
```

> Se der "marketplace not found", rode `/plugin marketplace update claude-plugins-official` e tente o install de novo. Essa skill é oficial da Anthropic — ela já cuida de animação, então não precisa de nenhuma skill extra.

---

## 2. Montar o projeto

Cole isto:

```
Crie a estrutura de um site estático de portfólio nesta pasta, pronto para GitHub Pages:
- index.html, styles.css, script.js (JavaScript puro, sem framework, sem build)
- uma pasta /assets para imagens e vídeos
- inicialize um repositório git
- ao final, me diga o passo a passo exato pra publicar no GitHub Pages
Use a skill frontend-design. Ainda não escreva o conteúdo final — só a estrutura. Depois eu passo o design.
```

---

## 3. Prompt de design (o principal)

Cole isto no Claude Code:

```
Construa meu portfólio pessoal como UM site estático (HTML + CSS + JavaScript puro, sem
framework, sem build). Use a skill frontend-design. Preciso que seja fácil de manter e de
revisar por alguém que não domina front-end.

## Quem sou (conteúdo real, sem lorem ipsum)
Ramon Dantas Policarpo, 19 anos, Brasília. Desenvolvedor back-end com foco em Java e Spring
Boot. Cursando Engenharia de Software (UniCEUB). Construo APIs REST com JWT, regras de
negócio, testes (JUnit) e Docker. Atualmente desenvolvo um SaaS real de gestão de apólices
para uma corretora de seguros (multitenant, leitura de PDF com Apache PDFBox).

## Identidade visual (precisa combinar com meu currículo)
- Paleta ESTRITAMENTE preto e branco / tons de cinza. Sem cor de destaque, sem gradiente.
  ink #111111, texto secundário #333333 e #6b6b6b, hairline #e3e3e3, fundo #ffffff.
- Tipografia: 'Inter' para corpo e nome; 'JetBrains Mono' para rótulos, eyebrows de seção,
  datas e categorias (dá um ar de "ficha técnica" de engenheiro). Importe do Google Fonts.
- Estética: minimalista e precisa. Elegância vem do espaçamento e da tipografia, não de enfeite.

## Estrutura (uma página, nesta ordem)
1. HERO: meu nome grande (Inter 800), abaixo o cargo em mono maiúsculo espaçado
   ("DESENVOLVEDOR BACK-END · JAVA / SPRING BOOT").
2. SOBRE: 2–3 frases curtas, diretas.
3. TECNOLOGIAS: em TEXTO agrupado (não use um mar de logos coloridos). Ex.: "Back-end:
   Java, Spring Boot, JPA/Hibernate, JWT". Mesma pegada do currículo.
4. PROJETOS: cards. No hover, o card revela um preview do caso de uso. Ao clicar, abre a
   visão completa (um modal ou uma página) com: vídeo curto de demonstração + estudo de
   caso escrito em markdown (problema, decisões técnicas, resultado).
   - Projeto 1: SaaS de Gestão de Apólices (deixe VÍDEO e case como placeholder por enquanto).
   - Projeto 2: ByteShop API. Projeto 3: Ponto-Notes.
5. FOOTER: GitHub (github.com/RamonDantasPolicarpo), LinkedIn
   (linkedin.com/in/ramondantaspolicarpo), e-mail (ramonpolicarpo36@gmail.com).

NÃO inclua: seção de certificações, timeline de projetos, nem depoimentos. (Entram depois.)

## Animações — SUTIS, esta é a regra mais importante
- Ao rolar a página, o conteúdo aparece com um fade + subida de ~8–12px (~400ms), com um
  pequeno stagger. Só isso de scroll.
- Hover nos cards: micro-reação discreta (leve elevação e/ou mudança de borda). Nada chamativo.
- No meu NOME, no hover, quero um efeito "matrix" de embaralhar letras: as letras trocam por
  caracteres aleatórios e assentam no nome em no MÁXIMO 0,5s, e roda só uma vez por hover.
  Se ficar exagerado ou infantil, prefira não fazer.
- Respeite prefers-reduced-motion (desligue as animações se o usuário pediu).
- PROIBIDO: carrossel com autoplay, parallax, blobs/gradientes animados, brilho neon,
  qualquer efeito que dure mais de 0,6s ou que distraia da leitura. Menos é mais.

## Qualidade obrigatória
- Responsivo até mobile. Foco de teclado visível. HTML semântico. alt em imagens.
- CSS com variáveis. Código limpo e comentado, pra eu conseguir revisar e editar depois.
- Zero dependência de build. Tem que abrir o index.html e funcionar.

Antes de codar, me mostre em 3–4 linhas o plano de design (tokens + estrutura) pra eu aprovar.
Depois construa. No fim, aponte onde troco os placeholders de vídeo e case por conteúdo real.
```

---

## Lembretes pra você (o controle de qualidade é seu olho)

- **Peça o plano antes do código** (já está no prompt). Se fugir do seu Excalidraw ou parecer
  chamativo demais, rejeite e peça pra conter.
- **Vídeo e case do SaaS dependem do deploy.** Enquanto não subir o sistema, deixa placeholder.
  É o mesmo deploy que também destrava o currículo.
- **Coerência com o currículo** (mesmas fontes e preto-e-branco) passa muito mais profissionalismo
  que dois estilos diferentes.
- **Publicar:** depois de pronto, GitHub Pages hospeda de graça, no seu próprio GitHub — onde o
  recrutador já está olhando.
