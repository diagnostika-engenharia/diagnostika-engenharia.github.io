# Plano de Aceleração — Emissão de ART Semiautomática
## Meta: 20 ART/dia (~440/mês) atendendo direto o morador na RMC Campinas

---

## Sumário executivo (1 página)

**O que estamos propondo:** transformar a Diagnóstika na primeira escolha para emissão de ART de reforma de apartamentos na Região Metropolitana de Campinas, atingindo **20 ART/dia úteis** em 90 dias, através de uma operação de captação **direta ao morador**, autônoma (sem depender de indicações ou de órgãos públicos) e escalável.

**Por que agora:** o volume de apartamentos entregues na RMC nos últimos 12-18 meses cria uma janela de conversão irrepetível. Cada morador de prédio recém entregue precisa de ART antes de reformar — é lei (NBR 16.280) e é exigência do síndico. Hoje eles resolvem via arquiteto (caro, demorado) ou não resolvem (ilegal, arriscado). Nossa proposta: **ART em 24-48h, 100% online, R$ 350 fixo, Pix**.

**Unit economics validado:**
- Receita por ART: R$ 350,00
- Custo variável (taxa CREA): R$ 108,39
- **Margem bruta por ART: R$ 241,61 (69%)**
- Meta 440 ART/mês → **Margem bruta mensal: R$ 106.308**

**Investimento necessário:** R$ 0 a R$ 6.600/mês (dependendo do modelo escolhido). Toda infraestrutura já está pronta (site, formulário, PIX, dashboard, 44 landings SEO). Custo de desenvolvimento afundado — só custo variável a partir daqui.

**Diferencial competitivo real** (após pesquisa dos concorrentes no Google): somos o único jogador com **base local em Campinas, preço publicado, 100% online** e especialização em morador de condomínio recém entregue. Sysbuild e Laudo ART são online mas nacionais (São Paulo capital); Comdominium, Cruzeiro Engenharia e D'Limas atendem Campinas mas exigem visita técnica e não publicam preço. Nossa posição de nicho é defensável, não a diferenciação genérica de "mais rápido, mais barato".

**Autonomia operacional:** os dados vêm de fontes públicas na internet, os leads vêm de canais que a gente controla, o funil roda sozinho — sem depender de síndico, prefeitura ou incorporadora.

**Risco principal:** o funil ainda não foi testado com volume. Recomendação: começar com **modelo orgânico (custo R$ 0)** por 30-60 dias pra validar taxas de conversão reais. Escalar com mídia paga só depois.

---

## 1. O Problema do Cliente

Você comprou um apartamento novo. Vai reformar antes de mudar. Toda instalação de móveis planejados, troca de piso, mudança de layout, ampliação de sacada exige **Anotação de Responsabilidade Técnica (ART)** do CREA — norma NBR 16.280.

**O que acontece se não tiver:**
- O síndico embarga a obra a qualquer momento
- A prefeitura pode multar em fiscalização
- Se der problema (infiltração no vizinho, dano estrutural), o morador responde civil e criminalmente
- Seguradora do condomínio nega cobertura

**Como o cliente resolve hoje:**
- Paga R$ 800-1.500 pro arquiteto emitir junto do projeto (caro)
- Contrata engenheiro por conta (~R$ 500-800, demora 5-10 dias, dor de cabeça)
- **Não emite e joga na sorte** (~60% dos casos, segundo dados do mercado)

**Nossa proposta ao cliente:**
- Preenche formulário online em 3 minutos
- Paga R$ 350 por Pix
- Recebe ART assinada por engenheiro CREA-SP no WhatsApp em 24-48h
- Entrega ao síndico, obra liberada

Preço 2× menor que o mercado, entrega 5× mais rápida, 100% online.

---

## 2. A Oportunidade de Mercado

**Público-alvo:** proprietários e inquilinos de apartamentos em condomínios entregues nos últimos 3-18 meses na Região Metropolitana de Campinas (RMC).

**Tamanho estimado:**
- ~15-20 condomínios entregues por trimestre na RMC (verticais + horizontais)
- ~150-300 unidades por condomínio em média
- **~3.000-6.000 novos apartamentos por trimestre**
- 70-80% dos moradores reformam nos primeiros 90 dias após chaves
- **Mercado potencial: ~2.500-4.500 ARTs por trimestre**

Nossa meta de 440/mês (~1.320/trimestre) representa **30-50% de share** desse mercado potencial. Ambicioso mas realista se formos o único player com proposta online-first e preço agressivo.

