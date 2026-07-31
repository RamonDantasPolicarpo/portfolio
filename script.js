/* =========================================================================
   Portfólio — Ramon Dantas Policarpo
   JavaScript puro, sem dependência e sem build. Carregado no fim do <body>.

   Blocos, nesta ordem:
     1. CASOS ......... o conteúdo dos estudos de caso (é aqui que você edita)
     2. Markdown ...... converte o texto dos casos em HTML
     3. Modal ......... abre e fecha o estudo de caso
     4. Revelar ....... fade + subida ao rolar a página
     5. Palcos ........ liga a micro-animação de cada card de projeto
     6. Pipeline ...... para a animação do hero quando ela sai da tela
     6-B. Tema ........ o clique do alternador (a ESCOLHA é feita no <head>)
     7. Embaralhar .... efeito no nome, no hover
     8. Início

   Cada bloco é independente: dá para comentar um sem quebrar os outros.

   Sobre os palcos e a pipeline: a animação inteira está no CSS. O que o
   JavaScript faz é só pôr e tirar uma classe — não existe temporizador
   nenhum aqui para dessincronizar.
   ========================================================================= */

(function () {
    'use strict';

    /** O usuário pediu menos movimento no sistema operacional? */
    var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ================================================================== *
       1. CASOS — CONTEÚDO DOS ESTUDOS DE CASO
  
       Uma entrada por projeto. A chave (ex.: 'saas-apolices') tem que ser
       igual ao data-projeto do card lá no index.html.
  
       - video: caminho do arquivo, ou null para mostrar "vídeo em breve".
       - texto: markdown simples. O que funciona aqui:
           ## Título de bloco
           - item de lista
           **negrito**   `código`
         Linha em branco separa parágrafos.
     * ================================================================== */
    var CASOS = {

        'saas-apolices': {
            categoria: 'SaaS · Multitenant',
            titulo: 'Apoli',
            repo: null, // repositório privado
            video: null, // TROQUE POR: 'assets/video/apoli.mp4'
            texto: [
                '## Problema',
                'Minha tia é corretora de seguros, e a rotina dela perdia dinheiro de três formas',
                'silenciosas: contrato vencendo sem ninguém perceber, hora gasta digitando dado que',
                'já existe no PDF da proposta, e histórico do cliente espalhado entre planilha,',
                'e-mail e pasta de arquivo.',
                '',
                'Comecei resolvendo o problema dela. Ao ver que a mesma dor não é exclusiva de uma',
                'corretora, construí **multi-tenant desde o primeiro dia** em vez de fazer um sistema',
                'de usuário único e ter que reescrever depois — decisão de arquitetura que só é barata',
                'no começo.',
                '',
                '## Isolamento entre corretoras, em três camadas',
                'Multi-tenancy não é uma coluna `corretora_id` no `WHERE` e torcer para não esquecer:',
                '- **Filtro HTTP** — só `login`, `register` e `refresh` são públicos; todo o resto exige autenticação.',
                '- **Method security** — `@PreAuthorize` por role (`ADMIN` / `CORRETOR`) nos endpoints administrativos.',
                '- **Camada de dados** — o id da corretora viaja **assinado dentro do JWT** e nunca vem do cliente. Toda consulta o exige (`findByIdAndCorretoraId`), então um registro de outra corretora responde **404, não 403**: nem a existência do dado vaza.',
                '',
                '## Extração de PDF por posição, não por regex',
                'Regex sobre texto corrido quebra no primeiro layout diferente. Aqui um `PDFTextStripper`',
                'estendido coleta **a coordenada de cada palavra na página**, e os valores são achados',
                'pela posição relativa ao rótulo. Determinístico, sem OCR e sem IA — com uma Strategy',
                'por seguradora (Bradesco e Allianz) e suíte de testes própria.',
                '',
                '## Sessão que resiste a token vazado',
                'Access token de 15 minutos e refresh de 7 dias, guardado **com hash** no banco e',
                '**rotacionado a cada uso**: o refresh antigo morre ao ser trocado. Logout revoga todos',
                'os tokens do usuário — a revogação é real, não cosmética.',
                '',
                '## Testes',
                '20 classes de teste. Os fluxos de integração sobem um **PostgreSQL real via Testcontainers**,',
                'não um banco em memória que mente sobre o dialeto. O `MultiTenantIsolationTest` sozinho tem',
                '13 casos que **tentam ativamente vazar** dado de um tenant para o outro — listagem, filtro,',
                'busca por id, update e inativação. O isolamento é uma afirmação testada, não um comentário.',
                '',
                '## Estado',
                'O MVP está indo para produção agora, para a corretora começar a usar de verdade',
                'enquanto eu fecho as features que faltam. Ainda não tenho número de impacto para',
                'mostrar — vou ter quando o uso real gerar o primeiro ciclo de feedback.',
                '',
                '**Pronto:** autenticação, onboarding com aprovação de vínculo, CRUD multi-tenant de clientes,',
                'veículos e apólices, motor de PDF, importação completa (PDF alimentando cliente + veículo +',
                'apólice) e painel de vigências a vencer.',
                '',
                '**A seguir:** parcelas e comissões, convite por e-mail e front-end em Vue.js.'
            ].join('\n')
        },

        'byteshop': {
            categoria: 'API REST · E-commerce',
            titulo: 'ByteShop API',
            repo: 'https://github.com/RamonDantasPolicarpo/byteshop-api',
            video: null, // TROQUE POR: 'assets/video/byteshop.mp4'
            texto: [
                '## Problema',
                'Trabalho de faculdade com um enunciado claro: exercitar orientação a objetos. Escolhi',
                'um e-commerce porque é um domínio pequeno o bastante para caber no prazo e grande o',
                'bastante para ter regra de negócio de verdade, em vez de CRUD puro.',
                '',
                '## Decisões técnicas',
                '- Quatro módulos: **clientes**, **produtos** (com paginação), **pedidos** e as regras que ligam os três.',
                '- As regras moram no domínio, não no controller: cliente com pedido ativo não é apagado, e produto sem estoque não fecha pedido.',
                '- A validação de estoque acontece **no fechamento do pedido**, não na montagem — é lá que o estoque precisa estar reservado de fato.',
                '- **Java 21 + Spring Boot 3.5.7** sobre **PostgreSQL 15**, com JPA/Hibernate.',
                '- **Swagger** (Springdoc) para a API ser testável sem Postman, e **Docker Compose** subindo banco e aplicação juntos, com carga inicial via `init.sql`.',
                '',
                '## Resultado',
                'Clona, roda um comando e a API sobe documentada e navegável no Swagger UI.',
                '',
                '## O que eu faria diferente hoje',
                'Três coisas, e todas apareceram depois que eu trabalhei em projeto maior:',
                '- **Spring Security desde o começo.** A API hoje não autentica ninguém — qualquer um fecha pedido em nome de qualquer cliente. Num exercício de OO isso não foi cobrado, mas é a primeira coisa que eu adicionaria.',
                '- **Roles por tipo de usuário.** Cliente e administrador têm poderes muito diferentes sobre pedido e estoque, e o código trata os dois como a mesma coisa.',
                '- **Lombok.** Muita classe do projeto é getter, setter e construtor escritos à mão. Aprendi isso no projeto seguinte e a diferença no que sobra para ler é grande.'
            ].join('\n')
        },

        'ponto-notes': {
            categoria: 'To-do · Primeiro projeto',
            titulo: 'Ponto-Notes',
            repo: 'https://github.com/RamonDantasPolicarpo/ponto-notes-api',
            video: null, // TROQUE POR: 'assets/video/ponto-notes.mp4'
            texto: [
                '## Problema',
                'Esse não resolve a dor de um cliente, resolve a minha. É uma lista de tarefas —',
                'domínio simples de propósito, porque o objetivo não era o domínio. Foi o primeiro',
                'projeto em que percorri o ciclo inteiro, e eu queria um escopo pequeno o bastante',
                'para que a dificuldade fosse entender a stack, não entender o negócio.',
                '',
                '## Decisões técnicas',
                '- Três camadas explícitas: **PostgreSQL**, uma **API REST em Spring Boot** e um front estático em HTML, CSS e JavaScript servido pela própria aplicação.',
                '- **Java 21 com Spring Boot 4.0.1**, Spring Data JPA e **Lombok** — foi aqui que usei Lombok pela primeira vez, e a diferença na quantidade de código repetido foi o que me convenceu.',
                '- **Docker Compose** sobe o Postgres, compila a aplicação e inicializa o schema por script SQL: clonar e rodar com um comando.',
                '- **Swagger** para documentação interativa, o que também me deixou testar a API antes de existir front.',
                '',
                '## O que eu tirei daqui',
                'Antes disso eu enxergava back-end como uma coisa só. Foi neste projeto que entendi',
                'o que cada camada realmente faz, e principalmente **como uma API é consumida do outro',
                'lado** — escrever o JavaScript que chama o endpoint que eu mesmo tinha escrito mudou',
                'a forma como eu penso o contrato da API até hoje.',
                '',
                '## Honestidade sobre o estado',
                'Este projeto **não tem testes automatizados**. É um projeto de aprendizado de 2026 e',
                'está aqui pelo que ensinou, não como vitrine de qualidade — quem quiser ver o meu',
                'trabalho com testes deve olhar o Apoli.'
            ].join('\n')
        },

        'eco-descart': {
            categoria: 'CLI · Spring AI',
            titulo: 'EcoDescart',
            repo: 'https://github.com/RamonDantasPolicarpo/eco-descart',
            video: null, // TROQUE POR: 'assets/video/eco-descart.mp4'
            texto: [
                '## Problema',
                'Descarte errado é problema ambiental e de saúde pública, e quem quer acertar',
                'geralmente trava na mesma pergunta: em que categoria esse item se encaixa? O público',
                'que eu tinha em mente é o cidadão comum e o pequeno empreendedor — quem não vai',
                'ler uma cartilha de resíduos para jogar fora uma pilha.',
                '',
                '## Decisões técnicas',
                '- **Spring AI com Gemini 2.5 Flash** interpreta a descrição em linguagem natural e classifica em orgânico, reciclável ou resíduo especial.',
                '- Além da categoria, o assistente gera **instruções de embalagem** — o objetivo é não ferir quem faz a coleta, que é a parte que ninguém pensa.',
                '- **ViaCEP** localiza o ponto de coleta a partir do CEP.',
                '- A chave da API é pedida no próprio terminal, então rodar não exige configurar variável de ambiente antes.',
                '',
                '## Testes',
                '**JUnit 5 e Mockito** com a resposta da IA mockada: a suíte roda sem chamar o Gemini',
                'e sem depender de rede. Testar integração com LLM de verdade seria lento, caro e não',
                'determinístico — o que precisa de teste é o meu código em volta da resposta, não o modelo.',
                '',
                '## O prompt foi a parte difícil',
                'Integrar o LLM foi mais simples do que eu esperava — o Spring AI resolve a chamada',
                'e a serialização, e o Google AI Studio deixa testar antes de escrever código. O que',
                'me custou tempo foi **construir um prompt que devolvesse sempre o formato que o',
                'código precisava consumir**. Uma resposta bem escrita mas fora do formato quebra a',
                'aplicação igual a uma resposta errada, e essa foi a lição que eu não esperava levar.',
                '',
                '## Resultado',
                'Distribuído de três formas — executável, código-fonte e Docker — com pipeline no',
                'GitHub Actions e Checkstyle rodando no CI. É o projeto que me deu mais satisfação',
                'de ver rodando: a distância entre "descrevi meu lixo em português" e "recebi a',
                'classificação e como embalar" é curta o suficiente para parecer mágica, e eu sei',
                'exatamente onde está cada peça.'
            ].join('\n')
        }

    };


    /* ================================================================== *
       2. MARKDOWN
       Conversor mínimo, só com o que os casos usam. Tudo é escapado antes
       de virar HTML.
     * ================================================================== */

    /** Neutraliza qualquer HTML vindo do texto. */
    function escapar(texto) {
        return texto
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /** Aplica os trechos que valem dentro de uma linha: **negrito** e `código`. */
    function formatarLinha(linha) {
        return escapar(linha)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.+?)`/g, '<code>$1</code>');
    }

    /** Markdown -> HTML. Reconhece "## título", "- item" e parágrafos. */
    function paraHTML(markdown) {
        var html = '';
        var paragrafo = [];   // linhas acumuladas do parágrafo em construção
        var emLista = false;

        function fecharParagrafo() {
            if (!paragrafo.length) return;
            html += '<p>' + formatarLinha(paragrafo.join(' ')) + '</p>';
            paragrafo = [];
        }

        function fecharLista() {
            if (!emLista) return;
            html += '</ul>';
            emLista = false;
        }

        markdown.split('\n').forEach(function (linha) {
            var conteudo = linha.trim();

            // Linha em branco: encerra o que estiver aberto.
            if (conteudo === '') {
                fecharParagrafo();
                fecharLista();
                return;
            }

            // Título de bloco.
            if (conteudo.indexOf('## ') === 0) {
                fecharParagrafo();
                fecharLista();
                html += '<h3>' + formatarLinha(conteudo.slice(3)) + '</h3>';
                return;
            }

            // Item de lista.
            if (conteudo.indexOf('- ') === 0) {
                fecharParagrafo();
                if (!emLista) { html += '<ul>'; emLista = true; }
                html += '<li>' + formatarLinha(conteudo.slice(2)) + '</li>';
                return;
            }

            // Texto comum: junta no parágrafo atual.
            fecharLista();
            paragrafo.push(conteudo);
        });

        fecharParagrafo();
        fecharLista();
        return html;
    }


    /* ================================================================== *
       3. MODAL DO ESTUDO DE CASO
       Usa o <dialog> nativo: ele já prende o foco, fecha no Esc e devolve
       o foco para o card que abriu.
     * ================================================================== */
    function iniciarModal() {
        var modal = document.getElementById('caso');
        var cards = document.querySelectorAll('[data-projeto]');
        if (!modal || !cards.length) return;

        // Navegador antigo sem <dialog>: os cards não viram botões mortos,
        // apenas não abrem o modal.
        if (typeof modal.showModal !== 'function') return;

        var elCategoria = document.getElementById('caso-categoria');
        var elTitulo = document.getElementById('caso-titulo');
        var elRepo = document.getElementById('caso-repo');
        var elMidia = document.getElementById('caso-midia');
        var elTexto = document.getElementById('caso-texto');
        var botaoFechar = document.getElementById('caso-fechar');

        /** Monta o link do repositório, ou deixa vazio se o projeto é privado. */
        function montarRepo(caso) {
            if (!caso.repo) { elRepo.textContent = ''; return; }

            var link = document.createElement('a');
            link.href = caso.repo;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = 'Ver código no GitHub ↗';

            elRepo.textContent = '';
            elRepo.appendChild(link);
        }

        function montarMidia(caso) {
            if (!caso.video) {
                elMidia.innerHTML = '<p class="caso__video-pendente">Vídeo em breve</p>';
                return;
            }
            var video = document.createElement('video');
            video.className = 'caso__video';
            video.src = caso.video;
            video.controls = true;
            video.playsInline = true;
            video.preload = 'metadata';
            elMidia.innerHTML = '';
            elMidia.appendChild(video);
        }

        function abrir(chave) {
            var caso = CASOS[chave];
            if (!caso) return;

            elCategoria.textContent = caso.categoria;
            elTitulo.textContent = caso.titulo;
            elTexto.innerHTML = paraHTML(caso.texto);
            montarRepo(caso);
            montarMidia(caso);

            modal.showModal();
            document.body.classList.add('sem-rolagem');
        }

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                abrir(card.dataset.projeto);
            });
        });

        botaoFechar.addEventListener('click', function () { modal.close(); });

        // Clique no fundo escuro fecha. O <dialog> recebe o clique do ::backdrop,
        // então basta checar se o alvo foi o próprio modal e não o conteúdo.
        modal.addEventListener('click', function (evento) {
            if (evento.target === modal) modal.close();
        });

        // Ao fechar: libera a rolagem e para o vídeo.
        modal.addEventListener('close', function () {
            document.body.classList.remove('sem-rolagem');
            elMidia.innerHTML = '';
        });
    }


    /* ================================================================== *
       4. REVELAR AO ROLAR
       Observa os elementos .revelar e adiciona .is-visivel quando entram na
       tela. O fade e a subida estão no CSS; aqui só entra o atraso do
       stagger, calculado pela posição do elemento entre os irmãos.
     * ================================================================== */
    function iniciarRevelacao() {
        var alvos = document.querySelectorAll('.revelar');
        if (!alvos.length) return;

        // Sem animação: mostra tudo de uma vez e sai.
        if (movimentoReduzido || !('IntersectionObserver' in window)) {
            alvos.forEach(function (el) { el.classList.add('is-visivel'); });
            return;
        }

        var ATRASO = 55; // ms entre um item e o seguinte

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                var el = entrada.target;
                var irmaos = el.parentElement.querySelectorAll(':scope > .revelar');
                var posicao = Array.prototype.indexOf.call(irmaos, el);

                el.style.setProperty('--atraso', (posicao * ATRASO) + 'ms');
                el.classList.add('is-visivel');
                observador.unobserve(el); // roda uma vez só
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        alvos.forEach(function (el) { observador.observe(el); });
    }


    /* ================================================================== *
       5. PALCOS DOS CARDS
  
       Cada card tem um desenho (o "palco") que fica parado no quadro final.
       A animação existe só dentro de `.projeto.is-ativo` no CSS, então:
         - pôr a classe  = a animação nasce no quadro zero e se monta;
         - tirar a classe = a animação some e o desenho volta ao lugar.
       Não precisa reiniciar nada na mão nem esperar animação terminar.
  
       No mouse: entra e sai. No teclado: foco e desfoco. No toque (onde não
       existe hover): roda uma vez quando o card aparece na tela.
     * ================================================================== */
    function iniciarPalcos() {
        var cards = document.querySelectorAll('.projeto');
        if (!cards.length || movimentoReduzido) return;

        var temHover = window.matchMedia('(hover: hover)').matches;

        if (!temHover) {
            if (!('IntersectionObserver' in window)) return;

            var observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add('is-ativo');
                    observador.unobserve(entrada.target); // roda uma vez só
                });
            }, { threshold: 0.5 });

            cards.forEach(function (card) { observador.observe(card); });
            return;
        }

        cards.forEach(function (card) {
            function ligar() { card.classList.add('is-ativo'); }
            function desligar() { card.classList.remove('is-ativo'); }

            card.addEventListener('mouseenter', ligar);
            card.addEventListener('mouseleave', desligar);

            // focusin/focusout em vez de focus/blur: o card tem dois focáveis
            // dentro (o botão e o link do repositório) e só estes dois eventos
            // sobem dos filhos até aqui.
            card.addEventListener('focusin', ligar);
            card.addEventListener('focusout', desligar);
        });
    }


    /* ================================================================== *
       6. PIPELINE DO HERO
  
       O loop é do CSS e é infinito. Aqui só congelamos a animação enquanto
       ela não está na tela, para não consumir bateria com algo invisível.
     * ================================================================== */
    function iniciarPipeline() {
        var pipeline = document.getElementById('pipeline');
        if (!pipeline || movimentoReduzido) return;
        if (!('IntersectionObserver' in window)) return;

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                pipeline.classList.toggle('is-pausado', !entrada.isIntersecting);
            });
        }, { threshold: 0 });

        observador.observe(pipeline);
    }


    /* ================================================================== *
       6-B. ALTERNADOR DE TEMA

       Quem ESCOLHE o tema é o script do <head> — ele roda antes da primeira
       pintura para a página não piscar no tema errado. Aqui só tratamos o
       clique e mantemos os rótulos em dia.

       Uma vez que o visitante clica, a escolha dele passa a valer sobre a
       preferência do sistema, e fica salva entre visitas.
     * ================================================================== */
    function iniciarTema() {
        var botao = document.getElementById('tema');
        var rotulo = document.getElementById('tema-rotulo');
        if (!botao || !rotulo) return;

        var raiz = document.documentElement;
        var corBarra = document.getElementById('cor-barra');

        function atualizarRotulos() {
            var claro = raiz.dataset.tema === 'claro';

            // O rótulo mostra o tema ativo; o aria-label diz o que o clique faz.
            rotulo.textContent = claro ? 'claro' : 'escuro';
            botao.setAttribute(
                'aria-label',
                claro
                    ? 'Tema claro. Alternar para o tema escuro.'
                    : 'Tema escuro. Alternar para o tema claro.'
            );

            // A barra do navegador no mobile acompanha a troca.
            // Estes dois valores são --cor-fundo de cada tema.
            if (corBarra) corBarra.content = claro ? '#ffffff' : '#0f0f0f';
        }

        botao.addEventListener('click', function () {
            var novo = raiz.dataset.tema === 'claro' ? 'escuro' : 'claro';
            raiz.dataset.tema = novo;

            // localStorage pode lançar em file:// ou em modo restrito: o tema
            // troca de qualquer jeito, só não sobrevive ao recarregar.
            try { localStorage.setItem('tema', novo); } catch (e) { }

            atualizarRotulos();
        });

        atualizarRotulos();
    }


    /* ================================================================== *
       7. EMBARALHAR O NOME (hover no hero)
       As letras trocam por caracteres aleatórios e assentam da esquerda
       para a direita em 450ms. Dispara uma vez por hover.
     * ================================================================== */
    function iniciarEmbaralhamento() {
        var nome = document.getElementById('nome');
        if (!nome || movimentoReduzido) return;

        var textoFinal = nome.dataset.texto || nome.textContent;
        var DURACAO = 450;
        // Só letras e números: em Inter eles têm larguras parecidas, então o
        // texto não "pula" enquanto embaralha.
        var ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var rodando = false;

        function sortear() {
            return ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length));
        }

        function embaralhar() {
            if (rodando) return;
            rodando = true;

            var inicio = performance.now();
            var quadro = 0;
            var ruido = textoFinal.split('').map(sortear);

            function passo(agora) {
                var progresso = Math.min((agora - inicio) / DURACAO, 1);

                // Troca os caracteres aleatórios a cada 3 quadros (~50ms): a 60fps
                // o embaralhamento fica ilegível e pisca demais.
                if (quadro % 3 === 0) ruido = ruido.map(sortear);
                quadro++;

                var saida = '';
                for (var i = 0; i < textoFinal.length; i++) {
                    var caractere = textoFinal.charAt(i);

                    // Espaços ficam parados: preservam a quebra do nome em duas palavras.
                    if (caractere === ' ') { saida += ' '; continue; }

                    // Cada letra assenta na sua vez, da esquerda para a direita.
                    var limiar = (i + 1) / textoFinal.length;
                    saida += progresso >= limiar ? caractere : ruido[i];
                }
                nome.textContent = saida;

                if (progresso < 1) {
                    requestAnimationFrame(passo);
                } else {
                    nome.textContent = textoFinal; // garante o texto exato no fim
                }
            }

            requestAnimationFrame(passo);
        }

        nome.addEventListener('mouseenter', embaralhar);
        // Libera para rodar de novo só quando o ponteiro sair e voltar.
        nome.addEventListener('mouseleave', function () { rodando = false; });
    }


    /* ================================================================== *
       8. INÍCIO
     * ================================================================== */
    iniciarModal();
    iniciarRevelacao();
    iniciarPalcos();
    iniciarPipeline();
    iniciarTema();
    iniciarEmbaralhamento();
})();
