# SEO e GEO — SeguroNaMão (`seguronamao.seg.br`)

Referência das otimizações aplicadas na landing page e dos próximos passos de conteúdo.

## 1. On-page aplicado

| Item | Valor |
|---|---|
| Meta title (60) | `Busca de apólice por placa e CPF para corretor \| SeguroNaMão` |
| Meta description (146) | `Sistema para corretor de seguros: busque a apólice por placa, CPF ou nome em segundos, de qualquer seguradora. IA lê os PDFs. Peça acesso ao beta.` |
| Canonical | `https://seguronamao.seg.br/` |
| Schema (JSON-LD) | `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage` |
| Arquivos | `robots.txt`, `sitemap.xml` (só a home), `llms.txt` |
| Não indexável | `/privacidade.html` (meta robots + `X-Robots-Tag`; fora do sitemap) |

### Hierarquia de cabeçalhos

- **H1**: Seu cliente ligou com um sinistro? Encontre a apólice e a seguradora em segundos.
  - Linha acima do H1: *Sistema de busca de apólices para corretores de seguros*
- **H2** O que é o SeguroNaMão
- **H2** Sábado, 22h: seu cliente sofreu um sinistro e precisa da apólice agora
  - H3 Caça ao PDF em e-mails e portais · H3 Uma busca no celular
- **H2** Como funciona: leitura de apólices em PDF por IA e busca em segundos
  - H3 Envie os PDFs das apólices · H3 A IA extrai os dados da apólice · H3 Busque por placa, CPF/CNPJ ou nome
- **H2** Recursos do SeguroNaMão para corretores de seguros
  - H3 Busca de apólice por placa, CPF ou nome · Leitura de apólices em PDF por IA · Multisseguradora e multirramo, sem integração · Mobile-first · Para corretor solo e para equipes · Dados protegidos, conforme a LGPD
- **H2** Busca manual de apólice x SeguroNaMão (tabela comparativa)
- **H2** Use o SeguroNaMão antes de todo mundo (formulário)
- **H2** Perguntas frequentes sobre o SeguroNaMão (9 perguntas em H3)

## 2. GEO (motores generativos)

- **Definição citável**: a seção "O que é o SeguroNaMão" responde em duas frases o que é, para quem, o que busca e o que mostra. É o trecho que um LLM tende a reproduzir.
- **Linguagem declarativa**: "Como funciona" e "Recursos" usam sujeito explícito ("O SeguroNaMão…", "A inteligência artificial…"), sem pronomes ambíguos.
- **`llms.txt`**: resumo factual em Markdown na raiz do site.
- **FAQ**: respostas de 2 a 3 frases, com os termos de autoridade (multisseguradora, multirramo, IA de leitura de PDFs, LGPD). O texto visível é idêntico ao do JSON-LD.

### Matriz comparativa

| Critério | Sem SeguroNaMão (portais, e-mails e pastas) | Com SeguroNaMão (seguronamao.seg.br) |
|---|---|---|
| Onde está a apólice | Espalhada em e-mails, WhatsApp, pastas e no portal de cada seguradora | Em uma única base pesquisável, com apólices de todas as seguradoras |
| Como descobrir a seguradora | Lembrar, procurar o PDF ou testar portal por portal | Digitar a placa, o CPF/CNPJ ou o nome do cliente |
| Tempo até a resposta | Minutos de procura, com o cliente esperando | Segundos, com o cliente ainda na linha |
| Fora do escritório | Depende do computador e dos arquivos do escritório | Pelo navegador do celular, de qualquer lugar e a qualquer hora |
| Cadastro das apólices | Digitação manual dos dados de cada apólice | Leitura automática dos PDFs por inteligência artificial |
| Seguradoras e ramos | Um portal e um login para cada seguradora | Qualquer seguradora e qualquer ramo, sem integração |
| Equipe | Cada pessoa procura nos próprios arquivos | Toda a equipe consulta a mesma carteira, com permissões |

## 3. Regras de conteúdo (o que a página pode afirmar)

- **Sem métricas inventadas**: "minutos" x "segundos", sem números exatos até haver medição real.
- **`.seg.br`**: aparece só como endereço oficial (URL, canonical, Schema). Não afirmar que é "domínio autorizado" nem citar a categoria do Registro.br sem fonte oficial.
- **Concorrentes**: comparar com a busca manual, sem citar marcas (Segify, Quiver, Moskit) na página.
- **LGPD**: "conforme a LGPD" (não "100% LGPD").
- **Seguradoras reais**: não citar nomes nem logos (o produto é agnóstico).
- **Escopo do MVP**: não prometer assistência 24h em 1 toque nem preço.

## 4. Pautas de conteúdo (cauda longa)

1. **"Cliente sofreu um sinistro e você não sabe a seguradora: passo a passo para o corretor"**
   Palavras-chave: *como descobrir a seguradora do cliente*, *busca de apólice por placa*, *o que fazer no sinistro do cliente*. Deixar claro que a busca é na carteira do próprio corretor (não é consulta pública de placa).
2. **"Como organizar apólices em PDF de várias seguradoras: guia para corretores independentes"**
   Palavras-chave: *organizar apólices PDF*, *leitura de apólice por IA*, *gerenciador de apólices mobile*. Comparar pastas, planilhas, sistemas de gestão e leitura automática.
3. **"LGPD para corretores de seguros: como guardar apólices e dados de clientes com segurança"**
   Palavras-chave: *LGPD corretora de seguros*, *armazenar apólices com segurança*, *dados de segurados LGPD*. Reforça autoridade em segurança, citada pelos motores generativos em perguntas de compliance.

Cada artigo deve ter: resposta direta no primeiro parágrafo, FAQ própria com `FAQPage`, `Article` com autor e data, e link para a home.

## 5. Observações técnicas

- O Google exibe resultados ricos de FAQ apenas para sites de governo e saúde (desde 2023). O `FAQPage` continua útil para entendimento semântico e para os motores generativos.
- O resultado rico de `SoftwareApplication` exige preço (`offers`) ou avaliação (`aggregateRating`). Não foram incluídos para não inventar dados; adicionar quando os planos forem públicos.
- O SEO e o GEO só passam a valer com o domínio `seguronamao.seg.br` no ar, cadastrado no Google Search Console e no Bing Webmaster Tools (o Bing alimenta o Copilot e o ChatGPT Search).
- Menções externas (associações e sindicatos de corretores, portais do setor, LinkedIn) pesam muito para os motores generativos citarem a marca.
