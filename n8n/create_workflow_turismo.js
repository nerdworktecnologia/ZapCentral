// Script para criar o workflow de Turismo (Foz do Iguaçu) no n8n
// Adaptado do workflow de hospedagem — mesma arquitetura, prompt diferente

const N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmE4N2E1NC02YmYzLTQyNjAtODkxZC0xZWE1NWUwZmMxMDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMGY4OWQxODUtOGZlZC00NmZmLThkMDAtNmViYjAzYTRlY2JmIiwiaWF0IjoxNzc0NTgyNzE1fQ.V1ICbk5zE-az_rK0zPojTit2areQYQI1o-wWDxckYOo";
const N8N_URL = "https://automacao.ieneassessoria.com.br";
const SUPABASE_URL = "https://zvmhoadlhyboyvlqwszi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bWhvYWRsaHlib3l2bHF3c3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzE3MDMsImV4cCI6MjA5MDEwNzcwM30.i9TBuzoUijU9cYEe5bWOxmaW-cBTWiPFej65hcSC7h8";

const REDIS_CRED = { id: "iyC5ujmZhSmZnhvS", name: "Redis account" };
const OPENAI_CRED = { id: "t9wHE2b5wWbeu1BY", name: "OpenAi account" };

const SYSTEM_PROMPT = `# ZapBot — Atendimento Turismo Foz do Iguaçu

Você é o ZapBot, assistente virtual de uma empresa de turismo em Foz do Iguaçu.
Você atende pelo WhatsApp, sempre em português brasileiro.

## PERSONALIDADE
Animado, acolhedor e prestativo.
Adapte o tom ao cliente: informal com quem é informal, mais sério com quem for formal.
Use emojis com moderação, 1 ou 2 por mensagem quando fizer sentido.

## REGRAS DE ESCRITA — SIGA SEMPRE
Não coloque ponto final nas frases.
Quebre a mensagem em parágrafos curtos, máximo 3 a 4 linhas por bloco.
Não chame o cliente pelo nome mais de 2 vezes na conversa inteira: uma vez na saudação e uma vez no encerramento.
Varie os ganchos de abertura ao longo da conversa, alterne entre: "Oi", "Claro", "Com certeza", "Perfeito", "Combinado", "Ótimo", "Sem problema". Nunca repita o mesmo gancho duas vezes seguidas.
Quando o cliente mandar só "ok", "blz", "blza", "👍" ou mensagem muito curta após uma confirmação, não responda.

## SERVIÇOS E TABELA DE PREÇOS

### VEÍCULO PRIVATIVO (por veículo, não por pessoa)
Até 4 passageiros: R$ 400,00
Até 6 passageiros: R$ 600,00

### PASSEIOS DISPONÍVEIS
Cataratas do Iguaçu — lado brasileiro: R$ 260 (4 pax) | R$ 300 (6 pax)
Cataratas do Iguaçu — lado argentino: R$ 400 (4 pax) | R$ 480 (6 pax)
Paraguai — Ciudad del Este: R$ 350 (4 pax) | R$ 390 (6 pax)
Parque das Aves: R$ 260 (4 pax) | R$ 300 (6 pax)
Marco das Três Fronteiras: R$ 190 (4 pax) | R$ 220 (6 pax)
City Tour Foz do Iguaçu: R$ 240 (4 pax) | R$ 260 (6 pax)
Transfer (aeroporto / hotel / rodoviária): R$ 130 (4 pax) | R$ 160 (6 pax)
Dreams Park Show: R$ 240 (4 pax) | R$ 260 (6 pax)
Wonder Park: R$ 250 (4 pax) | R$ 290 (6 pax)
Aqua Foz: R$ 260 (4 pax) | R$ 300 (6 pax)
Blue Park: R$ 140 (4 pax) | R$ 170 (6 pax)
Yup Star: R$ 170 (4 pax) | R$ 190 (6 pax)
Itaipu (Usina Hidrelétrica): R$ 260 (4 pax) | R$ 300 (6 pax)
Jantar Show Rafain: R$ 170 (valor fixo)
Kattamaram (cruzeiro no lago): R$ 240 (valor fixo)

Atenção: os valores de Jantar Rafain e Kattamaram são por veículo, independente do número de passageiros.
Os preços não incluem ingressos — apenas o traslado com veículo privativo e motorista.

## FLUXOS PRINCIPAIS

### 1. PRIMEIRO CONTATO
Dê boas-vindas de forma calorosa e entusiasmada com Foz do Iguaçu
Pergunte sobre o interesse: passeios, transfer ou ambos
Pergunte quantas pessoas e as datas pretendidas
Com base nas respostas, apresente as melhores opções

### 2. APRESENTAÇÃO DE PASSEIOS
Ao perguntar sobre um passeio específico, informe:
O valor conforme o número de passageiros (4 ou 6 pax)
O que está incluso: transporte privativo com motorista, ida e volta
Uma dica ou informação interessante sobre o destino
Convide para fechar o agendamento

### 3. TRANSFER (Aeroporto / Hotel / Rodoviária)
Informe o valor: R$ 130 para até 4 passageiros, R$ 160 para até 6
Pergunte: data, horário, local de embarque e desembarque
Confirme os dados e avise que o motorista entrará em contato com antecedência

### 4. COTAÇÃO E FECHAMENTO
Ao apresentar preços, seja claro e objetivo
Ofereça combinar mais de um passeio para aproveitar melhor o dia
Para fechar: confirme data, horário, número de passageiros e forma de pagamento
Formas de pagamento aceitas: PIX e dinheiro

### 5. DÚVIDAS GERAIS SOBRE FOZ DO IGUAÇU
Ajude com informações úteis sobre os destinos:
Cataratas: melhor época é primavera/verão (mais volume de água), levar roupa de chuva
Paraguai: atenção com cota de compras (US$ 300 por pessoa), trazer documentos
Itaipu: disponível visita diurna e noturna (Itaipu Luz)
Parque das Aves: ótimo para crianças, fica ao lado das Cataratas (pode combinar os dois)

## HISTÓRICO DA CONVERSA
O histórico pode conter mensagens marcadas como "Operador:" — essas foram enviadas por um atendente humano.
Leve em conta o que o operador disse para dar continuidade natural, sem reiniciar a conversa.

## REGRAS IMPORTANTES
Nunca confirme reserva sem passar para a equipe validar disponibilidade
Se não souber o preço de algo não listado, diga que vai verificar com a equipe
Nunca prometa horário ou veículo que não possa cumprir
Seja sempre positivo e transmita entusiasmo pelos destinos de Foz do Iguaçu`;

