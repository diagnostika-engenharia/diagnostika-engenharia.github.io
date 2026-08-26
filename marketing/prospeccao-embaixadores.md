# Prospecção de Embaixadores — Guia operacional

Método pra recrutar 1 embaixador por prédio prioritário. Complementa `embaixador.md` (regras + scripts). Este documento entrega as **queries** que a equipe usa manualmente — não publica contatos pessoais (dado pessoal não vai pro repositório).

## Por que assim

Google não indexa moradores individuais (buscas por "morador do prédio X" só retornam a página comercial do empreendimento). Perfis de moradores estão em plataformas fechadas (Instagram, LinkedIn, Facebook, grupos WhatsApp) que exigem login e uso interativo. Portanto: cada recrutamento passa por 15 min de busca dentro dessas plataformas usando as queries abaixo.

Tempo esperado: **15-30 min por embaixador recrutado**. Meta: 20 embaixadores em 30 dias = 10h de prospecção.

## 5 rotas para encontrar o embaixador (do mais fácil pro mais difícil)

### Rota A — Cliente atual que já emitiu ART
Consulta na base `solicitacoes_art` do Supabase filtrando por `predio_codigo = 'CPS001'`. Se já teve ART emitida no prédio, esse morador conhece o produto e converte em ~50% dos convites.

**Query SQL:**
```sql
SELECT DISTINCT nome, telefone, condominio, criado_em
FROM solicitacoes_art
WHERE predio_codigo IS NOT NULL
  AND status IN ('pago','emitida')
ORDER BY predio_codigo, criado_em DESC;
```
Rodar semanalmente. Toda ART emitida em prédio ainda sem embaixador vira alvo.

### Rota B — Corretor da unidade
Cada empreendimento tem 3-5 corretores que venderam a maior parte das unidades. Eles conhecem 30-80 moradores cada. Pagar comissão de indicação: **R$ 100 por embaixador ativado**.

**Como achar:** Google Maps → busca "[nome do prédio]" → link "Contato" da página oficial do empreendimento → corretores parceiros listados. Ou buscar "[nome do prédio] corretor" no LinkedIn.

### Rota C — Perfil oficial do prédio no Instagram
Alguns condomínios têm perfil oficial (@hubcambuicampinas, @unaproencacampinas). Quem comenta com regularidade nesses posts é candidato — mora ali, é engajado.

**Como usar:** Instagram → busca "@[nome-do-predio-sem-espaco]" ou "@[nome-do-predio]campinas" → posts recentes → "Ver curtidas/comentários" → filtrar pra localidade Campinas.

### Rota D — LinkedIn por localidade
Filtro "Onde mora" quando disponível. Filtro alternativo: pessoas em Campinas + relacionamento com incorporadora (comprou apto pela Cyrela/Plaenge/etc.). Título de cargo variado (equilibra perfil).

### Rota E — Zelador / porteiro
Presencial. Vai à portaria com folder do programa, oferece comissão de R$ 20/ART indicada + apresenta o programa. Zelador conhece TODOS os moradores ativos e sabe quem é influente no grupo.

---

## Queries prontas por prédio prioritário (Prioridade A)

Copie e cole nas caixas de busca respectivas. Cada bloco leva ~15 min pra resultar em 1-2 candidatos qualificados.

### CPS001 · Alenza Cambuí — Rua Dr. Emílio Ribas 314, Cambuí

**Instagram (usar via app ou instagram.com/explore/):**
- `#alenzacambui`
- `#alenzacambuí`
- `#emilioribas314`
- Busca de local: "Alenza Cambuí"

**LinkedIn (via linkedin.com/search/results/people/):**
- `"Alenza Cambuí"` (aspas obrigatórias)
- `"Rua Emílio Ribas" Cambuí Campinas`
- `"morador Cambuí Campinas" reforma`

**Facebook Groups:**
- "Moradores do Cambuí — Campinas"
- "Cambuí Campinas — vizinhos"
- "Reforma de apartamento Campinas"

**Google:**
- `"Alenza Cambuí" site:instagram.com`
- `"Alenza Cambuí" morador OR sindico OR proprietário`

**Perfil-tipo:** proprietário 30-50 anos, alto padrão (unidades 157-281m²), profissional liberal / empresário. Corretor Prado Gonçalves.

---

### CPS002 · Cyrela Haus Nova Campinas — Rua Dr. Antônio Arruda Camargo 225, Nova Campinas

Prédio com **85 unidades**, torre única, entregue out/2024. Universo pequeno mas concentrado — foco em qualidade.

**Instagram:**
- `#hausnovacampinas`
- `#cyrelahaus`
- `#cyrelacampinas`

**LinkedIn:**
- `"Haus Nova Campinas"`
- `"Cyrela Haus" Campinas`
- filtro: "mora em Campinas" + "Nova Campinas"

**Facebook:**
- "Nova Campinas — moradores"
- "Cyrela Campinas — clientes"

**Perfil-tipo:** alto padrão (aptos 120-145m²), família estabelecida, executivo. Falar pelo canal do corretor da Cyrela pode ser mais rápido que buscas frias.

---

### CPS003 · Vitra Cambuí — Cambuí (endereço a confirmar)

**Instagram:**
- `#vitracambui`
- `#plaengecampinas`
- `#vitra` (mais barulho, filtrar por local)

**LinkedIn:**
- `"Vitra Cambuí"`
- `"Plaenge" Campinas apartamento`

**Blog Plaenge:** já tem post sobre o Vitra — comentários no blog e stories da Plaenge marcam clientes. Ver `blog.plaenge.com.br/plaenge-entrega-vitra-seu-primeiro-empreendimento-em-campinas/`.

**Perfil-tipo:** primeiro empreendimento Plaenge em Campinas — clientes tendem a ser divulgadores naturais ("comprei do primeiro projeto da Plaenge aqui").

