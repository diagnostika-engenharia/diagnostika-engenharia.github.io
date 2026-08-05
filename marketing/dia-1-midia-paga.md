# Dia 1 de mídia paga — copy pronto + orçamento

Plano executável no dia 1 pra ligar Meta Ads + Google Ads nos 7 prédios de prioridade A. Todos os anúncios apontam para a landing SEO do prédio (`/condominio/[slug].html`), que já tem UTM correto e leva ao form pré-preenchido.

Custo total dia 1: **R$ 220/dia** (R$ 6.600/mês). Piloto de 15 dias antes de escalar.

## Pré-requisitos (antes de subir os anúncios)

- [ ] Rodar `setup-supabase.sql` no Supabase (destrava as colunas de rastreio).
- [ ] Merge do PR e deploy do GitHub Pages ativo.
- [ ] Abrir e testar cada uma das 7 landings A (confirma que carregam e o form pré-preenche).
- [ ] Meta Business Manager criado com Pixel instalado no domínio.
- [ ] Google Ads conta com conversion tracking apontando pro evento "solicitacao_enviada".
- [ ] Cartão de crédito com R$ 6.600 de limite mensal disponível (ou orçamento fracionado).

---

## Estrutura de campanhas

**7 campanhas Meta + 2 campanhas Google Ads (uma long-tail por prédio, uma regional).**

### Convenção de nomes (importante para rastreio)
- Meta campanha: `META-CPS001-Alenza-Cambui`
- Meta ad set: `META-CPS001-500m-25a55`
- Meta anúncio: `META-CPS001-v1a-story`
- Google campanha: `GADS-Predio-Especifico` e `GADS-Regional-Campinas`
- URL de destino sempre a landing do prédio, que já tem UTM correto embutido.

---

## Meta Ads — 7 campanhas por prédio A

### Segmentação padrão (aplicar em todos os prédios A, ajustar raio)
- **Local:** raio 500m ao redor do endereço do prédio (raio 1km para os de médio padrão pra ganhar volume).
- **Idade:** 25–55 (para MCMV/médio, focar 25–40; alto padrão, focar 32–52).
- **Comportamento:** "Mudou-se recentemente" (últimos 12 meses).
- **Interesses:** Reforma residencial, Decoração de interiores, Arquitetura, Home & garden.
- **Exclusões:** pixel de conversão dos últimos 30 dias.
- **Colocações:** Feed + Reels + Stories (Instagram principal, Facebook secundário).
- **Otimização:** Conversões → evento "Landing view".
- **Orçamento:** R$ 20/dia por prédio (7 × R$ 20 = R$ 140/dia em Meta).

### CPS001 — Alenza Cambuí (alto padrão · Rua Dr. Emílio Ribas 314)

**V1A — reconhecimento (Story vertical 1080x1920)**
```
Título:    Morador do Alenza Cambuí?
Corpo:     Sua reforma no Cambuí precisa de ART antes do síndico liberar.
           Emissão em 24h, engenheiro CREA-SP, pagamento por Pix.
CTA:       Saiba mais
URL:       https://diagnostika-engenharia.github.io/condominio/alenza-cambui.html
```

**V1B — urgência (Feed 1080x1080)**
```
Título:    Sua obra pode ser embargada.
Corpo:     Reforma no Alenza Cambuí sem ART? O síndico pode embargar
           e a prefeitura pode multar. Diagnóstika emite em 24h.
CTA:       Solicitar orçamento
URL:       https://diagnostika-engenharia.github.io/condominio/alenza-cambui.html
```

### CPS002 — Cyrela Haus Nova Campinas (alto padrão · 85 unidades · Rua Dr. Antônio Arruda Camargo 225)

Volume pequeno (só 85 unidades), foco em qualidade do lead. Orçamento reduzido: R$ 10/dia.

**V1A — pertencimento**
```
Título:    Você mora no Haus Nova Campinas?
Corpo:     Antes de reformar seu apto no Haus, tenha sua ART. Documento
           que o síndico exige, emitido por engenheiro CREA-SP em 24h.
CTA:       Ver como funciona
URL:       https://diagnostika-engenharia.github.io/condominio/cyrela-haus-nova-campinas.html
```

