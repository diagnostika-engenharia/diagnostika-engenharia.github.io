# Onde paramos — retomar em nova sessão

**Leia este arquivo primeiro ao continuar o projeto de crescimento da Diagnóstika.**
Ele guarda as decisões. A conversa do chat não passa entre sessões; o repositório sim.

- Branch de trabalho: `claude/aumentar-volume-pedidos-art-d464f9`
- Pull Request aberto: **#1** (diagnostika-engenharia/diagnostika-engenharia.github.io)
- Última atualização: agosto/2026

---

## 1. A realidade (dados do dono, não suposição)

- **Volume real: 57 ART/ano ≈ 7/mês.** Teto recorrente ~10/mês.
- **A restrição é DEMANDA (alcance), não capacidade.** O motor de emissão já é semiautomático (robô rascunha, loga no CREA, preenche, baixa a ART; humano só confirma, paga a taxa e envia). Fulfillment NÃO é o gargalo.
- **Unit economics:** ART R$ 350 · taxa CREA (DARE) R$ 108,39 · margem bruta ~R$ 241,61 · custo operacional real ~R$ 12 (robô) · margem líquida ~R$ 230. **Compra única, sem LTV recorrente → teto de CAC baixo.**
- **Canal atual:** boca a boca + condomínios sob contrato.

## 2. Decisões travadas (o que foi DESCARTADO e por quê)

- ❌ **Meta de 600/mês (20/dia):** arquivada. É 85x o volume atual — outro negócio. Não perseguir com mídia agora.
- ❌ **Administradoras:** não é onde o morador busca e elas não se envolvem. Enterrado (decisão do dono).
- ❌ **Condomínios sob contrato (7):** são prédios antigos, já reformados. Saturados — saem poucas ART deles.
- ❌ **Cadeia de reforma (arquiteto/marceneiro/empreiteira) como motor:** arquiteto é concorrente (emite RRT próprio); trade formal já tem engenheiro. Só a ponta informal (pedreiro autônomo) sobra, e é frágil.
- ❌ **Mídia paga em escala (R$ 6.600/mês):** produto de tiro único não banca CAC alto. Só teste pequeno DEPOIS de validar canal orgânico.
- ❌ **Landings por prédio como aposta de SEO:** volume de busca ~zero por prédio. Elas servem como destino de anúncio (pago), não como SEO.
- ❌ **Programa morador-embaixador, panfleto/QR em escala, YouTube Shorts:** na prateleira.

## 3. Meta realista acordada

- **7 → 15-20/mês** é vitória real e barata (custo perto de zero). 30/mês é esticado. Crescer 2-3x de verdade > perseguir 85x no papel.

## 4. AS DUAS PERGUNTAS ABERTAS (retomar por aqui)

O dono ainda não respondeu — são a chave do próximo passo:

1. **De onde vêm os 57 clientes atuais?** (boca a boca de quem? Google? síndico específico? eram moradores tocando reforma sozinhos ou profissionais terceirizando?) → o plano é clonar a origem que já funciona, não inventar canal novo.
2. **ART isolada ou porta de entrada?** A Diagnóstika também faz laudo, inspeção predial, vistoria, perícia (ticket maior, e recorrente em condomínio). O mesmo esforço de alcance pode render 5-10x mais nesses serviços. Decidir se foca só na ART (menor ticket) ou usa a ART como entrada.

## 5. Hipótese de trabalho (a confirmar com a pergunta 1)

O cliente real da Diagnóstika é **quem NÃO tem um profissional que emite ART** — o morador que toca a própria reforma com pedreiro, bate na parede do síndico e precisa "só do documento". Os canais que servem esse perfil (todos modestos, baratos): síndico/zelador de prédio novo no momento do gatilho, grupo de WhatsApp do prédio, e busca de alta intenção (Google Business + Ads). Nada de mídia cara.

## 6. O que JÁ está construído no repo (não refazer)

Ativos prontos na branch (custo afundado — reaproveitar, não recriar):
- `solicitar-art.html` — formulário com Pix + captura de UTM (`?p` prédio, `?e` parceiro/embaixador, `?src` canal, `?c` criativo). **Falta rodar `marketing/setup-supabase.sql` no Supabase.**
- `art/index.html` — homepage pública (problema-led, quiz "Preciso de ART?", preço na cara).
- `reforma/*.html` — 6 guias por ambiente (banheiro, cozinha, parede, elétrica, piso, sacada). Geradas por `marketing/scripts/gerar-guias.js`.
- `condominio/*.html` — landings por prédio (destino de anúncio, não SEO). Geradas por `marketing/scripts/gerar-landings.js`.
- `dashboard-marketing.html` — dashboard de conversão por canal/prédio/parceiro (auth Supabase).
- `sitemap.xml`, `robots.txt`, GitHub Action `.github/workflows/gerar-landings.yml`.
- `marketing/condominios-rmc.csv` — base de ~70 condomínios da RMC catalogados.

Documentos de estratégia em `marketing/`:
- **`motor-crescimento.md`** — o plano pós-reset (cadeia de reforma; parcialmente derrubado pela objeção "trade já tem engenheiro" — ver seção 2 acima).
- **`estrategia-mensagem.md`** — espinha de marca (posicionamento, voz, objeções, tagline "A sua reforma liberada, sem dor de cabeça").
- **`pesquisa-busca-publico.md`** — comportamento de busca real (3 níveis de consciência; morador não conhece o termo "ART").
- **`apresentacao-socio.md`** + Artifact HTML — apresentação executiva (feita na meta antiga de 600; PRECISA ser refeita pra meta realista de 15-20/mês).
- `playbook.md`, `embaixador.md`, `criativos.md`, `prospeccao-embaixadores.md`, `dia-1-midia-paga.md`, `lai/`, `condominios-rmc-guia.md` — material da fase anterior (meta 600); usar com o filtro das decisões da seção 2.

## 7. Alerta de coerência

Vários documentos (`apresentacao-socio.md`, `dia-1-midia-paga.md`, `playbook.md`) foram escritos na **meta antiga de 600/mês e no pressuposto de mídia paga**. Estão desatualizados frente às decisões da seção 2. Ao retomar: **não tratar esses docs como verdade atual** — a verdade atual é este arquivo (seções 1-5). Refazer a apresentação do sócio na meta realista é uma tarefa pendente.

## 8. Primeiro passo ao retomar

Responder as duas perguntas da seção 4. Com a origem dos 57 clientes na mão, montar o plano de clonar essa fonte. Sem isso, qualquer plano novo é chute.
