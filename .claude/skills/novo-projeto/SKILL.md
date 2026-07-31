---
name: novo-projeto
description: Adiciona um card de projeto ao portfólio, com palco animado próprio e estudo de caso. Use sempre que for incluir, remover ou reescrever um projeto na seção Projetos — garante que os quatro pontos de edição fiquem em sincronia e que o palco novo siga as invariantes de animação do site.
---

# Adicionar um projeto ao portfólio

Um projeto vive em **quatro lugares**. Esquecer um deles é o erro mais comum:

| # | Arquivo | O que entra |
|---|---------|-------------|
| 1 | `index.html` | o `<li>` com o card e o palco |
| 2 | `styles.css` | o bloco de CSS do palco novo |
| 3 | `script.js` | a entrada em `CASOS` (estudo de caso) |
| 4 | `styles.css` | o número de colunas de `.projetos`, se a contagem de cards mudou |

A chave em `CASOS` **tem que ser idêntica** ao `data-projeto` do botão. Sem isso o card abre um modal vazio, silenciosamente.

---

## Passo 0 — Ler o repositório de verdade

Não escreva conteúdo de memória nem a partir do README. **O README do Apoli (`../crm`) estava atrás do próprio código** — listava features como roadmap que já estavam implementadas e testadas.

- Repositório local: leia `src/`, conte classes de teste, olhe os nomes dos métodos `@Test` (eles descrevem o comportamento melhor que qualquer prosa) e confira o `pom.xml`.
- Repositório remoto: `WebFetch` na página do GitHub, e `curl -s https://api.github.com/repos/<user>/<repo>` para `created_at` / `pushed_at` — é daí que sai o período do card, não de chute.

O que não estiver evidenciado no código vira `[PREENCHER]` com uma instrução do que escrever. **Nunca invente resultado, métrica, domínio ou conquista.** Um `[PREENCHER]` honesto é melhor que uma frase bonita e falsa — o dono do portfólio vai ser entrevistado em cima disso.

---

## Passo 1 — Desenhar o palco

O palco é uma micro-animação temática, em mono e escala de cinza, que torna visível o que o projeto faz. É o coração do card.

### A invariante que segura tudo

> **O estado parado do palco é o quadro final da animação.**
> A propriedade `animation` existe **apenas** dentro de `.projeto.is-ativo`.

Consequências, todas de graça:
- Pôr a classe → a animação nasce no quadro zero e se monta.
- Tirar a classe → a animação some e o desenho volta sozinho ao lugar. Sem timer, sem truque de reflow, sem estado.
- `prefers-reduced-motion` desliga as animações e o desenho continua completo na tela — **não escreva override por elemento**.

Se você se pegar escrevendo `setTimeout`, `animationend` ou um reset manual, parou de seguir a invariante. Volte.

### Palcos já usados — não repita a ideia

| Projeto | Palco | Vocabulário |
|---------|-------|-------------|
| Apoli | página de PDF varrida por uma barra, campos saltando, tenant acendendo | varredura descendo, chips entrando pela esquerda, ponto acendendo |
| ByteShop | terminal: requisição datilografada, JSON caindo linha a linha | digitação com `steps()`, cursor piscando, linhas subindo |
| Ponto-Notes | três camadas da stack acendendo na descida e na subida | pulso em sequência, ida e volta |
| EcoDescart | texto classificado, três categorias, a escolhida acende | digitação, chips, eleição de um item |

### Primitivas para combinar

Prefira recombinar estas a inventar linguagem nova — é o que mantém os cards parecendo do mesmo site:

- **Varredura** — barra de 1px animando `top: 0 → 100%` (porcentagem, nunca `rem` fixo: sobrevive a mudar o número de linhas).
- **Digitação** — `width: 0 → Nch` com `steps(N)`. Em mono, 1 passo = 1 caractere.
- **Entrada escalonada** — `opacity` + `translateX/Y` de 3–6px, com `animation-delay: calc(var(--i) * ~120ms)`.
- **Pulso** — keyframe `0% neutro → 45% aceso → 100% neutro` na cor ou na borda. Serve para "algo passou por aqui".
- **Linha atravessando** — `width: 0 → 100%` (`text-decoration` não anima).
- **Acender** — mudança de `border-color` e `color` para o tom mais claro.