### CPS004 — Hub Cambuí (uso misto · Rua Coronel Quirino 982)

Perfil jovem-profissional, ativo no Instagram.

**V1A — direto**
```
Título:    Reforma no Hub Cambuí?
Corpo:     Diagnóstika emite sua ART em 24h. Sem visita, sem burocracia,
           sem sair de casa. Aceita pelo síndico. R$ 350 no Pix.
CTA:       Solicitar minha ART
URL:       https://diagnostika-engenharia.github.io/condominio/hub-cambui.html
```

### CPS005 — Una Proença (médio padrão · Rua Serra Dourada 101, Jardim Proença)

Aptos compactos (47-55m²), primeiro imóvel, orçamento sensível.

**V1A — solução**
```
Título:    Moradores do Una Proença
Corpo:     Sua reforma sem dor de cabeça começa com a ART.
           Diagnóstika emite em 24h por Pix. Já preenchemos o
           nome do prédio no formulário pra você.
CTA:       Solicitar agora
URL:       https://diagnostika-engenharia.github.io/condominio/una-proenca.html
```

### CPS007 — Sensia Parque Prado (médio · Rua Tabelião Agnaldo Xavier de Souza 121)

**V1A**
```
Título:    Reforma no Sensia Parque Prado
Corpo:     Vai gourmetizar a varanda? Trocar planejados? Sem ART o
           síndico embarga a obra. Diagnóstika emite em 24h.
CTA:       Como funciona
URL:       https://diagnostika-engenharia.github.io/condominio/sensia-parque-prado.html
```

### CPS008 — Sirius Patriani (alto padrão · Av. Aquidaban 130, Centro)

Prédio mais alto de Campinas, studios 46m², muitos investidores. **Segmentação especial:** incluir "aluguel" nos interesses porque muitos inquilinos reformam.

**V1A**
```
Título:    Você aluga ou é dono no Sirius Patriani?
Corpo:     Qualquer reforma no seu studio no Sirius precisa de ART.
           Emissão em 24h, engenheiro CREA-SP, Pix. R$ 350 fixo.
CTA:       Solicitar
URL:       https://diagnostika-engenharia.github.io/condominio/sirius-patriani.html
```

### PLN001 — Città Di Módena — Paulínia (médio)

Paulínia tem menos concorrência publicitária, CPC deve ser 30-40% mais barato.

**V1A**
```
Título:    Moradores do Città di Módena — Paulínia
Corpo:     Antes da reforma, a ART. Documento que o síndico exige,
           emitido em 24h por engenheiro CREA-SP. R$ 350 no Pix.
CTA:       Solicitar minha ART
URL:       https://diagnostika-engenharia.github.io/condominio/citta-di-modena.html
```

---

## Google Ads — 2 campanhas

### Campanha 1 — Long-tail por prédio (rede de pesquisa)

Uma campanha só, com 7 grupos de anúncios (um por prédio A). Palavras-chave em correspondência de frase.

**Orçamento:** R$ 50/dia total.

#### Grupo CPS001 — Alenza Cambuí
Palavras-chave:
```
"ART Alenza Cambui"
"ART reforma Alenza Cambui"
"documento reforma Alenza Cambui"
"engenheiro responsavel Alenza Cambui"
```
Anúncio:
```
Título 1:      ART Alenza Cambuí — Diagnóstika
Título 2:      Emissão em 24h · Engenheiro CREA-SP
Título 3:      R$ 350 · Pagamento por Pix
Descrição 1:   Solicite sua ART de reforma para o Alenza Cambuí em
              3 minutos. Aceita pelo síndico, entrega por WhatsApp.
Descrição 2:   Sem burocracia. Sem visita técnica. Diagnóstika
              Engenharia, aqui em Campinas.
URL final:     https://diagnostika-engenharia.github.io/condominio/alenza-cambui.html
```

