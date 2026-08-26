# Playbook — 20 ART por dia direto ao morador

Meta: 20 ART/dia úteis (~440/mês). Público: proprietário de apartamento em condomínio entregue nos últimos 24 meses na RMC Campinas.

## Tese central

O único canal que atinge 100% dos moradores de um prédio é o **grupo de WhatsApp do próprio condomínio**. Toda mídia paga é reforço. A operação é montada em torno de infiltrar mensagem confiável nesses grupos via programa de embaixadores + reforçar com anúncios geo-cercados por prédio.

Janela de conversão do morador: **30 a 90 dias após entrega das chaves**. Antes disso, ainda não decidiu reformar. Depois disso, obra já começou (ou já foi embargada). Toda a estratégia é otimizada para essa janela.

Ponto de conversão: `/solicitar-art.html` (já pronto). Todo link, QR, criativo e mensagem aponta pra lá com UTM.

## Funil de conversão esperado

| Etapa | Volume mensal |
|-------|---------------|
| Impacto (impressões + posts em grupo) | 60.000 |
| Cliques na landing | 3.000 (5%) |
| Início da solicitação | 900 (30%) |
| ART emitida e paga | 440 (49%) |
| **ART/dia útil** | **20** |

## Pilha de canais por ROI

### 1. Programa Morador Embaixador (canal principal — 60% do volume)
- 1 morador por prédio alvo, paga comissão por ART emitida do prédio dele.
- Ele posta 1x/mês no grupo WhatsApp do condomínio.
- Custo por lead: R$50–100. LTV: R$400–2000 (ART simples + laudos posteriores).
- Detalhes em `embaixador.md`.

### 2. Meta Ads geo-cercado por prédio (25%)
- Raio 500m em torno de cada condomínio alvo.
- Público 25–55, "acabou de se mudar" + interesses reforma/decoração.
- Criativo menciona o nome do prédio explicitamente.
- Orçamento inicial: R$30/dia/prédio × 30 prédios prioritários = R$900/dia.
- CPC esperado Campinas: R$0,80–1,50. CAC alvo: R$40–70.

### 3. Google Ads long-tail (10%)
- Palavras-chave com nome do condomínio + intent alta ("ART reforma [prédio]", "documento reforma apartamento Campinas", "engenheiro responsável reforma RMC").
- Concorrência baixa, CPC R$0,50–2. CAC alvo: R$30–60.

### 4. SEO programático (5% inicial, cresce)
- 1 landing por condomínio, gerada por template a partir do CSV.
- Ranqueia em 2–4 semanas por serem termos long-tail sem concorrência.
- Custo marginal zero após template pronto.

### 5. QR na portaria (reforço offline)
- Parceria com zelador: comissão R$20/ART indicada.
- Adesivo A5 no mural de avisos + card no elevador.
- Rastreio via URL `/solicitar-art.html?src=portaria&p=[cod]`.

### 6. Loop de prova social (não é canal, é multiplicador)
- Cada ART emitida vira post no grupo do prédio via embaixador: "mais uma ART emitida no prédio, apto XXX".
- Cria FOMO. Depois de 3 ART no mesmo prédio, o quarto morador já sabe pra onde ir.

## Sequência de 90 dias

### Dias 1–15 — Infraestrutura
- Popular `condominios-rmc.csv` com 150 prédios prioritários (Habite-se prefeituras + ZAP + CBIC).
- Ajustar `/solicitar-art.html` para aceitar UTM (`?src=`, `?p=` — código do prédio) e persistir na base.
- Criar template de landing por prédio (`/condominio/[slug].html`).
- Setar WhatsApp Business com respostas automáticas: "Recebi seu contato do prédio X, mando o link em 30s".
- Abrir contas Meta Ads e Google Ads com pixel.

### Dias 15–45 — Ativação
- Recrutar 20 embaixadores (script em `embaixador.md`).
- Ligar Meta Ads em 30 prédios prioritários.
- Subir 30 landings SEO.
- Abordar 15 zeladores (adesivo QR).
- Meta ao final do dia 45: 5 ART/dia.

### Dias 45–90 — Escala
- Escalar para 60 embaixadores (dobrar a base).
- A/B test de criativo por prédio (foto do próprio condomínio no ad).
- Ligar retargeting.
- Ativar loop de prova social (post automático via embaixador a cada ART).
- Meta ao final do dia 90: **20 ART/dia**.

## Métricas a acompanhar (semanais)

- ART/dia (média móvel 7d)
- CAC por canal
- ART por prédio ativo (identifica prédios mortos vs. quentes)
- Taxa de resposta dos embaixadores (posts no mês / posts contratados)
- Cliques na landing por UTM

## Riscos e mitigação

- **Grupo de WhatsApp bane o embaixador por spam.** Mitigação: script conversacional, 1 post/mês no máximo, sempre após alguém do grupo mencionar reforma.
- **Prédio esgota (todos que iam reformar já reformaram).** Mitigação: monitorar ART/prédio; quando cair a zero por 60 dias, desalocar orçamento e mover pra prédio novo.
- **CREA muda regra de ART simplificada.** Mitigação: pipeline de 3 produtos adjacentes (laudo, vistoria, memorial) prontos para pivot.

## Recursos existentes que a operação usa

- `/solicitar-art.html` — página de conversão (Pix + formulário).
- `/index.html` — portal, precisa banner "Solicitar ART" no topo.
- Sistema financeiro já opera cobrança e comissão — usar mesmo backend para pagar embaixador.
