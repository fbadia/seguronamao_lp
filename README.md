# SeguroNaMão — Landing page de pré-lançamento

Página estática (HTML/CSS/JS, sem build) para divulgar o SeguroNaMão e captar corretores para a lista de acesso antecipado (beta).

Identidade visual: `quickAccessCorretor/docs/design-system-e-diretrizes.md` (tema escuro fixo).

## Estrutura

```
index.html         Landing page (indexável)
robots.txt         Regras para buscadores + link do sitemap
sitemap.xml        Páginas indexáveis
llms.txt           Resumo do produto para motores de IA (GEO)
docs/seo-geo.md    Estratégia de SEO/GEO e pautas de conteúdo
privacidade.html   Política de Privacidade (LGPD) — falta revisão jurídica
css/styles.css     Estilos (tokens do design system)
js/config.js       ⚙️ Configuração: envio de leads e IDs de analytics
js/main.js         Menu, animação do mockup, formulário, consentimento de cookies
assets/logo.svg    Símbolo provisório da marca
```

## Rodar localmente

```bash
python3 -m http.server 4173
```

Abra http://localhost:4173.

## Configuração (`js/config.js`)

O arquivo tem uma configuração por ambiente, escolhida pelo endereço da página:

| Ambiente | Endereços | Uso |
|---|---|---|
| `production` | `seguronamao.seg.br`, `www.seguronamao.seg.br`, `*.apps.zeroserver.cc` | Webhook e analytics reais |
| `test` | Qualquer outro (GitHub Pages, localhost) | Modo `console` ou webhook de teste, sem analytics |

Assim os testes nunca enviam cadastros para a lista real. O lead enviado inclui o campo `ambiente`.

### Leads

- `provider: 'console'` (padrão): nada é enviado, o lead só aparece no console do navegador.
- `provider: 'webhook'` + `webhookUrl`: o formulário faz `POST` JSON para a URL informada.

Formato enviado:

```json
{
  "nome": "Mariana Oliveira",
  "email": "mariana@corretora.com.br",
  "whatsapp": "+5511987654321",
  "consentimento": true,
  "consentimento_em": "2026-10-02T18:00:00.000Z",
  "origem": "landing-lista-espera",
  "ambiente": "production",
  "pagina": "https://…/",
  "utm": { "utm_source": "instagram" }
}
```

O webhook (Make, Zapier, n8n ou uma função serverless) grava o contato na ferramenta de e-mail escolhida (Brevo, RD Station, Mailchimp…).
**Não coloque chaves de API no `config.js`**: o arquivo é público.

### Analytics

Preencha `ga4Id` e/ou `metaPixelId`. Os scripts **só carregam depois que o visitante aceita** no banner de cookies. Com os dois campos vazios, o banner nem aparece.

Eventos de conversão disparados no cadastro: `generate_lead` (GA4) e `Lead` (Meta).

## Ambientes e deploy

| | Testes | Produção |
|---|---|---|
| Onde | GitHub Pages: https://fbadia.github.io/seguronamao_lp/ | ZeroServer: https://seguronamao.seg.br (hoje em `https://app-8fe04c64.apps.zeroserver.cc`) |
| Dispara | Push/merge na `main` | Tag `vX.Y.Z` + aprovação no environment `production` |
| Workflow | [pages.yml](.github/workflows/pages.yml) | [release.yml](.github/workflows/release.yml) |
| Indexação | `noindex` em tudo | `index.html` indexável; `privacidade.html` `noindex` |
| Config (`config.js`) | `test` | `production` |

### Fluxo

1. Abra um PR, revise e faça o merge na `main`: o **GitHub Pages** é atualizado em cerca de 1 minuto.
2. Valide a página no ambiente de testes.
3. Crie a tag da versão:
   ```bash
   git tag v0.2.0 && git push origin v0.2.0
   ```
4. O workflow **Release (produção)** gera a imagem `ghcr.io/fbadia/seguronamao-lp:0.2.0` (amd64 + arm64) e fica aguardando aprovação.
5. Em *Actions → Release (produção)*, clique em **Review deployments → Approve**. O workflow faz `zs deploy` com a imagem `0.2.0`.

