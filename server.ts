import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Dedicated Accounting AI instance
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 24/7 Dedicated Accounting & Tax AI Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    if (!ai) {
      // Offline/demo fallback if API key is not present in local test
      return res.json({
        reply: `[WorldContábil IA - Modo Especialista]: Recebi sua consulta sobre "${message.slice(0, 50)}...". Com base nas Normas Brasileiras de Contabilidade (NBC TG / CPC) e legislação tributária vigente, recomendamos analisar o regime tributário e os lançamentos de partidas dobradas. Como o ambiente de demonstração está sem chave direta, consulte o fórum técnico ou ative a chave no painel.`,
        suggestedNorms: ['NBC TG 1000', 'CPC 00 (R2)', 'Lei 11.638/07'],
      });
    }

    const systemInstruction = `Você é o Consultor Técnico Especialista e Suporte 24h da plataforma WorldContábil (Mundo Contábil).
Seu objetivo é ajudar contadores, auditores, empresários e estudantes universitários de contabilidade com:
1. Normas Brasileiras de Contabilidade (NBC TG, NBC TSP, NBC PG) e pronunciamentos técnicos do CPC / IFRS.
2. Legislação tributária brasileira (Simples Nacional, Lucro Presumido, Lucro Real, IRPF/IRPJ, PIS/COFINS, ICMS/ISS, Reforma Tributária - IBS/CBS).
3. Elaboração e análise de demonstrações financeiras (Balanço Patrimonial, DRE, DFC, DMPL, DVA).
4. Práticas de Contabilidade Consultiva, BPO Financeiro e Valuation.
5. Alertas de conformidade fiscal e auditoria de movimentações suspeitas.

Mantenha um tom profissional, acolhedor, fundamentado e prático. Quando oportuno, mencione os artigos, normas CPC ou leis relevantes (ex: Lei 6.404/76, CPC 00, etc.). Responda em Português do Brasil.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [
        {
          text: context
            ? `[Contexto da tela: ${context}]\n\nPergunta do usuário: ${message}`
            : message,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply: response.text || 'Sem resposta do assistente.',
    });
  } catch (error: any) {
    console.error('Erro na IA Contábil:', error);
    res.status(500).json({
      error: 'Falha ao processar resposta com a IA Contábil.',
      details: error?.message || String(error),
    });
  }
});

// Banking Webhook simulator endpoint for Suspicious Activity Alerts
app.post('/api/banking/simulate-webhook', (req, res) => {
  const { bankId, amount, type, counterparty } = req.body;
  const isSuspicious = amount > 50000 || type === 'PIX_NOTURNO_ATIPICO';
  
  res.json({
    status: 'received',
    transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    isSuspicious,
    alertLevel: isSuspicious ? 'HIGH' : 'NORMAL',
    auditMessage: isSuspicious
      ? `Alerta COAF/Compliance: Transação atípica de R$ ${Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} detectada para ${counterparty || 'Desconhecido'}.`
      : 'Transação dentro dos padrões habituais de conciliação bancária.',
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WorldContábil Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
