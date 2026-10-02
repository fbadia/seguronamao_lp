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

## Pendências antes de publicar

- [ ] Definir a ferramenta de e-mail e configurar o webhook
- [ ] Preencher os IDs de GA4 / Meta Pixel
- [ ] Preencher e revisar juridicamente `privacidade.html` (razão social, CNPJ, DPO, fornecedores)
- [ ] E-mail de contato oficial no rodapé
- [ ] Logo definitivo (o `favicon.svg` do app é o logo padrão do Vite)
- [ ] Imagem de compartilhamento `og:image` (1200×630) e `og:url`
- [ ] Domínio definitivo
- [x] Afirmações de segurança validadas (isolamento entre corretoras, criptografia)
- [x] FAQ validado (funciona no navegador; pode ser adicionado à tela inicial)
