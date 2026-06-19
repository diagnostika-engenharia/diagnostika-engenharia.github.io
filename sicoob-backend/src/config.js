// Carrega e valida a configuração a partir das variáveis de ambiente.
// Usa o suporte nativo do Node (>=20.6) para arquivos .env via --env-file,
// mas também funciona se as variáveis vierem do ambiente do servidor.

const env = process.env;

function bool(v) {
  return String(v).toLowerCase() === "true";
}

export const config = {
  port: Number(env.PORT || 3333),
  corsOrigin: env.CORS_ORIGIN || "*",
  apiKey: env.API_KEY || "",

  sicoobEnv: (env.SICOOB_ENV || "sandbox").toLowerCase(),
  conta: env.SICOOB_CONTA || "",

  // Sandbox
  sandboxToken: env.SICOOB_SANDBOX_TOKEN || "",
  sandboxClientId: env.SICOOB_SANDBOX_CLIENT_ID || "",

  // Produção
  clientId: env.SICOOB_CLIENT_ID || "",
  scopes: env.SICOOB_SCOPES || "cco_saldo cco_extrato openid",
  pfxPath: env.SICOOB_PFX_PATH || "",
  pfxPassword: env.SICOOB_PFX_PASSWORD || "",

  isSandbox() {
    return this.sicoobEnv !== "producao";
  },
};

// Endpoints oficiais do Sicoob.
// IMPORTANTE: confirme os caminhos/versões no portal antes de ir a produção,
// pois o Sicoob pode atualizar as versões das APIs.
export const endpoints = {
  sandbox: {
    contaCorrente: "https://sandbox.sicoob.com.br/sicoob/sandbox/conta-corrente/v4",
    // No sandbox não há fluxo de token (usa-se o token fixo de teste).
    token: null,
  },
  producao: {
    contaCorrente: "https://api.sicoob.com.br/conta-corrente/v4",
    token: "https://auth.sicoob.com.br/auth/realms/cooperado/protocol/openid-connect/token",
  },
};

export function currentEndpoints() {
  return config.isSandbox() ? endpoints.sandbox : endpoints.producao;
}