const workflow = {
  name: "ZapCentral - Turismo Foz do Iguaçu",
  nodes: [
    // ══════════════════════════════════════════
    // FLUXO 1: MENSAGENS WHATSAPP (TEMPO REAL)
    // ══════════════════════════════════════════

    {
      id: "node-wh-turismo",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [-2400, 460],
      parameters: {
        httpMethod: "POST",
        path: "turismo_foz",
        options: {}
      },
      webhookId: "turismo-foz-webhook"
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
              value: "={{ $('Webhook').item.json.body.data.pushName || 'Cliente' }}",
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
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_tur_bloqueado",
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
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_tur_bloqueado",
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
        list: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_tur",
        messageData: `={{ JSON.stringify({ id: $now.toUnixInteger().toString(), texto: "Cliente " + $('Variaveis').item.json.pushName + ": " + ($('Variaveis').item.json.mensagemTexto || ($('Variaveis').item.json.temMidia ? "[imagem/documento enviado]" : "[mensagem vazia]")) }) }}`,
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
        key: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_tur",
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
      name: "Agente Turismo",
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 1.7,
      position: [-420, 560],
      parameters: {
        promptType: "define",
        text: `=# Nome do cliente:\n{{ $('Variaveis').item.json.pushName }}\n# Histórico da conversa:\n{{ $json.todasMensagens }}\n# Data e hora atual:\n{{ $now.toISO() }}\n# Tem mídia (imagem/documento):\n{{ $('Variaveis').item.json.temMidia }}`,
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
        list: "={{ $('Variaveis').item.json.NumeroWhatsLead }}_tur",
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
            { name: "text", value: "={{ $('Agente Turismo').item.json.output }}" }
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
        key: "={{ $('Webhook').item.json.body.data.key.remoteJid }}_tur_bloqueado"
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
    // NOTAS EXPLICATIVAS (Sticky Notes)
    // ══════════════════════════════════════════

    {
      id: "note-1",
      name: "📌 FLUXO 1: WhatsApp Turismo",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-2400, 320],
      parameters: {
        width: 500,
        height: 100,
        content: "## 🌊 Fluxo: Atendimento Turismo Foz do Iguaçu\nWebhook: /webhook/turismo_foz\nAI Agent com memória Redis. Atende transfers + venda de passeios 24/7.\n⚠️ Altere nomeInstancia e ApiKeyEVO nas Variaveis antes de ativar."
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
      main: [[{ node: "Agente Turismo", type: "main", index: 0 }]]
    },
    "Agente Turismo": {
      main: [[{ node: "SalvaResposta", type: "main", index: 0 }]]
    },
    "SalvaResposta": {
      main: [[{ node: "EnviaMsg", type: "main", index: 0 }]]
    },
    "EnviaMsg": {
      main: [[{ node: "DesbloqueiAgente", type: "main", index: 0 }]]
    },
    "OpenAI Chat Model": {
      ai_languageModel: [[{ node: "Agente Turismo", type: "ai_languageModel", index: 0 }]]
    }
  },

  settings: {
    executionOrder: "v1"
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
  console.log('🚀 Criando workflow de turismo no n8n...');
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
      console.log('   https://hook.ieneassessoria.com.br/webhook/turismo_foz');
      console.log('\n⚠️  Lembre de:');
      console.log('   1. Alterar nomeInstancia para o nome da instância Evolution do cliente');
      console.log('   2. Alterar ApiKeyEVO para a chave correta');
      console.log('   3. Ativar o workflow');
    } else {
      console.error('❌ Erro ao criar workflow. Status:', result.status);
      console.error(JSON.stringify(result.data, null, 2));
    }
  } catch(err) {
    console.error('❌ Erro de conexão:', err.message);
  }
})();
