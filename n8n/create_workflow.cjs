// Script para criar o workflow de Aluguel por Temporada no n8n
// Usa os mesmos padrões do workflow SDR Iene Assessoria existente

const N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmE4N2E1NC02YmYzLTQyNjAtODkxZC0xZWE1NWUwZmMxMDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMGY4OWQxODUtOGZlZC00NmZmLThkMDAtNmViYjAzYTRlY2JmIiwiaWF0IjoxNzc0NTgyNzE1fQ.V1ICbk5zE-az_rK0zPojTit2areQYQI1o-wWDxckYOo";
const N8N_URL = "https://automacao.ieneassessoria.com.br";
const SUPABASE_URL = "https://zvmhoadlhyboyvlqwszi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bWhvYWRsaHlib3l2bHF3c3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzE3MDMsImV4cCI6MjA5MDEwNzcwM30.i9TBuzoUijU9cYEe5bWOxmaW-cBTWiPFej65hcSC7h8";

// Credenciais existentes no n8n (reutilizadas)
const REDIS_CRED = { id: "iyC5ujmZhSmZnhvS", name: "Redis account" };
const OPENAI_CRED = { id: "t9wHE2b5wWbeu1BY", name: "OpenAi account" };

const SYSTEM_PROMPT = `# IDENTIDADE — ZAPBOT · ALUGUEL POR TEMPORADA

Você é o **ZapBot**, assistente virtual especializado em aluguel por temporada (Airbnb e Booking.com).
Você atende hóspedes pelo WhatsApp em nome do proprietário/gestor do imóvel.

## SEU OBJETIVO
Oferecer atendimento excepcional ao hóspede durante todo o ciclo:
pré-reserva → check-in → estadia → check-out → avaliação.

## TOM E ESTILO
- Caloroso, acolhedor e profissional
- Respostas curtas e diretas (máximo 3-4 linhas por mensagem)
- Use emojis com moderação (1-2 por mensagem)
- Sempre em português brasileiro

## FLUXOS PRINCIPAIS

### 1. NOVA RESERVA / PRIMEIRO CONTATO
- Dê boas-vindas calorosas
- Confirme a reserva
- Solicite documentos: "Pode me enviar uma foto do RG ou CNH para finalizarmos o cadastro?"
- Informe que enviará as instruções de acesso 24h antes do check-in

### 2. SOLICITAÇÃO DE CHECK-IN / ACESSO
Se o hóspede perguntar sobre acesso, endereço ou código da fechadura, informe:
- Endereço: [CONFIGURE O ENDEREÇO]
- Código da fechadura: [CONFIGURE O CÓDIGO]
- Horário de check-in: a partir das 15h00
- Horário de check-out: até 11h00
- Wi-Fi: [CONFIGURE O NOME E SENHA]

### 3. DÚVIDAS DURANTE A ESTADIA
Responda dúvidas sobre:
- Equipamentos (ar-condicionado, TV, chuveiro, etc.)
- Localização de itens (toalhas, chaves extras, etc.)
- Regras do imóvel
- Serviços próximos (mercado, farmácia, restaurantes)

### 4. PROBLEMAS / MANUTENÇÃO
Se o hóspede reportar problema:
- Demonstre empatia imediatamente
- Informe que vai acionar o responsável
- Dê previsão de atendimento
- Acompanhe a resolução

### 5. DOCUMENTOS RECEBIDOS
Quando o hóspede enviar documentos (imagens):
- Confirme o recebimento
- Informe que vai verificar e dar retorno
- Lembre que enviará instruções de acesso 24h antes do check-in

### 6. AVALIAÇÃO / NPS
Quando o hóspede responder à pesquisa de satisfação:
- Agradeça a avaliação
- Se nota >= 8: incentive a avaliar no Airbnb/Booking
- Se nota < 8: pergunte como pode melhorar e demonstre atenção

## REGRAS IMPORTANTES
- Nunca passe o código da fechadura antes de confirmar os documentos
- Se não souber responder algo, diga que vai verificar com o responsável
- Nunca prometa algo que não possa cumprir
- Sempre mantenha o tom positivo, mesmo em situações difíceis`;