Repetir estrutura pra os outros 6 prédios A trocando o nome no template.

### Campanha 2 — Regional Campinas/RMC (rede de pesquisa)

Cobre buscas genéricas de moradores que não citam o prédio.

**Orçamento:** R$ 30/dia.

Palavras-chave:
```
"ART reforma Campinas"
"ART reforma apartamento Campinas"
"documento obra condominio Campinas"
"engenheiro responsavel reforma Campinas"
"ART reforma Valinhos"
"ART reforma Paulinia"
"ART Vinhedo apartamento"
"NBR 16280 reforma Campinas"
"emissao ART CREA Campinas"
```
Anúncio:
```
Título 1:      ART Reforma Apartamento Campinas
Título 2:      Emissão em 24h · Preço fixo R$ 350
Título 3:      Diagnóstika Engenharia · Pix aceito
Descrição 1:   Documento exigido pelo síndico antes de qualquer obra
              em apto. Atendemos toda RMC Campinas.
Descrição 2:   Solicite online. Sem visita técnica. Receba por WhatsApp
              em até 48h. Engenheiro CREA-SP.
URL final:     https://diagnostika-engenharia.github.io/solicitar-art.html?src=google-generico
```

---

## Orçamento consolidado

| Canal | Item | R$/dia | R$/mês |
|---|---|---:|---:|
| Meta | 7 prédios × R$ 20 (Haus reduzido a R$ 10) | 140 | 4.200 |
| Google | Long-tail por prédio | 50 | 1.500 |
| Google | Regional RMC | 30 | 900 |
| **Total** | | **220** | **6.600** |

## KPIs esperados (baseline realista pilot de 15 dias)

| Métrica | Meta 15d | Meta 30d |
|---|---:|---:|
| Impressões totais | 60k | 150k |
| Cliques em landing | 900 (1,5% CTR) | 2.400 |
| Inícios de solicitação | 90 (10% de landing) | 250 |
| ART pagas | 27 (30% de inícios) | 80 |
| CAC médio | R$ 122 (R$ 3.300 / 27) | R$ 82 |
| Ticket médio | R$ 350 | R$ 350 |
| Payback | 1º ART | 1º ART |

Cuidado: os primeiros 15 dias tendem a ter CAC pior (aprendizado do pixel, otimização de audiência). A partir do dia 20 o custo cai 30-40% com criativos vencedores identificados.

## Rotina operacional

- **Manhã (5 min):** olhar dashboard `/dashboard-marketing.html` → KPI "ART hoje".
- **Semana (15 min):** ver tabela "Por canal" — qual `src` está pior CAC. Se algum criativo estourou R$ 200 CAC, pausar e testar variante.
- **Quinzena (30 min):** revisar geografia — algum bairro converte 2× melhor? Aumenta budget lá. Bairro sem conversão em 15 dias → cortar.
- **Mês (1h):** dobrar o orçamento nos 2 prédios com melhor conversão; cortar o pior; abrir 2 novos prédios do CSV com prioridade B.

## Escalar depois do pilot

Se o pilot bate CAC < R$ 100 no dia 20:
- Dobrar orçamento pros 3 melhores prédios (R$ 40/dia cada).
- Abrir Meta Ads pros 30 prédios de prioridade B (R$ 5/dia cada, orçamento total +R$ 150/dia).
- Chegar em ~R$ 400/dia = R$ 12k/mês → capacidade de 150 ART/mês só de mídia paga.
- Combinado com programa de embaixadores (target 300 ART/mês) → **20 ART/dia**.

## Códigos de UTM ativos (para conferência no dashboard)

- `src=meta` — todos os anúncios Meta (subdividir por prédio via `p=`)
- `src=google-predio` — Google long-tail por prédio (URL da landing já tem)
- `src=google-generico` — Google regional (aponta direto para form)
- `src=seo-landing` — tráfego orgânico via landing SEO
- `src=form-art` — tráfego direto ao form (sem landing intermediária)

O dashboard agrupa por `origem`, então filtrar performance por canal é imediato.