**Regiões prioritárias:**
1. **Campinas** — Cambuí, Nova Campinas, Parque Prado, Bosque, Jardim Proença (alto padrão + médio padrão)
2. **Paulínia** — Santa Terezinha, Morumbi (aqui a Diagnóstika já tem reputação forte)
3. **Hortolândia** — Jd das Colinas, região da Ponte Estaiada (aqui também temos reputação)
4. **Valinhos, Vinhedo, Sumaré, Indaiatuba** — mercados secundários

---

## 3. A Tese Central

**Onde está o dinheiro:** dentro dos grupos de WhatsApp dos próprios condomínios recém entregues. É onde o morador pergunta "quem tem indicação de engenheiro?" e recebe a resposta que decide a compra.

**A janela de conversão** vai de 30 a 90 dias após entrega das chaves. Nesse intervalo a intenção é 100% e o preço é secundário — o que importa é resolver rápido pra liberar a obra.

**Estratégia em 3 camadas:**

| Camada | Alcance | CAC estimado | Autonomia |
|---|---|---|---|
| Programa Morador Embaixador | 100% do prédio | R$ 60/ART | Precisa recrutar humano |
| SEO por prédio | ~5-10% do prédio | R$ 0 | Autônomo |
| Mídia paga geo-cercada | 30-50% do prédio | R$ 80-120 | Autônomo |

O elo comum: **cada canal aponta pra uma landing dedicada do prédio**, que aponta pro nosso formulário com o nome já preenchido. Menos atrito, mais conversão.

---

## 4. A Estratégia Autônoma (7 fontes de dados sem depender de ninguém)

### 4.1 Descoberta de prédios (scraping de fontes públicas)

Todo prédio novo é anunciado publicamente em algum lugar. Vamos raspar automaticamente:

- **Portais imobiliários** (ZAP, Viva Real, Chaves na Mão, Campinas na Planta): filtro "pronto para morar" e "em construção com entrega próxima"
- **Sites das incorporadoras** (Cyrela, Plaenge, Patriani, HM, MRV, Prado Gonçalves, Auten): páginas de empreendimentos entregues
- **Google Maps** (reviews recentes indicam prédio habitado)
- **Reclame Aqui** (reclamações de entrega expõem data + endereço)
- **Instagram** (perfis oficiais dos empreendimentos, hashtags)

Um script roda toda semana, atualiza automaticamente nossa planilha de prédios-alvo. Meta: chegar em **150-200 prédios ativos catalogados** sem esforço manual.

### 4.2 Descoberta de moradores (candidatos a embaixador)

- **Instagram por hashtag do prédio** (`#alenzacambui`, `#pontesteajada`): quem posta com essas tags mora ali
- **Instagram por localização** (feature "Locais" do próprio Instagram)
- **Comentários dos posts oficiais dos empreendimentos** (moradores felizes = candidatos)
- **LinkedIn** (busca "mora em Cambuí", cargos jovens-profissionais)
- **Facebook Groups por bairro** (posts públicos)

Extraímos usernames publicamente disponíveis. A abordagem é manual (10 min por candidato via WhatsApp) para não violar regras das plataformas. **Nada de spam automatizado.**

### 4.3 Descoberta de intenção (Google Alerts + Trends)

- **Google Alerts:** "reforma apartamento Campinas", "habite-se Campinas", "entrega chaves [nome do prédio]" — notifica em tempo real
- **Google Trends:** valida quais bairros têm pico de busca por reforma
- **Meta Ads Library:** vê o que os concorrentes (Habitíssimo, GetNinjas) estão anunciando pra copiar o que funciona

### 4.4 Presença orgânica (SEO)

**Já implementado no repositório:**
- 44 landings SEO, uma por prédio, com nome do prédio no título e H1
- Sitemap.xml + robots.txt
- Formulário que pré-preenche o nome do prédio quando vem pela landing
- Google indexa uma landing dessas em 2-4 semanas

Cada landing custa R$ 0 pra manter. Uma vez indexada, gera leads eternamente. **Meta:** 30-50 leads/mês orgânicos no dia 90.

### 4.5 Google Business Profile

- Perfil da Diagnóstika Engenharia no Google Maps
- Post diário com case (com autorização): "ART emitida hoje pra reforma no Cambuí"
- Área de atendimento configurada pras 7 cidades
- **Solicitar review a cada ART entregue** — cada review novo empurra o ranking local
- Custo: R$ 0. Retorno: 15-30% dos leads locais

### 4.6 Programa Morador Embaixador

**Tese:** o único jeito de chegar em 100% dos moradores de um prédio é via WhatsApp do próprio condomínio, e a única forma de entrar lá sem virar spam é ter 1 morador embaixador postando de vez em quando.