const workflow = {
  name: "ZapCentral - Aluguel por Temporada",
  nodes: [
    // ══════════════════════════════════════════
    // FLUXO 1: MENSAGENS WHATSAPP (TEMPO REAL)
    // ══════════════════════════════════════════

    {
      id: "node-wh-hospedagem",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [-2400, 460],
      parameters: {
        httpMethod: "POST",
        path: "iene_hospedagem",
        options: {}
      },
      webhookId: "iene-hospedagem-webhook"
    },

    {
      id: "node-vars",
      name: "Variaveis",
      type: "n8n-nodes-base.set",
      typeVersion: 3.4,
      position: [-2180, 460],
      parameters: {
        assignments: {
          assignments: [
            {
              id: "var-01",
              name: "NumeroWhatsLead",
              value: "={{ $('Webhook').item.json.body.data.key.remoteJid.substring(0,$('Webhook').item.json.body.data.key.remoteJid.indexOf(\"@\")) }}",
              type: "string"
            },
            {
              id: "var-02",
              name: "nomeInstancia",
              value: "Iene-teste",
              type: "string"
            },
            {
              id: "var-03",
              name: "ApiKeyEVO",
              value: "09A5B5A0CD5A-4775-83A6-5A00DCDFA7D1",
              type: "string"
            },
            {
              id: "var-04",
              name: "pushName",
              value: "={{ $('Webhook').item.json.body.data.pushName || 'Hóspede' }}",
              type: "string"
            },
            {
              id: "var-05",
              name: "mensagemTexto",
              value: "={{ $('Webhook').item.json.body.data.message?.conversation || $('Webhook').item.json.body.data.message?.extendedTextMessage?.text || '' }}",
              type: "string"
            },
            {
              id: "var-06",
              name: "temMidia",
              value: "={{ !!$('Webhook').item.json.body.data.message?.imageMessage || !!$('Webhook').item.json.body.data.message?.documentMessage }}",
              type: "boolean"
            }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-if-fromme",
      name: "É fromMe?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [-1960, 460],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "strict",
            version: 2
          },
          conditions: [
            {
              id: "cond-fromme",
              leftValue: "={{ $json.body.data.key.fromMe }}",
              rightValue: "",
              operator: {
                type: "boolean",
                operation: "true",
                singleValue: true
              }
            },
            {
              id: "cond-group",
              leftValue: "={{ $json.body.data.key.remoteJid }}",
              rightValue: "@g.us",
              operator: {
                type: "string",
                operation: "contains"
              }
            }
          ],
          combinator: "or"
        },
        options: {}
      }
    },

    {
      id: "node-noop-fromme",
      name: "Ignorar (bot/grupo)",
      type: "n8n-nodes-base.noOp",
      typeVersion: 1,
      position: [-1740, 340],
      parameters: {}
    },

    {
      id: "node-is-blocked",
      name: "IsBloqueado?",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [-1740, 560],
      parameters: {
        operation: "get",
        propertyName: "Agentebloqueado",
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_hosp_bloqueado",
        keyType: "string",
        options: { dotNotation: false }
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-filter-blocked",
      name: "Bloqueado!",
      type: "n8n-nodes-base.filter",
      typeVersion: 2.2,
      position: [-1520, 560],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "strict",
            version: 2
          },
          conditions: [
            {
              id: "cond-blocked",
              leftValue: "={{ $json.Agentebloqueado }}",
              rightValue: "",
              operator: {
                type: "string",
                operation: "empty",
                singleValue: true
              }
            }
          ],
          combinator: "and"
        },
        options: {}
      }
    },

    {
      id: "node-block-agent",
      name: "BloqueiaAgente",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [-1300, 560],
      parameters: {
        operation: "set",
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_hosp_bloqueado",
        value: "true",
        keyType: "string",
        expire: true,
        ttl: 120
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-save-incoming",
      name: "SalvaMsgEntrada",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [-1080, 560],
      parameters: {
        operation: "push",
        list: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_hosp",
        messageData: `={{ JSON.stringify({ id: $now.toUnixInteger().toString(), texto: "Hóspede " + $('Variaveis').item.json.pushName + ": " + ($('Variaveis').item.json.mensagemTexto || ($('Variaveis').item.json.temMidia ? "[documento/imagem enviado]" : "[mensagem vazia]")) }) }}`,
        tail: true
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-recupera",
      name: "Recupera",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [-860, 560],
      parameters: {
        operation: "get",
        propertyName: "mensagens",
        key: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_hosp",
        keyType: "list",
        options: {}
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-format-msgs",
      name: "TodasMsgFormatada",
      type: "n8n-nodes-base.set",
      typeVersion: 3.4,
      position: [-640, 560],
      parameters: {
        assignments: {
          assignments: [
            {
              id: "fmt-01",
              name: "todasMensagens",
              value: "={{ $('Recupera').item.json.mensagens.map(item => JSON.parse(item).texto).join('\\n') }}",
              type: "string"
            }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-agent",
      name: "Agente Hospedagem",
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 1.7,
      position: [-420, 560],
      parameters: {
        promptType: "define",
        text: `=# Nome do hóspede:\n{{ $('Variaveis').item.json.pushName }}\n# Histórico da conversa:\n{{ $json.todasMensagens }}\n# Data e hora atual:\n{{ $now.toISO() }}\n# Tem mídia (imagem/documento):\n{{ $('Variaveis').item.json.temMidia }}`,
        options: {
          systemMessage: SYSTEM_PROMPT
        }
      }
    },

    {
      id: "node-save-response",
      name: "SalvaResposta",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [-200, 560],
      parameters: {
        operation: "push",
        list: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_hosp",
        messageData: "={{ JSON.stringify({ id: $now.toUnixInteger().toString() + '_r', texto: 'Assistente: ' + $json.output }) }}",
        tail: true
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-send-msg",
      name: "EnviaMsg",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [20, 560],
      parameters: {
        method: "POST",
        url: "=https://evolution.ieneassessoria.com.br/message/sendText/{{ $('Variaveis').item.json.nomeInstancia }}",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "apikey", value: "={{ $('Variaveis').item.json.ApiKeyEVO }}" }
          ]
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            { name: "=number", value: "={{ $('Variaveis').item.json.NumeroWhatsLead }}" },
            { name: "text", value: "={{ $('Agente Hospedagem').item.json.output }}" }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-unblock",
      name: "DesbloqueiAgente",
      type: "n8n-nodes-base.redis",
      typeVersion: 1,
      position: [240, 560],
      parameters: {
        operation: "delete",
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_hosp_bloqueado"
      },
      credentials: { redis: REDIS_CRED }
    },

    {
      id: "node-openai-model",
      name: "OpenAI Chat Model",
      type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      typeVersion: 1.2,
      position: [-420, 780],
      parameters: {
        model: {
          __rl: true,
          mode: "list",
          value: "gpt-4o-mini"
        },
        options: {}
      },
      credentials: { openAiApi: OPENAI_CRED }
    },

    // ══════════════════════════════════════════
    // FLUXO 2: LEMBRETE CHECK-IN 24H ANTES (10h)
    // ══════════════════════════════════════════

    {
      id: "node-schedule-checkin",
      name: "Agendamento: Check-in 24h",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [-2400, 980],
      parameters: {
        rule: {
          interval: [
            { field: "cronExpression", expression: "0 10 * * *" }
          ]
        }
      }
    },

    {
      id: "node-supabase-checkins",
      name: "Busca: Reservas de Amanhã",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [-2160, 980],
      parameters: {
        method: "GET",
        url: `${SUPABASE_URL}/rest/v1/leads?select=*&status=eq.atendimento`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "apikey", value: SUPABASE_KEY },
            { name: "Authorization", value: `Bearer ${SUPABASE_KEY}` }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-filter-checkins",
      name: "Filtra: Check-ins Amanhã",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [-1920, 980],
      parameters: {
        jsCode: `// Filtrar hóspedes com check-in amanhã
// IMPORTANTE: adicione a coluna checkin_date (DATE) na tabela leads do Supabase

const leads = Array.isArray($input.first().json) ? $input.first().json : [$input.first().json];

const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const dataAmanha = amanha.toISOString().split('T')[0];

// Por enquanto, retorna todos os leads "atendimento" (sem filtro por data)
// Quando adicionar checkin_date, mude para:
// const filtrados = leads.filter(l => l.checkin_date === dataAmanha);
const filtrados = leads.filter(l => l.phone && l.status === 'atendimento');

return filtrados.map(hospede => ({
  json: {
    phone: (hospede.phone || '').replace(/\\D/g, ''),
    nome: hospede.name || 'Hóspede',
    // ⚠️ CONFIGURE OS DADOS DO SEU IMÓVEL ABAIXO
    mensagem:
      \`Olá, \${hospede.name || 'hóspede'}! 🌟 Seu check-in é *amanhã*!\\n\\n\` +
      \`📍 *Endereço:* Rua Exemplo, 123, Apto 301 - Cidade\\n\` +
      \`🔑 *Código da fechadura:* 1234#\\n\` +
      \`🕐 *Entrada:* a partir das 15h00\\n\` +
      \`🕙 *Saída:* até 11h00\\n\` +
      \`📶 *Wi-Fi:* NomeRede | Senha: suasenha\\n\\n\` +
      \`Qualquer dúvida, me chame! Boa estadia! 🏠✨\`
  }
}));`
      }
    },

    {
      id: "node-loop-checkins",
      name: "Loop: Check-ins",
      type: "n8n-nodes-base.splitInBatches",
      typeVersion: 3,
      position: [-1680, 980],
      parameters: { options: {} }
    },

    {
      id: "node-send-checkin",
      name: "Envia: Lembrete Check-in",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [-1440, 980],
      parameters: {
        method: "POST",
        url: "https://evolution.ieneassessoria.com.br/message/sendText/Iene-teste",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "apikey", value: "09A5B5A0CD5A-4775-83A6-5A00DCDFA7D1" }
          ]
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            { name: "=number", value: "={{ $json.phone }}" },
            { name: "text", value: "={{ $json.mensagem }}" }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-noop-checkin",
      name: "Fim: Check-ins",
      type: "n8n-nodes-base.noOp",
      typeVersion: 1,
      position: [-1200, 980],
      parameters: {}
    },

    // ══════════════════════════════════════════
    // FLUXO 3: NPS PÓS-CHECKOUT (12h)
    // ══════════════════════════════════════════

    {
      id: "node-schedule-nps",
      name: "Agendamento: NPS Checkout",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [-2400, 1200],
      parameters: {
        rule: {
          interval: [
            { field: "cronExpression", expression: "0 12 * * *" }
          ]
        }
      }
    },

    {
      id: "node-supabase-checkouts",
      name: "Busca: Checkouts de Hoje",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [-2160, 1200],
      parameters: {
        method: "GET",
        url: `${SUPABASE_URL}/rest/v1/leads?select=*&status=eq.fechado`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "apikey", value: SUPABASE_KEY },
            { name: "Authorization", value: `Bearer ${SUPABASE_KEY}` }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-filter-nps",
      name: "Filtra: Checkouts de Hoje",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [-1920, 1200],
      parameters: {
        jsCode: `// Filtrar hóspedes com checkout hoje
// IMPORTANTE: adicione a coluna checkout_date (DATE) na tabela leads do Supabase

const leads = Array.isArray($input.first().json) ? $input.first().json : [$input.first().json];

const hoje = new Date().toISOString().split('T')[0];

// Quando adicionar checkout_date, use:
// const filtrados = leads.filter(l => l.checkout_date === hoje);
const filtrados = leads.filter(l => l.phone && l.status === 'fechado');

return filtrados.map(hospede => ({
  json: {
    phone: (hospede.phone || '').replace(/\\D/g, ''),
    nome: hospede.name || 'Hóspede',
    mensagem:
      \`Olá, \${hospede.name || 'hóspede'}! 😊 Esperamos que sua estadia tenha sido incrível!\\n\\n\` +
      \`Gostaríamos de saber sua opinião:\\n\` +
      \`⭐ *Numa escala de 0 a 10, o quanto você recomendaria nossa propriedade?*\\n\\n\` +
      \`Sua avaliação nos ajuda a melhorar e significa muito! 🙏\\n\` +
      \`Se puder também avaliar no Airbnb/Booking, agradecemos muito! 🌟\`
  }
}));`
      }
    },

    {
      id: "node-loop-nps",
      name: "Loop: NPS",
      type: "n8n-nodes-base.splitInBatches",
      typeVersion: 3,
      position: [-1680, 1200],
      parameters: { options: {} }
    },

    {
      id: "node-send-nps",
      name: "Envia: NPS",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [-1440, 1200],
      parameters: {
        method: "POST",
        url: "https://evolution.ieneassessoria.com.br/message/sendText/Iene-teste",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "apikey", value: "09A5B5A0CD5A-4775-83A6-5A00DCDFA7D1" }
          ]
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            { name: "=number", value: "={{ $json.phone }}" },
            { name: "text", value: "={{ $json.mensagem }}" }
          ]
        },
        options: {}
      }
    },

    {
      id: "node-noop-nps",
      name: "Fim: NPS",
      type: "n8n-nodes-base.noOp",
      typeVersion: 1,
      position: [-1200, 1200],
      parameters: {}
    },

    // ══════════════════════════════════════════
    // NOTAS EXPLICATIVAS (Sticky Notes)
    // ══════════════════════════════════════════

    {
      id: "note-1",
      name: "📌 FLUXO 1: WhatsApp",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-2400, 320],
      parameters: {
        width: 400,
        height: 100,
        content: "## 📱 Fluxo 1: Mensagens WhatsApp\nWebhook em: hook.ieneassessoria.com.br/webhook/iene_hospedagem\nAI Agent com memória Redis. Responde 24/7."
      }
    },

    {
      id: "note-2",
      name: "📌 FLUXO 2: Check-in",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-2400, 880],
      parameters: {
        width: 400,
        height: 80,
        content: "## ⏰ Fluxo 2: Lembrete Check-in\nExecução diária às 10h. Adicione coluna checkin_date no Supabase para filtrar por data."
      }
    },

    {
      id: "note-3",
      name: "📌 FLUXO 3: NPS",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-2400, 1100],
      parameters: {
        width: 400,
        height: 80,
        content: "## ⭐ Fluxo 3: NPS Pós-Checkout\nExecução diária às 12h. Adicione coluna checkout_date no Supabase para filtrar por data."
      }
    }
  ],

  connections: {
    "Webhook": {
      main: [[{ node: "Variaveis", type: "main", index: 0 }]]
    },
    "Variaveis": {
      main: [[{ node: "É fromMe?", type: "main", index: 0 }]]
    },
    "É fromMe?": {
      main: [
        [{ node: "Ignorar (bot/grupo)", type: "main", index: 0 }],
        [{ node: "IsBloqueado?", type: "main", index: 0 }]
      ]
    },
    "IsBloqueado?": {
      main: [[{ node: "Bloqueado!", type: "main", index: 0 }]]
    },
    "Bloqueado!": {
      main: [[{ node: "BloqueiaAgente", type: "main", index: 0 }]]
    },
    "BloqueiaAgente": {
      main: [[{ node: "SalvaMsgEntrada", type: "main", index: 0 }]]
    },
    "SalvaMsgEntrada": {
      main: [[{ node: "Recupera", type: "main", index: 0 }]]
    },
    "Recupera": {
      main: [[{ node: "TodasMsgFormatada", type: "main", index: 0 }]]
    },
    "TodasMsgFormatada": {
      main: [[{ node: "Agente Hospedagem", type: "main", index: 0 }]]
    },
    "Agente Hospedagem": {
      main: [[{ node: "SalvaResposta", type: "main", index: 0 }]]
    },
    "SalvaResposta": {
      main: [[{ node: "EnviaMsg", type: "main", index: 0 }]]
    },
    "EnviaMsg": {
      main: [[{ node: "DesbloqueiAgente", type: "main", index: 0 }]]
    },
    "OpenAI Chat Model": {
      ai_languageModel: [[{ node: "Agente Hospedagem", type: "ai_languageModel", index: 0 }]]
    },

    "Agendamento: Check-in 24h": {
      main: [[{ node: "Busca: Reservas de Amanhã", type: "main", index: 0 }]]
    },
    "Busca: Reservas de Amanhã": {
      main: [[{ node: "Filtra: Check-ins Amanhã", type: "main", index: 0 }]]
    },
    "Filtra: Check-ins Amanhã": {
      main: [[{ node: "Loop: Check-ins", type: "main", index: 0 }]]
    },
    "Loop: Check-ins": {
      main: [
        [{ node: "Envia: Lembrete Check-in", type: "main", index: 0 }],
        [{ node: "Fim: Check-ins", type: "main", index: 0 }]
      ]
    },
    "Envia: Lembrete Check-in": {
      main: [[{ node: "Loop: Check-ins", type: "main", index: 0 }]]
    },

    "Agendamento: NPS Checkout": {
      main: [[{ node: "Busca: Checkouts de Hoje", type: "main", index: 0 }]]
    },
    "Busca: Checkouts de Hoje": {
      main: [[{ node: "Filtra: Checkouts de Hoje", type: "main", index: 0 }]]
    },
    "Filtra: Checkouts de Hoje": {
      main: [[{ node: "Loop: NPS", type: "main", index: 0 }]]
    },
    "Loop: NPS": {
      main: [
        [{ node: "Envia: NPS", type: "main", index: 0 }],
        [{ node: "Fim: NPS", type: "main", index: 0 }]
      ]
    },
    "Envia: NPS": {
      main: [[{ node: "Loop: NPS", type: "main", index: 0 }]]
    }
  },

  settings: {
    executionOrder: "v1",
    callerPolicy: "workflowsFromSameOwner",
    availableInMCP: false
  }
};

// ── Criar o workflow via API ──────────────────────────────
const https = require('https');

function postJSON(url, apiKey, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch(e) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('🚀 Criando workflow no n8n...');
  try {
    const result = await postJSON(
      `${N8N_URL}/api/v1/workflows`,
      N8N_KEY,
      workflow
    );
    if (result.status === 200 || result.status === 201) {
      console.log('✅ Workflow criado com sucesso!');
      console.log('   ID:', result.data.id);
      console.log('   Nome:', result.data.name);
      console.log('   URL:', `${N8N_URL}/workflow/${result.data.id}`);
      console.log('\n📌 Webhook URL:');
      console.log('   https://hook.ieneassessoria.com.br/webhook/iene_hospedagem');
    } else {
      console.error('❌ Erro ao criar workflow. Status:', result.status);
      console.error(JSON.stringify(result.data, null, 2));
    }
  } catch(err) {
    console.error('❌ Erro de conexão:', err.message);
  }
})();