---

### CPS004 · Hub Cambuí — Rua Coronel Quirino 982, Cambuí

Uso misto (residencial + comercial). Perfil de morador jovem-profissional.

**Instagram:**
- `@hubcambuicampinas` ← **perfil oficial confirmado, ver quem comenta**
- `#hubcambui`
- `#coronelquirino`

**LinkedIn:**
- `"Hub Cambuí" Campinas`
- `"Rua Coronel Quirino" morador`

**Perfil-tipo:** 25-40, profissional liberal, provavelmente usa o comercial do próprio prédio. Alta chance de ser ativo no grupo do prédio (perfil de comunidade).

---

### CPS005 · Una Proença — Rua Serra Dourada 101, Jardim Proença

Aptos compactos 47-55m² 2 dorm — perfil primeiro imóvel. Universo grande, orçamento sensível.

**Instagram:**
- `@unaproencacampinas` ← **perfil oficial confirmado**
- `#unaproenca`
- `#jardimproenca`

**LinkedIn:**
- `"Una Proença" Campinas`
- `"Jardim Proença" morador`

**Facebook:**
- "Jardim Proença — moradores Campinas"
- "Grupo Proença Campinas"

**Perfil-tipo:** 25-38, primeiro apto financiado, casal jovem sem filhos ou 1 filho pequeno. Reformas são frequentes (personalização do primeiro imóvel).

---

### CPS007 · Sensia Parque Prado — Rua Tabelião Agnaldo Xavier de Souza 121, Parque Prado

Entregue dez/2024, aptos 2 dorm 1 suíte varanda gourmet.

**Instagram:**
- `#sensiaparqueprado`
- `#parqueprado`

**LinkedIn:**
- `"Sensia Parque Prado"`
- `"Parque Prado" Campinas morador`

**Facebook:**
- "Parque Prado — Campinas — vizinhos"
- "Moradores do Parque Prado"

**Perfil-tipo:** classe média consolidada, 30-45 anos, uma criança em idade escolar. Reforma tipo: gourmetização da sacada, planejados.

---

### CPS008 · Sirius Patriani — Av. Aquidaban 130, Centro

**Prédio mais alto de Campinas.** Studios 46m² — perfil investidor + jovem profissional. 37 andares residenciais.

**Instagram:**
- `#siriuspatriani`
- `#patrianicampinas`
- `#aquidaban`
- Busca de local: "Sirius Campinas Patriani"

**LinkedIn:**
- `"Sirius Patriani"`
- `"Patriani" Campinas morador`

**Perfil-tipo:** 22-35, solteiro ou casal jovem, alta renda per capita. **Muitos são investidores que alugam** — nesse caso, o inquilino é o alvo (não o proprietário). Filtrar via query "aluguei apto Sirius Campinas".

---

### PLN001 · Città Di Módena — Paulínia (endereço a confirmar)

Perfil médio. Paulínia tem população menor que Campinas — grupos de bairro são muito ativos no Facebook.

**Instagram:**
- `#cittadimodena`
- `#cittadimodenapaulinia`
- `#paulinia`

**Facebook Groups:**
- "Moradores de Paulínia"
- "Città di Módena — Paulínia"

**LinkedIn:**
- `"Città di Módena" Paulínia`

---

## Como usar as queries — passo a passo

1. **Escolher 1 prédio.** Idealmente o que tem mais ART já emitida (Rota A entrega candidato pronto).
2. **15 min de busca** nas 4-5 queries do prédio. Meta: encontrar 3 perfis públicos que morem no prédio.
3. **Filtrar:** eliminar quem só passou uma vez (postou uma foto e sumiu). Ficar com quem posta com regularidade / comenta em grupos / demonstra engajamento.
4. **Abordar** com o script de `embaixador.md` (WhatsApp) ou LinkedIn (DM). Preferir WhatsApp — taxa de resposta 5-10× maior.
5. **Registrar** o contato no CRM/Sheets em uma aba `candidatos_embaixador` com colunas: `predio_codigo`, `nome`, `canal_contato`, `data_abordagem`, `status` (contactado/aceito/recusado/silêncio).
6. **Follow-up:** silêncio em 5 dias → 1 remessa cordial. Silêncio em 10 dias → pular pra próximo candidato.

## Padrão de taxa de conversão esperado

- 10 candidatos identificados → 6 respondem → 3 aceitam → 2 postam de fato no grupo → 1 gera ART recorrente.
- Ou seja: **~10% dos candidatos identificados viram embaixadores ativos**.
- Para os 20 embaixadores da meta 30d → prospectar ~200 candidatos (10 por prédio × 20 prédios).

## Ferramentas úteis

- **LinkedIn Sales Navigator** (14 dias grátis) — permite filtros geográficos precisos e mensagens InMail.
- **Instagram search por local** — via app, buscar o nome do prédio na aba "Locais".
- **Google Maps** — clicar na página do empreendimento → "Comunidade" ou "Fotos de usuários" às vezes tem moradores identificados.
- **Facebook Graph search** — restrito, mas ainda funciona: `moradores do [nome do prédio]`.
- **CRM próprio (Supabase)** — sempre olhe primeiro a base de leads passados.

## Ética e privacidade

- **Nunca publicar** nomes, telefones ou fotos de candidatos identificados em canais internos que possam vazar (evitar Slack público, evitar committar em git).
- **LGPD:** o programa Morador Embaixador tem consentimento explícito (aceite no cadastro do embaixador). Antes disso, você está fazendo prospecção comercial legítima, mas mantenha discrição.
- **Sem spam:** máximo 1 mensagem de abordagem por candidato. Silêncio = não. Repetir vira spam e queima o nome da Diagnóstika no prédio.