- Recruta 1 morador por prédio-alvo (via Instagram/LinkedIn scraping)
- Paga comissão **R$ 60 por ART emitida** vinda daquele prédio
- Ele posta 1×/mês no grupo com link personalizado
- **Meta:** 40-60 embaixadores ativos em 90 dias
- **Volume esperado:** 5-15 ART/embaixador/mês = 200-900 ART/mês

Motor principal da meta.

### 4.7 Mídia paga (opcional, escalada só após validar orgânico)

- **Meta Ads** geo-cercado raio 500m ao redor de cada prédio-alvo
- **Google Ads** long-tail ("ART reforma [nome do prédio]") + genérico ("ART Campinas")
- Orçamento: começa em **R$ 1.500/mês** (piloto) e escala pra R$ 6.600/mês só se CAC ficar abaixo de R$ 120 no piloto

---

## 5. Unit Economics (a matemática crua)

### Custo por ART

| Item | Valor |
|---|---:|
| Receita bruta | R$ 350,00 |
| Taxa CREA | (R$ 108,39) |
| **Margem bruta** | **R$ 241,61 (69%)** |
| Custos operacionais alocados (engenheiro, plataforma) | (R$ 40,00) |
| **Margem líquida operacional** | **R$ 201,61 (58%)** |

### Break-even por modelo de aquisição

| Canal | CAC esperado | Margem líquida/ART | Break-even mensal |
|---|---:|---:|---:|
| SEO orgânico | R$ 0 | R$ 201,61 | 0 ART (é lucro puro) |
| Embaixador | R$ 60 | R$ 141,61 | Depende do canal |
| Google Ads long-tail | R$ 40-60 | R$ 141-161 | Baixo |
| Meta Ads | R$ 80-120 | R$ 81-121 | Médio |
| Google genérico | R$ 100-150 | R$ 51-101 | Alto |

**Todo canal fica positivo.** O Meta Ads é o mais apertado no piloto (aprendizado do pixel eleva CAC nos primeiros 30 dias), mas sai bem depois.

### Cenários financeiros (mês a mês)

Assumindo mídia paga R$ 6.600/mês do dia 1 (cenário mais caro):

| Cenário | Mês 1 (ART/receita/margem/lucro) | Mês 2 | Mês 3 | Mês 6 |
|---|---|---|---|---|
| **Otimista** | 35 · R$ 12,2k · R$ 8,5k · **+R$ 1,9k** | 60 · R$ 21k · R$ 14,5k · **+R$ 7,9k** | 100 · R$ 35k · R$ 24,2k · **+R$ 17,6k** | 250 · R$ 87,5k · R$ 60,4k · **+R$ 53,8k** |
| **Realista** | 25 · R$ 8,7k · R$ 6,0k · **−R$ 0,6k** | 45 · R$ 15,7k · R$ 10,9k · **+R$ 4,3k** | 75 · R$ 26,2k · R$ 18,1k · **+R$ 11,5k** | 180 · R$ 63k · R$ 43,5k · **+R$ 36,9k** |
| **Pessimista** | 15 · R$ 5,2k · R$ 3,6k · **−R$ 3,0k** | 30 · R$ 10,5k · R$ 7,2k · **+R$ 0,6k** | 50 · R$ 17,5k · R$ 12,1k · **+R$ 5,5k** | 120 · R$ 42k · R$ 29k · **+R$ 22,4k** |

**No cenário pessimista, o prejuízo total do mês 1-2 é ~R$ 3k.** Pagável.

### Cenário "só orgânico" (R$ 0 de mídia)

| Métrica | Mês 3 | Mês 6 | Mês 12 |
|---|---:|---:|---:|
| ART/mês (SEO + embaixador) | 40 | 120 | 250 |
| Margem líquida mensal | R$ 8.064 | R$ 24.193 | R$ 50.403 |
| Custo mensal | R$ 0-500 | R$ 500-1.500 | R$ 1.500-3.000 |
| **Lucro operacional** | **R$ 7.564** | **R$ 22.693** | **R$ 47.403** |

Menor risco, crescimento mais lento, mas sem drawdown. Recomendado como fase 1.

### Meta em regime (dia 90+)

- **440 ART/mês** (20/dia útil)
- Receita bruta: **R$ 154.000/mês**
- Margem bruta: **R$ 106.308/mês**
- Custo mídia + embaixadores: ~R$ 15.000/mês
- Margem operacional: ~R$ 88.000/mês
- **Margem operacional anual: ~R$ 1.056.000**

---

## 6. Cronograma Executivo — 90 Dias

### Fase 1 — Fundação (Dias 1-15)