### Orçamento de tempo

- Nenhum passo isolado passa de **600ms**.
- A história completa do palco fecha entre **1,2s e 1,5s**. Mais que isso cansa; menos não dá tempo de ler.
- Escalonamento entre irmãos: **120–180ms**.
- Curvas: `var(--curva-entrada)` para coisas que chegam, `var(--curva-micro)` para hover e cor. **Nunca `linear` nem `ease`.**

### Proibido

Partícula flutuante, blob, gradiente animado, brilho neon, parallax, carrossel, qualquer cor fora da escala de cinza. É clichê de site gerado por IA — o site inteiro foi construído para não parecer isso.

---

## Passo 2 — O card no `index.html`

Cole dentro de `<ul class="projetos">`, mantendo a indentação de 4 espaços do arquivo:

```html
<!-- ---------- Projeto N: NOME ---------- -->
<li class="revelar">
    <button class="projeto" type="button" data-projeto="CHAVE">
        <span class="projeto__topo">
            <span class="projeto__categoria">Categoria · Subcategoria</span>
            <span class="projeto__periodo">2026</span>
        </span>

        <span class="projeto__titulo">Nome do Projeto</span>

        <span class="projeto__resumo">
            Duas linhas. O problema que resolve, não a lista de tecnologias.
        </span>

        <!-- Palco: descreva em uma linha o que a animação mostra. -->
        <span class="palco palco--CHAVE" aria-hidden="true">
            <!-- os elementos do desenho, com style="--i: 0", "--i: 1", ... -->
        </span>

        <span class="projeto__acao">Ver estudo de caso</span>
    </button>
</li>
```

Regras do card:
- É um `<button>`, então só pode conter **conteúdo de frase** — `<span>`, nunca `<h3>` nem `<div>`.
- O palco leva `aria-hidden="true"`: é decorativo, e leitor de tela receberia fragmento sem contexto.
- O `.projeto__resumo` fala do **problema**. Lista de tecnologia é o trabalho do estudo de caso.
- O índice `--i` vai em `style` inline. É o único lugar do projeto onde estilo inline é aceito, porque é dado, não estilo.

---

## Passo 3 — O CSS do palco

Vá até a seção numerada dos palcos no `styles.css` (bloco 9 em diante), acrescente o seu depois do último e **atualize o índice no topo do arquivo**.

