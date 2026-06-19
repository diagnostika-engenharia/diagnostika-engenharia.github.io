# Backend de integração Sicoob — protótipo

Ponte (backend) entre o **Sistema Financeiro** da Diagnóstika (que roda no
GitHub Pages, no navegador) e as **APIs do Sicoob**. Serve para puxar **saldo**
e **extrato** da conta corrente e dar base para **conciliação bancária**
automática.

## Por que precisa de um backend?

O Sistema Financeiro é um site estático (GitHub Pages) que roda só no navegador.
As APIs do Sicoob **não podem** ser chamadas direto do navegador porque:

1. **Exigem certificado digital (mTLS)** — um `.pfx` com chave privada em cada
   chamada. Isso não funciona no navegador e exporia o certificado.
2. **Têm `client_id`/segredos** que ficariam visíveis no código da página.
3. **Não permitem CORS** para uso direto em frontend.

Por isso existe esta ponte: o frontend chama **este backend**, e o backend fala
com o Sicoob guardando as credenciais com segurança.

```
Sistema Financeiro (GitHub Pages)
        │  GET /api/conta/extrato   (com X-API-Key)
        ▼
   Backend Sicoob (este projeto)   ←── guarda certificado .pfx + credenciais
        │  OAuth2 + mTLS
        ▼
        API Sicoob (saldo, extrato, …)
```

## Status deste protótipo

- ✅ Estrutura pronta para **Sandbox** e **produção** (basta trocar variáveis).
- ✅ Endpoints: `/health`, `/api/conta/saldo`, `/api/conta/extrato`.
- ✅ Autenticação OAuth2 + mTLS já implementada (módulo `https` nativo).
- ⚠️ **Falta**: gerar as credenciais reais no Sicoob (parte burocrática abaixo)
  e confirmar os caminhos/versões das APIs no portal oficial.

## Como rodar (Sandbox)

Requer Node.js 20+.

```bash
cd sicoob-backend
npm install
cp .env.example .env       # preencha SICOOB_SANDBOX_TOKEN e SICOOB_CONTA
node --env-file=.env src/server.js
```

Testar:

```bash
curl http://localhost:3333/health
curl -H "X-API-Key: SUA_CHAVE" "http://localhost:3333/api/conta/saldo"
curl -H "X-API-Key: SUA_CHAVE" "http://localhost:3333/api/conta/extrato?mes=6&ano=2026"
```

## Passo a passo para chegar a produção

### 1. Parte burocrática (vocês, com o Sicoob)
- Ter **conta PJ** no Sicoob.
- Acessar **https://developers.sicoob.com.br** e criar uma aplicação.
- Habilitar a(s) API(s) desejada(s): **Conta Corrente** (saldo/extrato),
  e se quiser depois **Pix**, **Cobrança/Boletos**, **Pagamentos**.
- Emitir o **certificado digital** e baixar o arquivo **`.pfx`** (guardar a senha).
- Anotar o **Client ID** e os **escopos** liberados.

### 2. Configurar o backend
- Copiar o `.pfx` para `sicoob-backend/certs/` (essa pasta é ignorada no git).
- No `.env`:
  - `SICOOB_ENV=producao`
  - `SICOOB_CLIENT_ID=...`
  - `SICOOB_PFX_PATH=./certs/seu-certificado.pfx`
  - `SICOOB_PFX_PASSWORD=...`
  - `SICOOB_CONTA=...`

### 3. Hospedar
Subir em qualquer host que rode Node e guarde arquivos com segurança
(Render, Railway, Fly.io, uma VM, etc.). Definir as variáveis de ambiente lá.
Apontar `CORS_ORIGIN` para `https://diagnostika-engenharia.github.io`.

### 4. Conectar o frontend
No Sistema Financeiro, chamar os endpoints deste backend (com o header
`X-API-Key`) e exibir saldo/extrato. A conciliação compara os lançamentos do
extrato com os lançamentos cadastrados no sistema.

## Segurança — importante

- **Nunca** versionar `.env`, `.pfx`, `.pem` ou `.key` (já no `.gitignore`).
- O `X-API-Key` é uma proteção mínima para o protótipo. Em produção, considere
  autenticação real (login/JWT) e restringir o backend por IP/origem.
- Comece **sempre** pelo Sandbox antes de tocar na conta real.

## Próximos passos sugeridos

- Persistir extrato em banco (histórico e conciliação).
- Adicionar Pix (recebimentos) e Cobrança (boletos = contas a receber).
- Regras de conciliação automática (casar extrato × lançamentos).