**Já feito** (código no PR #1):
- Playbook + estratégia documentada
- 44 landings SEO por prédio
- Formulário com captura de UTM (rastreio por canal/prédio/embaixador)
- Dashboard de conversão autenticado
- 7 pedidos LAI preenchidos (opcional agora)
- GitHub Action que regera landings automaticamente

**Falta fazer nesta fase:**
- [ ] Merge do PR + rodar SQL de setup no Supabase (30 min)
- [ ] Teste end-to-end real: fazer 1 solicitação, pagar Pix, conferir no banco (30 min)
- [ ] Setup Google Business Profile + primeira dose de reviews (2h)
- [ ] Escrever posts template pro GBP (1h)

**Marco:** infraestrutura ligada e testada.

### Fase 2 — Descoberta (Dias 15-30)

- [ ] Implementar scrapers dos 3 portais principais (ZAP, Viva Real, Campinas na Planta) + 5 incorporadoras
- [ ] Rodar 1a coleta — chegar em 100-150 prédios catalogados
- [ ] Rodar scraper Instagram por hashtag/local — descobrir 20-40 candidatos a embaixador
- [ ] Enviar propostas pra 20 candidatos a embaixador manualmente
- [ ] Meta: 5-10 embaixadores confirmados

**Marco:** operação começa a gerar leads sem esforço manual.

### Fase 3 — Ativação (Dias 30-60)

- [ ] Piloto Meta Ads R$ 1.500/mês (3 prédios A, R$ 15/dia cada)
- [ ] Piloto Google Ads R$ 500/mês (long-tail em 7 prédios A)
- [ ] Escalar programa embaixador pra 20-30 ativos
- [ ] Publicar 3 posts Instagram/semana
- [ ] Meta: 40 ART no mês (2/dia útil)

**Marco:** primeira validação de CAC real.

### Fase 4 — Escala (Dias 60-90)

- [ ] Se CAC < R$ 120: dobrar orçamento pros 3 melhores canais
- [ ] Escalar programa embaixador pra 60 ativos
- [ ] Abrir Meta Ads pros 30 prédios B
- [ ] YouTube Shorts (1 vídeo por prédio A)
- [ ] Meta: 20 ART/dia útil (440/mês)

**Marco:** meta atingida.

---

## 6.1 Metas Semanais — 24 semanas até meta plena

Uma curva realista de rampa. Semana útil = 5 dias. Base do cenário realista de recuperação de piloto, com transição progressiva de canais orgânicos → mistos → escala.

**Premissas fixas por ART:**
- Receita bruta: R$ 350,00
- Taxa CREA: R$ 108,39 (30,97%)
- Margem bruta: R$ 241,61 (69,03%)
- Custo operacional alocado (engenheiro + plataforma): R$ 40,00
- **Margem líquida operacional por ART: R$ 201,61**
- Comissão embaixador: R$ 60 (só quando aplicável — assumimos 60% das ART vêm via embaixador a partir do mês 2)

### Cenário Recomendado (Opção A → B → C progressivamente)

| Sem | Fase | ART/sem | Receita/sem | Custo mídia/sem | Comissão embaixador/sem | Custos ops fixos/sem | **Lucro/sem** | Lucro acum. |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **Mês 1 — Setup + primeiros leads (R$ 0 mídia)** ||||||||
| 1 | Deploy + testes | 0 | R$ 0 | R$ 0 | R$ 0 | R$ 115 | **−R$ 115** | −R$ 115 |
| 2 | 1os posts GBP + scraper | 2 | R$ 700 | R$ 0 | R$ 0 | R$ 115 | **+R$ 288** | +R$ 173 |
| 3 | SEO começa indexar | 8 | R$ 2.800 | R$ 0 | R$ 240 | R$ 115 | **+R$ 1.258** | +R$ 1.431 |
| 4 | 1os embaixadores ativos | 15 | R$ 5.250 | R$ 0 | R$ 540 | R$ 115 | **+R$ 2.369** | +R$ 3.800 |
| **Mês 1 total** ||**25**|**R$ 8.750**|**R$ 0**|**R$ 780**|**R$ 460**|**+R$ 3.800**||
| **Mês 2 — Piloto pago R$ 350/sem (Opção B) + escala embaixador** ||||||||
| 5 | Meta+Google piloto | 8 | R$ 2.800 | R$ 350 | R$ 288 | R$ 115 | **+R$ 859** | +R$ 4.659 |
| 6 | Learning phase Meta | 10 | R$ 3.500 | R$ 350 | R$ 360 | R$ 115 | **+R$ 1.191** | +R$ 5.850 |
| 7 | 1a otimização | 12 | R$ 4.200 | R$ 350 | R$ 432 | R$ 115 | **+R$ 1.523** | +R$ 7.373 |
| 8 | Ads começam converter | 15 | R$ 5.250 | R$ 350 | R$ 540 | R$ 115 | **+R$ 1.847** | +R$ 9.220 |
| **Mês 2 total** ||**45**|**R$ 15.750**|**R$ 1.400**|**R$ 1.620**|**R$ 460**|**+R$ 7.417**||
| **Mês 3 — CAC estabiliza, embaixador em regime** ||||||||
| 9 | Escala orgânico | 15 | R$ 5.250 | R$ 350 | R$ 540 | R$ 115 | **+R$ 1.716** | +R$ 10.936 |
| 10 | 20 embaixadores | 18 | R$ 6.300 | R$ 350 | R$ 648 | R$ 115 | **+R$ 2.194** | +R$ 13.130 |
| 11 | Novos prédios da coleta | 20 | R$ 7.000 | R$ 350 | R$ 720 | R$ 115 | **+R$ 2.427** | +R$ 15.557 |
| 12-13 | Base saudável | 22 | R$ 7.700 | R$ 350 | R$ 792 | R$ 115 | **+R$ 2.639** | +R$ 18.196 |
| **Mês 3 total** ||**75**|**R$ 26.250**|**R$ 1.400**|**R$ 2.700**|**R$ 460**|**+R$ 11.360**||
| **Mês 4 — Escalar orçamento (Opção C: R$ 1.650/sem)** ||||||||
| 14 | Meta+Google full | 35 | R$ 12.250 | R$ 1.650 | R$ 1.260 | R$ 115 | **+R$ 3.031** | +R$ 21.227 |
| 15 | Retargeting ativo | 40 | R$ 14.000 | R$ 1.650 | R$ 1.440 | R$ 115 | **+R$ 3.860** | +R$ 25.087 |
| 16 | Prédios B entram | 50 | R$ 17.500 | R$ 1.650 | R$ 1.800 | R$ 115 | **+R$ 5.512** | +R$ 30.599 |
| 17 | 40 embaixadores | 55 | R$ 19.250 | R$ 1.650 | R$ 1.980 | R$ 115 | **+R$ 6.343** | +R$ 36.942 |
| **Mês 4 total** ||**180**|**R$ 63.000**|**R$ 6.600**|**R$ 6.480**|**R$ 460**|**+R$ 18.747**||
| **Mês 5 — Rampa final** ||||||||
| 18 | Loop prova social | 65 | R$ 22.750 | R$ 1.650 | R$ 2.340 | R$ 115 | **+R$ 7.999** | +R$ 44.941 |
| 19 | YouTube Shorts | 70 | R$ 24.500 | R$ 1.650 | R$ 2.520 | R$ 115 | **+R$ 8.827** | +R$ 53.768 |
| 20 | Nova incorporadora canal | 80 | R$ 28.000 | R$ 1.650 | R$ 2.880 | R$ 115 | **+R$ 10.484** | +R$ 64.252 |
| 21 | Fluxo estabilizado | 85 | R$ 29.750 | R$ 1.650 | R$ 3.060 | R$ 115 | **+R$ 11.313** | +R$ 75.565 |
| **Mês 5 total** ||**300**|**R$ 105.000**|**R$ 6.600**|**R$ 10.800**|**R$ 460**|**+R$ 38.623**||
| **Mês 6 — Meta plena** ||||||||
| 22 | 60 embaixadores | 95 | R$ 33.250 | R$ 1.650 | R$ 3.420 | R$ 115 | **+R$ 12.970** | +R$ 88.535 |
| 23 | Escala Paulínia/Hortolândia | 105 | R$ 36.750 | R$ 1.650 | R$ 3.780 | R$ 115 | **+R$ 14.629** | +R$ 103.164 |
| 24 | **META** | 115 | R$ 40.250 | R$ 1.650 | R$ 4.140 | R$ 115 | **+R$ 16.287** | +R$ 119.451 |
| 25+ | Regime | 110 | R$ 38.500 | R$ 1.650 | R$ 3.960 | R$ 115 | **+R$ 15.485** | mensal |
| **Mês 6 total** ||**440**|**R$ 154.000**|**R$ 6.600**|**R$ 15.840**|**R$ 460**|**+R$ 88.298**||

### Resumo por mês (Cenário Recomendado)

| Mês | Meta ART | Receita | Margem bruta | Custos total | **Lucro operacional** | Lucro acumulado |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 25 | R$ 8.750 | R$ 6.040 | R$ 2.240 | **R$ 3.800** | R$ 3.800 |
| 2 | 45 | R$ 15.750 | R$ 10.872 | R$ 3.480 | **R$ 7.392** | R$ 11.192 |
| 3 | 75 | R$ 26.250 | R$ 18.120 | R$ 6.760 | **R$ 11.360** | R$ 22.552 |
| 4 | 180 | R$ 63.000 | R$ 43.489 | R$ 24.742 | **R$ 18.747** | R$ 41.299 |
| 5 | 300 | R$ 105.000 | R$ 72.483 | R$ 33.860 | **R$ 38.623** | R$ 79.922 |
| 6 | 440 | R$ 154.000 | R$ 106.308 | R$ 66.010 | **R$ 88.298** | R$ 168.220 |
| **12** | **5.280/ano** | **~R$ 1,85M** | **~R$ 1,28M** | **~R$ 792k** | **~R$ 1,06M/ano** | |

### Marcos críticos (comparar com a realidade toda semana)

- **Semana 4:** primeiros R$ 5k de receita, primeira semana positiva
- **Semana 8:** operação sustenta os próprios custos + lucro visível
- **Semana 13:** break-even do investimento inicial (semanas 1-2)
- **Semana 16:** metade da meta atingida
- **Semana 21:** meta 20 ART/dia atingida
- **Semana 24:** meta batida com consistência de 4 semanas

### Cenário Pessimista (Realidade + 40%)

Se tudo demorar mais do que o esperado — funil converte pior, embaixadores demoram pra ativar, Meta Ads não aprende no prazo. Adia tudo em ~2 meses:

| Mês | Meta ART | Lucro operacional |
|---|---:|---:|
| 1 | 10 | +R$ 1.500 |
| 2 | 20 | +R$ 3.000 |
| 3 | 35 | +R$ 5.500 |
| 4 | 60 | +R$ 8.500 |
| 5 | 100 | +R$ 14.000 |
| 6 | 160 | +R$ 25.000 |
| **8** | **440** | **+R$ 88k/mês** |

Meta plena atingida no mês 8 em vez do mês 6. Nenhum mês fica no vermelho (por causa da margem alta de 69%).

### Regras de decisão semanais

**Toda sexta-feira analisar:**

1. **Batemos a meta da semana?**
   - Sim → segue plano
   - Não, faltando <20% → investigar canal específico, ajustar criativo
   - Não, faltando >20% → escalação (revisar hipótese na segunda seguinte)

2. **CAC está dentro do previsto?**
   - Meta CAC agregado: < R$ 100 no mês 3, < R$ 80 no mês 6
   - Se > R$ 150 sustentado por 3 semanas → cortar canal pior e realocar

3. **Fila de emissão sustenta o volume?**
   - Se ART/dia > capacidade do engenheiro → contratar 2º engenheiro (ponto de escala)
   - Ponto de referência: 15 ART/dia = 1 engenheiro em regime confortável

### Como o dashboard reporta essas metas

O `dashboard-marketing.html` já mostra:
- KPI "ART hoje" — comparar visualmente com a meta semanal ÷ 5
- Tabela "por canal" — validar quais canais estão puxando
- Tabela "por prédio" — descobrir prédios "quentes"

Adicionar (novo desenvolvimento sugerido):
- Linha de meta semanal no gráfico de ART/dia
- Sinal visual (verde/amarelo/vermelho) por semana
- Projeção do mês baseada nos dias já corridos

Estimativa: 4h de dev pra implementar.

---

## 7. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Funil converte pior que esperado | Média | Alto | Começar com modelo orgânico (R$ 0). Testar antes de escalar. |
| Concorrente entra com preço agressivo | Baixa | Médio | Nossa infra já pronta = vantagem de 3-6 meses de learning curve. |
| Google/Meta bane conta de anúncio | Baixa | Médio | Diversificar canais (não depender só de ads). |
| CREA muda regra de ART simplificada | Baixa | Alto | Pipeline de 3 produtos adjacentes (laudo, vistoria, memorial). |
| Scraper para de funcionar (portal muda layout) | Média | Baixo | Ter 5+ fontes redundantes. Se 1 quebra, as outras carregam. |
| Não conseguimos recrutar embaixadores | Média | Alto | Comissão competitiva (R$ 60). Fallback via corretor (R$ 100). |
| Prédio recusa panfleto/QR na portaria | Alta | Baixo | Não dependemos disso. É reforço, não canal principal. |
| Reclame Aqui contra a Diagnóstika prejudica marca | Média | Alto | SLA rígido (48h), atendimento pós-venda ativo, garantia de refazer. |

---

## 8. Investimento Necessário

### Opção A — Só Orgânico (Recomendada pra começar)

| Item | Custo mensal |
|---|---:|
| Software (open source) | R$ 0 |
| Infraestrutura (GitHub Pages + Supabase free) | R$ 0 |
| Google Business Profile | R$ 0 |
| Tempo próprio (2h/semana) | — |
| **Total mensal** | **R$ 0** |
| Comissão embaixador (variável, 60% aciona) | R$ 60/ART emitida |
| **Payback do investimento** | Imediato (não há investimento fixo) |

### Opção B — Piloto Pago (Após validar orgânico)

| Item | Custo mensal |
|---|---:|
| Meta Ads (3 prédios A) | R$ 1.350 |
| Google Ads (long-tail 7 prédios) | R$ 150 |
| **Total mensal** | **R$ 1.500** |
| Comissão embaixador | R$ 60/ART |
| **Payback** | 7 ART/mês (fácil) |

### Opção C — Escala Completa (Só depois de CAC validado)

| Item | Custo mensal |
|---|---:|
| Meta Ads (7 prédios A + 30 B) | R$ 4.500 |
| Google Ads (long-tail + genérico) | R$ 2.100 |
| **Total mensal** | **R$ 6.600** |
| Comissão embaixador | R$ 60/ART |
| **Payback** | 28 ART/mês |

**Nossa recomendação:** ir de A → B → C conforme cada etapa comprove viabilidade. Zero risco de queimar caixa em modelo não validado.

---

## 9. Métricas de Sucesso (o que olhar semanalmente)

Nosso dashboard (`/dashboard-marketing.html`) já entrega automaticamente:

**KPIs primários:**
- ART/dia útil (média móvel 7 dias)
- CAC por canal (Meta, Google, orgânico, embaixador)
- Taxa de conversão do funil (landing → início form → paga)

**KPIs secundários:**
- Novos prédios catalogados/semana (indicador de saúde do scraper)
- Embaixadores ativos (postou nos últimos 30 dias)
- ART por prédio ativo (identifica prédios "mortos" vs "quentes")
- NPS pós-emissão (fundamental pra reputação Google)

**Trigger de decisão:**
- CAC > R$ 200 sustentado por 4 semanas → pausar canal
- Prédio sem ART há 60 dias → desalocar orçamento
- Embaixador sem produção 90 dias → substituir
- ART/dia < meta há 30 dias → revisar hipótese

---

## 10. Diferenciação Competitiva

Pesquisa direta no Google por "ART reforma apartamento Campinas". O mercado é mais competitivo do que costuma-se assumir.

### Concorrentes locais em Campinas (exigem visita técnica, preço sob orçamento)

| Empresa | Preço | Modelo | Reputação online |
|---|---|---|---|
| Comdominium | Sob orçamento | Vistoria + emissão · Campinas + 100km | Sem selo Reclame Aqui |
| Cruzeiro Engenharia | Sob orçamento | Vistoria + ART + monitoramento · 36 anos · 20 engenheiros | Estabelecida, atende SP + Campinas |
| D'Limas Engenharia | Sob orçamento | Vistoria · CREA-SP 5070338835 · foco Campinas | Baixa presença digital |
| Arquitetos / escritórios | R$ 800–2.500 | Projeto completo + ART | Mercado tradicional local |

### Concorrentes 100% online (sede em SP capital, nacionais)

| Empresa | Preço final* | Prazo | Cobertura |
|---|---|---|---|
| RGS Laudos | R$ 99,99 (a partir de) | — | São Paulo capital |
| Sysbuild | R$ 298,29 (189,90 + CREA) | Rápido | SP · 10+ anos · Pix/cartão |
| Laudo ART | R$ 308,29 (199,90 + CREA) | 24h (4h se Pix) | SP, GO, MT, MS, MG, RJ |
| Habitíssimo/GetNinjas | R$ 300–1.000 | Variável | Nacional (qualidade variável) |
| **Diagnóstika** | **R$ 350 fixo (CREA incluso)** | **24–48h** | **RMC Campinas (local)** |

\* Preço final: total que o cliente paga incluindo taxa CREA de R$ 108,39 quando cobrada à parte.

### Nossa posição defensável — quadrante vazio

|  | Preço publicado | Sob orçamento |
|---|---|---|
| **100% online** | **← Diagnóstika (local Campinas) + Sysbuild/Laudo ART (SP capital)** | — |
| **Exige visita** | — | Comdominium, Cruzeiro, D'Limas (Campinas) · Arquitetos tradicionais |

Não somos os mais baratos nem os únicos online. Mas ocupamos um quadrante vazio: **empresa local em Campinas com preço publicado e operação 100% online**. Todo concorrente cai em um dos outros quadrantes.

### Diferenciais reais e defensáveis

- **Único jogador local com preço publicado** — reduz atrito de decisão; 100% dos concorrentes de Campinas trabalha com orçamento sob consulta.
- **Único 100% online sediado em Campinas** — Sysbuild/Laudo ART não têm endereço aqui; Comdominium/Cruzeiro exigem visita física.
- **SEO hiper-específico por prédio** — nenhum concorrente tem página dedicada por empreendimento. Quando o morador do Alenza Cambuí busca, só a gente aparece com o nome do prédio no título.
- **Programa Morador Embaixador** — canal único de aquisição via WhatsApp do condomínio. Nenhum concorrente faz.
- **Reputação local em Paulínia e Hortolândia** — regiões onde a Diagnóstika já é conhecida antes do lead virar cliente.
- **One-stop shop pós-ART** — laudos, vistorias, memoriais integrados no mesmo portal.
- **Preço fixo R$ 350 com CREA incluso** — Sysbuild cobra R$ 189,90 mas soma R$ 108,39 depois; nosso preço é o final, sem surpresa.

### Reconhecimento honesto

**Não somos os mais baratos.** Sysbuild e Laudo ART são R$ 40–50 mais baratos. RGS Laudos anuncia "a partir de R$ 99,99". Nossa aposta é ser o **mais confiável e mais fácil de resolver** para o morador da RMC — não vencer guerra de centavos com players nacionais que operam por volume.

**Barreira de entrada pra replicar:** 6–12 meses pra qualquer concorrente montar (infra de landings por prédio + base curada de condomínios + reputação local + programa embaixador estruturado). É vantagem temporal — enquanto os outros pensam, a gente já está indexado no Google e com embaixadores ativos.

---

## 11. Decisões que Precisamos Tomar Juntos

Sócio, quero seu voto em 4 pontos antes de acelerar:

**1. Modelo de investimento inicial**
- [ ] A — Só orgânico (R$ 0/mês, validar por 60 dias antes de escalar)
- [ ] B — Piloto pago (R$ 1.500/mês, 30 dias, decidir sobre C depois)
- [ ] C — Escala completa (R$ 6.600/mês) — só se você tem forte convicção de que o funil funciona

**2. Programa Morador Embaixador**
- [ ] Aprovar comissão R$ 60/ART + bônus R$ 500 por 10 ART no mesmo prédio
- [ ] Contra-proposta: sugerir outro valor

**3. Alocação de tempo do time**
- [ ] Quem opera semanalmente? (2h/semana de curadoria + aprovações)
- [ ] Precisamos contratar estagiário/freelancer pra outreach de embaixador?

**4. Meta e prazo**
- [ ] 20 ART/dia em 90 dias (agressivo)
- [ ] 10 ART/dia em 90 dias (conservador) — atinge break-even, sem estresse
- [ ] Outro alvo negociado

---

## 12. Next Steps Concretos (na sequência exata)

Se aprovado pelo sócio, execução na semana:

**Segunda:**
- Merge do PR #1 → GitHub Pages deploya sozinho
- Rodar `marketing/setup-supabase.sql` no Supabase (30 seg)
- Fazer 1 teste end-to-end real (30 min)

**Terça:**
- Setup Google Business Profile + primeiro post
- Enviar os 7 LAIs (opcional, low cost, insurance de longo prazo)

**Quarta-Quinta:**
- Implementar scraper dos 3 portais principais
- Rodar 1a coleta → CSV automaticamente cresce

**Sexta:**
- Rodar scraper Instagram → 30 candidatos a embaixador
- Abordar 10 manualmente pelo WhatsApp

**Semana seguinte:**
- Se aprovado modelo B/C: subir campanhas Meta + Google
- Onboarding dos primeiros embaixadores confirmados
- Começar rotina de dashboards diários

---

## Anexo — Estado atual do repositório

Ativos técnicos já construídos (custo afundado, valor real):

| Ativo | Status | Localização |
|---|---|---|
| Site institucional | Ao vivo | `index.html` |
| Formulário de ART com Pix | Ao vivo | `solicitar-art.html` |
| 44 landings SEO por prédio | Prontas, aguardando merge | `condominio/*.html` |
| Sitemap para Google | Pronto | `sitemap.xml` |
| Rastreio UTM por canal/prédio/embaixador | Pronto | integrado no form |
| Dashboard de conversão | Pronto | `dashboard-marketing.html` |
| Automação de landings | GH Action pronta | `.github/workflows/gerar-landings.yml` |
| Base de 70 condomínios catalogados | Pronta | `marketing/condominios-rmc.csv` |
| Playbook + criativos + scripts | Prontos | `marketing/*.md` |

**Nada disso precisa ser refeito.** Só ligar.

---

*Documento preparado como base para decisão executiva conjunta.*
*Diagnóstika Engenharia LTDA · CNPJ 54.027.948/0001-60*