```css
/* ------------------------------------------------------------------ *
   11-C. PALCO 5 — NOME DA IDEIA
   Uma ou duas linhas explicando o que a animação conta.
 * ------------------------------------------------------------------ */
.palco--CHAVE { gap: 0.3rem; }

/* Estado PARADO = quadro final. Tudo visível no lugar certo. */
.meu-elemento {
  border: 1px solid var(--cor-linha);
  color: var(--cor-texto-4);
}

/* A animação só existe aqui dentro. */
.projeto.is-ativo .meu-elemento {
  animation: meu-elemento-entrar 240ms var(--curva-entrada) both;
  animation-delay: calc(var(--i) * 130ms);
}

@keyframes meu-elemento-entrar {
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Vocabulário permitido — **nada de valor cru**:

- Cor: `--cor-fundo`, `--cor-fundo-2`, `--cor-tinta`, `--cor-texto-2`, `--cor-texto-3`, `--cor-texto-4`, `--cor-linha`. Nenhum hex fora do bloco de tokens. É o que faz o tema claro funcionar sem tocar em regra de componente.
- **`--accent` é proibido dentro do palco.** O acento violeta tem três aparições na página inteira (pipeline do hero, setas do card no hover, ponto do botão de tema) e a graça é essa escassez. Palco é cinza.
- Texto do palco: `--passo-micro`, família `--fonte-mono` (já herdadas de `.palco`).
- Curvas e espaços: `--curva-entrada`, `--curva-micro`, `--espaco-*`.
- `border-radius: 0` em tudo.

Reaproveite `@keyframes` que já existem quando servirem — `campo-entrar`, `term-linha`, `term-cursor` e `ponto-acender` já são usados por mais de um palco.

---

## Passo 4 — O estudo de caso no `script.js`

No objeto `CASOS`, no topo do arquivo:

```js
'CHAVE': {
    categoria: 'Categoria · Subcategoria',   // igual à do card
    titulo: 'Nome do Projeto',               // igual ao do card
    video: null,                             // 'assets/video/CHAVE.mp4' quando existir
    texto: [
        '## Problema',
        'Uma frase sobre a dor real. Se é projeto de estudo, diga isso — soa melhor',
        'que fingir cliente.',
        '',
        '## Decisões técnicas',
        '- **A escolha** e o motivo dela. O motivo é a parte que importa.',
        '- Prefira a decisão contra-intuitiva: `404 em vez de 403`, validação no fechamento e não na montagem.',
        '',
        '## Testes',
        'O que a suíte prova, não quantos testes tem.',
        '',
        '## Resultado',
        '[PREENCHER] O que só o Ramon sabe responder.'
    ].join('\n')
},
```

Cuidados do formato:
- Markdown reconhecido: `## título`, `- item`, `**negrito**`, `` `código` ``. Linha em branco separa parágrafo. Mais nada — o conversor é de ~50 linhas, no bloco 2.
- Apóstrofo dentro da string precisa de escape, ou troque as aspas daquela linha por duplas.
- O caso mora aqui e **não** em arquivo `.md`: `fetch()` numa página `file://` é bloqueado por CORS, e quebraria o requisito de abrir o `index.html` com dois cliques.

Bom estudo de caso fala de **decisão e porquê**, não de lista de tecnologia. O trecho mais forte do portfólio hoje é "13 testes que tentam ativamente vazar dado entre tenants" — porque é uma afirmação verificável, não um adjetivo.

---

## Passo 5 — Ajustar a grade

`.projetos` em `styles.css`. A regra é não deixar card órfão:

| Cards | `grid-template-columns` |
|-------|--------------------------|
| 2 | `repeat(2, 1fr)` |
| 3 | `repeat(3, 1fr)` |
| 4 | `repeat(2, 1fr)` — 2×2 |
| 5, 6 | `repeat(3, 1fr)` |

Abaixo de `58rem` já cai para 1 coluna; não mexa nisso.

---

## Passo 6 — Verificar

```bash
node --check script.js
grep -o 'data-projeto="[a-z-]*"' index.html   # tem que bater 1:1 com...
grep -oE "^        '[a-z-]+':" script.js      # ...as chaves de CASOS
grep -rn "PREENCHER" .                        # o que ficou pendente
```

Depois, no navegador (`python -m http.server 8123` e **Ctrl+Shift+R** para furar o cache do CSS), confira à mão:

1. O palco parado já faz sentido, sem ninguém passar o mouse.
2. Hover monta a animação; tirar o mouse volta ao estado parado **sem piscada**.
3. Tab chega no card e a animação roda no foco.
4. Card clicado abre o modal com o caso certo.
5. Em 1 coluna (janela estreita) o palco não estoura nem corta.

Se removeu um palco, **apague o CSS dele**. Já sobrou `.tarefa*` órfão uma vez.

---

## Erros que já aconteceram neste projeto

- Contagem de caracteres da digitação vive em **dois lugares**: `width: Nch` e `steps(N)`. Mudou o texto, mude os dois.
- `:last-of-type` num palco seleciona por *tag*, não por classe. Com vários `<span>` irmãos ele mira o elemento errado e a regra morre calada. Use `:nth-child()` contando todos os filhos.
- Barra de varredura com `translateY` em `rem` fixo descasa quando o desenho muda de altura. Use `top` em porcentagem.
- Palco temático inventado a partir do nome do projeto: o palco de lista de tarefas do Ponto-Notes foi chute sobre o domínio e teve que ser jogado fora. Se o repositório não diz o que o sistema faz, escolha um palco sobre a **arquitetura** (que o README sempre revela) e não sobre o domínio.