Use versionamento semântico: correção de texto ou estilo → `v0.2.1`; seção ou funcionalidade nova → `v0.3.0`.

### Configuração inicial (uma vez)

1. *Settings → Environments → New environment* `production`, com você em **Required reviewers**.
2. No portal da ZeroServer, gere uma API key (`zsk_...`) e salve como secret **`ZS_API_KEY`** nesse environment.

### Deploy manual / rollback

O `zs.yaml` guarda a versão usada em deploy manual. Para voltar a uma versão anterior:

1. Altere a imagem no `zs.yaml` (ex.: `ghcr.io/fbadia/seguronamao-lp:0.1.1`).
2. Rode:
   ```bash
   zs deploy
   ```
3. Acompanhe com:
   ```bash
   zs list
   ```

A ZeroServer roda **imagens Docker já publicadas** (não faz build a partir do código), com uma instância por app. Arquivos envolvidos: `Dockerfile`, `nginx.conf` (porta 8181, gzip, cache, cabeçalhos de segurança, `/healthz`), `.dockerignore` e `zs.yaml`.

### Domínio próprio

```bash
zs domain add seguronamao.seg.br --app seguronamao-lp   # retorna o registro TXT
zs domain verify seguronamao.seg.br                     # depois de criar o TXT no DNS
```

Em seguida, aponte um CNAME/A para o gateway da ZeroServer (instruções no retorno do comando).

### Testar a imagem localmente

```bash
docker build -t seguronamao-lp:local . && docker run --rm -p 8080:8181 seguronamao-lp:local
```

## Indexação, SEO e GEO

- **`index.html` é indexável**, com `canonical` para `https://seguronamao.seg.br/` e Schema JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`).
- **`privacidade.html` não é indexável**: `<meta name="robots" content="noindex, nofollow">` + cabeçalho `X-Robots-Tag` no `nginx.conf`. Ela fica fora do `sitemap.xml` e **não** é bloqueada no `robots.txt` (senão o buscador não lê o `noindex`).
- **Ambiente de testes (GitHub Pages)**: o workflow injeta `noindex` também na `index.html`, para não competir com o domínio oficial.
- `robots.txt`, `sitemap.xml` e `llms.txt` (resumo factual para motores de IA) ficam na raiz.
- **FAQ**: o texto visível é gerado a partir do JSON-LD. Ao editar uma pergunta, altere os dois para continuarem idênticos.

Estratégia e próximos conteúdos: [docs/seo-geo.md](docs/seo-geo.md).

## Pendências antes de publicar

- [ ] Definir a ferramenta de e-mail e configurar o webhook
- [ ] Preencher os IDs de GA4 / Meta Pixel
- [x] Dados da empresa, endereço e encarregado na `privacidade.html`
- [ ] `privacidade.html`: preencher ferramentas de e-mail/automação (seção 5) quando escolhidas
- [ ] Revisão jurídica da `privacidade.html` (e remover o aviso "Modelo em revisão")
- [x] E-mail de contato no rodapé (`contato@seguronamao.seg.br`)
- [ ] Confirmar que as caixas `contato@` e `privacidade@seguronamao.seg.br` existem e recebem e-mails
- [ ] Logo definitivo (o `favicon.svg` do app é o logo padrão do Vite)
- [ ] Imagem de compartilhamento `og:image` (1200×630); `og:url` já aponta para `seguronamao.seg.br`
- [x] Indexação da `index.html` liberada (a `privacidade.html` segue `noindex`)
- [ ] Criar o environment `production` (revisor obrigatório) e o secret `ZS_API_KEY`
- [ ] Apontar `seguronamao.seg.br` para a ZeroServer (`zs domain add`) e cadastrar no Google Search Console e no Bing Webmaster Tools (enviar o `sitemap.xml`)
- [ ] Atualizar `lastmod` do `sitemap.xml` a cada mudança relevante de conteúdo
- [x] Produção no ar na ZeroServer (`app-8fe04c64.apps.zeroserver.cc`)
- [x] Pacote `seguronamao-lp` público no GHCR (pull anônimo verificado)
- [x] Afirmações de segurança validadas (isolamento entre corretoras, criptografia)
- [x] FAQ validado (funciona no navegador; pode ser adicionado à tela inicial)
