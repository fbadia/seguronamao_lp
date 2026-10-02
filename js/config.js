/**
 * Configuração da landing page — único arquivo que precisa ser editado
 * para plugar a ferramenta de e-mail e as ferramentas de medição.
 */
window.SNM_CONFIG = {
  leads: {
    /**
     * 'console' → não envia para lugar nenhum; apenas registra no console (desenvolvimento).
     * 'webhook' → faz POST JSON em `webhookUrl` (Make, Zapier, n8n, função serverless etc.),
     *             que por sua vez grava o contato na ferramenta de e-mail escolhida.
     *
     * Nunca coloque chaves de API (Brevo, Mailchimp, RD Station…) neste arquivo:
     * ele é público. A chave deve ficar no webhook/servidor.
     */
    provider: 'console',
    webhookUrl: '',
  },

  analytics: {
    // Deixe vazio para desativar. Os scripts só carregam após o consentimento do visitante.
    ga4Id: '',        // ex.: 'G-XXXXXXXXXX'
    metaPixelId: '',  // ex.: '123456789012345'
  },
};
