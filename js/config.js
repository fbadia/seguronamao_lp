/**
 * Configuração da landing page por ambiente — único arquivo que precisa ser editado
 * para plugar a ferramenta de e-mail e as ferramentas de medição.
 *
 * O ambiente é escolhido pelo endereço da página:
 *   - production → seguronamao.seg.br e o endereço da app na ZeroServer (*.apps.zeroserver.cc)
 *   - test       → qualquer outro (GitHub Pages, localhost)
 *
 * Assim o ambiente de testes nunca envia cadastros para a lista real nem
 * contamina o analytics de produção.
 *
 * leads.provider:
 *   'console' → não envia para lugar nenhum; apenas registra no console.
 *   'webhook' → faz POST JSON em `webhookUrl` (Make, Zapier, n8n, função serverless etc.),
 *               que por sua vez grava o contato na ferramenta de e-mail escolhida.
 *
 * Nunca coloque chaves de API (Brevo, Mailchimp, RD Station…) neste arquivo:
 * ele é público. A chave deve ficar no webhook/servidor.
 */
(function () {
  var ENVIRONMENTS = {
    production: {
      leads: {
        provider: 'console', // trocar para 'webhook' quando a ferramenta de e-mail for definida
        webhookUrl: '',
      },
      analytics: {
        // Os scripts só carregam após o consentimento do visitante.
        ga4Id: '',        // ex.: 'G-XXXXXXXXXX'
        metaPixelId: '',  // ex.: '123456789012345'
      },
    },

    test: {
      leads: {
        provider: 'console', // ou 'webhook' com um webhook de TESTE (nunca o de produção)
        webhookUrl: '',
      },
      analytics: {
        ga4Id: '',
        metaPixelId: '',
      },
    },
  };

  var host = window.location.hostname;
  var isProduction =
    host === 'seguronamao.seg.br' ||
    host === 'www.seguronamao.seg.br' ||
    /\.apps\.zeroserver\.cc$/.test(host);

  window.SNM_ENV = isProduction ? 'production' : 'test';
  window.SNM_CONFIG = ENVIRONMENTS[window.SNM_ENV];
})();
