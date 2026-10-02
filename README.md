# SeguroNaMão — Landing page de pré-lançamento

Página estática (HTML/CSS/JS, sem build) para divulgar o SeguroNaMão e captar corretores para a lista de acesso antecipado (beta).

Identidade visual: `quickAccessCorretor/docs/design-system-e-diretrizes.md` (tema escuro fixo).

## Estrutura

```
index.html         Landing page
privacidade.html   Modelo de Política de Privacidade (LGPD) — preencher e revisar
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
  "pagina": "https://…/",
  "utm": { "utm_source": "instagram" }
}
```

O webhook (Make, Zapier, n8n ou uma função serverless) grava o contato na ferramenta de e-mail escolhida (Brevo, RD Station, Mailchimp…).
**Não coloque chaves de API no `config.js`**: o arquivo é público.

### Analytics

Preencha `ga4Id` e/ou `metaPixelId`. Os scripts **só carregam depois que o visitante aceita** no banner de cookies. Com os dois campos vazios, o banner nem aparece.

Eventos de conversão disparados no cadastro: `generate_lead` (GA4) e `Lead` (Meta).

## Deploy (ZeroServer)

A [ZeroServer](https://zeroserver.cc) roda **imagens Docker já publicadas**: ela não faz build a partir do código. O fluxo é:

1. O GitHub Actions ([.github/workflows/docker-publish.yml](.github/workflows/docker-publish.yml)) gera a imagem multi-arch (amd64 + arm64, exigência da rede) e publica em `ghcr.io/fbadia/seguronamao-lp`.
2. O [zs.yaml](zs.yaml) aponta para a versão da imagem, e o `zs deploy` sobe o container (nginx, porta 80).

Arquivos envolvidos: `Dockerfile`, `nginx.conf` (gzip, cache e cabeçalhos de segurança, `/healthz`), `.dockerignore` e `zs.yaml`.

### Primeira publicação

1. Faça o push do repositório para o GitHub e crie a tag da versão:
   ```bash
   git tag v0.1.0 && git push origin main --tags
   ```
2. Aguarde o workflow "Publicar imagem" terminar na aba *Actions*.
3. No GitHub, em *Packages → seguronamao-lp → Package settings*, mude a visibilidade para **Public** (sem isso, a ZeroServer não consegue baixar a imagem; alternativa: `zs registry login ghcr.io` com um token `read:packages`).
4. Faça o deploy:
   ```bash
   zs login
   zs deploy        # lê o zs.yaml
   zs list          # aguarde RUNNING; mostra a URL https://app-xxx.apps.zeroserver.cc
   ```

### Novas versões

1. `git tag v0.1.1 && git push origin --tags`
2. Atualize a tag da imagem no `zs.yaml` (`ghcr.io/fbadia/seguronamao-lp:0.1.1`), faça o commit e rode `zs deploy`.

### Domínio próprio

```bash
zs domain add www.seudominio.com.br --app seguronamao-lp   # retorna o registro TXT
zs domain verify www.seudominio.com.br                    # depois de criar o TXT no DNS
```

Em seguida, aponte um CNAME/A para o gateway da ZeroServer (instruções no retorno do comando).

### Testar a imagem localmente

```bash
docker build -t seguronamao-lp:local . && docker run --rm -p 8080:80 seguronamao-lp:local
```

## Pendências antes de publicar

- [ ] Definir a ferramenta de e-mail e configurar o webhook
- [ ] Preencher os IDs de GA4 / Meta Pixel
- [ ] Preencher e revisar juridicamente `privacidade.html` (razão social, CNPJ, DPO, fornecedores)
- [ ] E-mail de contato oficial no rodapé
- [ ] Logo definitivo (o `favicon.svg` do app é o logo padrão do Vite)
- [ ] Imagem de compartilhamento `og:image` (1200×630) e `og:url`
- [ ] Domínio definitivo (+ `zs domain add`)
- [ ] Tornar público o pacote `seguronamao-lp` no GHCR após o primeiro build
- [x] Afirmações de segurança validadas (isolamento entre corretoras, criptografia)
- [x] FAQ validado (funciona no navegador; pode ser adicionado à tela inicial)
