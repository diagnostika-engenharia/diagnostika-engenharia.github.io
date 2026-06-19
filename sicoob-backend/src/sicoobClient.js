// Cliente das APIs do Sicoob.
//
// Responsabilidades:
//  - Em produção: autenticar via OAuth2 (client_credentials) usando mTLS
//    (certificado .pfx) e renovar o token automaticamente.
//  - No sandbox: usar o token fixo de teste, sem mTLS.
//  - Expor métodos de alto nível: getSaldo() e getExtrato().
//
// Toda a parte sensível (certificado, senha, client_secret) vive SOMENTE aqui,
// no servidor. O frontend nunca enxerga essas credenciais.
//
// Usamos o módulo `https` nativo (e não o fetch global) porque o mTLS exige
// apresentar um certificado cliente, o que o https.Agent suporta nativamente.

import fs from "node:fs";
import https from "node:https";
import { config, currentEndpoints } from "./config.js";

// Cache simples do token (o token do Sicoob dura ~300s).
let tokenCache = { value: null, expiresAt: 0 };

// Agente HTTPS com certificado cliente (mTLS) — só em produção.
let httpsAgent = null;
function getAgent() {
  if (config.isSandbox()) return undefined;
  if (httpsAgent) return httpsAgent;

  if (!config.pfxPath || !fs.existsSync(config.pfxPath)) {
    throw new Error(
      `Certificado .pfx não encontrado em "${config.pfxPath}". ` +
        `Configure SICOOB_PFX_PATH com o certificado emitido pelo Sicoob.`
    );
  }
  httpsAgent = new https.Agent({
    pfx: fs.readFileSync(config.pfxPath),
    passphrase: config.pfxPassword,
    keepAlive: true,
  });
  return httpsAgent;
}

// Helper HTTPS de baixo nível. Retorna { status, body } com body já parseado.
function httpsRequest(urlString, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request(
      {
        method,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        headers,
        agent: getAgent(),
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let payload;
          try {
            payload = data ? JSON.parse(data) : null;
          } catch {
            payload = data;
          }
          resolve({ status: res.statusCode, body: payload });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Obtém um token de acesso válido (produção). Renova quando expira.
async function getAccessToken() {
  if (config.isSandbox()) {
    if (!config.sandboxToken) {
      throw new Error(
        "SICOOB_SANDBOX_TOKEN não configurado. Pegue o token de teste em developers.sicoob.com.br."
      );
    }
    return config.sandboxToken;
  }

  const now = Date.now();
  if (tokenCache.value && now < tokenCache.expiresAt) {
    return tokenCache.value;
  }

  const tokenUrl = currentEndpoints().token;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.clientId,
    scope: config.scopes,
  }).toString();

  // mTLS: o certificado cliente é apresentado pelo agente HTTPS (getAgent()).
  const { status, body: data } = await httpsRequest(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body),
    },
    body,
  });

  if (status < 200 || status >= 300 || !data?.access_token) {
    throw new Error(`Falha ao obter token Sicoob (${status}): ${JSON.stringify(data)}`);
  }

  const ttlMs = (Number(data.expires_in || 300) - 30) * 1000; // margem de 30s
  tokenCache = { value: data.access_token, expiresAt: now + ttlMs };
  return data.access_token;
}

// Chamada genérica autenticada à API de Conta Corrente.
async function apiGet(path, query = {}) {
  const token = await getAccessToken();
  const base = currentEndpoints().contaCorrente;
  const url = new URL(base + path);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }

  const headers = { Authorization: `Bearer ${token}` };
  // O header client_id é exigido pelo gateway do Sicoob.
  const clientId = config.isSandbox() ? config.sandboxClientId : config.clientId;
  if (clientId) headers.client_id = clientId;

  const { status, body } = await httpsRequest(url.toString(), { method: "GET", headers });
  if (status < 200 || status >= 300) {
    const err = new Error(`Sicoob respondeu ${status}`);
    err.status = status;
    err.payload = body;
    throw err;
  }
  return body;
}

// ---------------------------------------------------------------------------
// Métodos de alto nível
// ---------------------------------------------------------------------------

export function getSaldo() {
  // GET /saldo?numeroContaCorrente=...
  return apiGet("/saldo", { numeroContaCorrente: config.conta });
}

// Extrato por mês/ano, com intervalo de dias opcional.
// Caminho conforme a API v4: /extrato/{mes}/{ano}
export function getExtrato({ mes, ano, diaInicial, diaFinal } = {}) {
  if (!mes || !ano) {
    throw new Error("Informe mes e ano para o extrato (ex.: mes=6, ano=2026).");
  }
  return apiGet(`/extrato/${mes}/${ano}`, {
    diaInicial,
    diaFinal,
    numeroContaCorrente: config.conta,
    agruparCNAB: false,
  });
}

export const sicoob = { getSaldo, getExtrato, _getAccessToken: getAccessToken };
