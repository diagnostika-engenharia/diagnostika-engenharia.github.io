// Servidor da "ponte" entre o Sistema Financeiro (frontend) e o Sicoob.
//
// O frontend (GitHub Pages) chama ESTE backend, que por sua vez fala com o
// Sicoob de forma segura. Assim o certificado e as credenciais nunca saem do
// servidor.
//
// Rodar:  node --env-file=.env src/server.js
// (ou)    npm start   (após exportar as variáveis de ambiente)

import express from "express";
import { config } from "./config.js";
import { sicoob } from "./sicoobClient.js";

const app = express();
app.use(express.json());

// CORS mínimo — libera apenas a origem do frontend configurada.
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", config.corsOrigin);
  res.set("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Autenticação simples por chave (o frontend envia X-API-Key).
function requireApiKey(req, res, next) {
  if (!config.apiKey) return next(); // sem chave configurada = aberto (apenas dev)
  if (req.get("X-API-Key") === config.apiKey) return next();
  return res.status(401).json({ erro: "Não autorizado" });
}

// Healthcheck (não exige chave) — útil para saber se está no ar e em qual modo.
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    ambiente: config.isSandbox() ? "sandbox" : "producao",
    conta: config.conta ? "configurada" : "ausente",
  });
});

// Saldo da conta corrente.
app.get("/api/conta/saldo", requireApiKey, async (req, res) => {
  try {
    const saldo = await sicoob.getSaldo();
    res.json(saldo);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message, detalhe: e.payload });
  }
});

// Extrato. Ex.: /api/conta/extrato?mes=6&ano=2026&diaInicial=1&diaFinal=30
app.get("/api/conta/extrato", requireApiKey, async (req, res) => {
  try {
    const { mes, ano, diaInicial, diaFinal } = req.query;
    const extrato = await sicoob.getExtrato({ mes, ano, diaInicial, diaFinal });
    res.json(extrato);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message, detalhe: e.payload });
  }
});

app.listen(config.port, () => {
  const modo = config.isSandbox() ? "SANDBOX" : "PRODUÇÃO";
  console.log(`Backend Sicoob no ar em http://localhost:${config.port}  [${modo}]`);
});
