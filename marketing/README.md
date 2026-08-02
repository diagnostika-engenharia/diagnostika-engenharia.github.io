# marketing/ — Aumentar volume de pedidos de ART

Plano operacional para levar emissão de ART semiautomática direto ao morador de apto em condomínio recém entregue na RMC Campinas. Meta: **20 ART/dia úteis**.

## Ordem de leitura

1. **[playbook.md](./playbook.md)** — a estratégia inteira em 1 documento. Comece aqui.
2. **[embaixador.md](./embaixador.md)** — o motor principal: programa Morador Embaixador (regras + scripts).
2a. **[prospeccao-embaixadores.md](./prospeccao-embaixadores.md)** — guia operacional pra recrutar (queries prontas por prédio A).
3. **[criativos.md](./criativos.md)** — copy pronto para Meta, Google, QR, panfleto.
4. **[condominios-rmc.csv](./condominios-rmc.csv)** — planilha dos prédios alvo (40 curados).
5. **[condominios-rmc-guia.md](./condominios-rmc-guia.md)** — como completar a planilha até 150 prédios.
6. **[lai/](./lai/)** — 7 pedidos LAI prontos, um por prefeitura da RMC (destrava próximos 100+ prédios).
7. **[scripts/gerar-landings.js](./scripts/gerar-landings.js)** — gerador de landings SEO por prédio.
8. **[../dashboard-marketing.html](../dashboard-marketing.html)** — dashboard de conversão (login com Supabase, mesma senha do portal).

## Execução dia 1
- **[setup-supabase.sql](./setup-supabase.sql)** — rodar UMA vez no Supabase antes do deploy (ALTER TABLE + policies + indexes + view auxiliar).
- **[dia-1-midia-paga.md](./dia-1-midia-paga.md)** — copy Meta Ads + Google Ads pronto para os 7 prédios A + orçamento R$ 220/dia + KPIs esperados.

## Automação
- Push no CSV em `main` → GitHub Action `.github/workflows/gerar-landings.yml` regera `condominio/*.html` + `sitemap.xml` e faz commit automático.

## Estado atual

- Estratégia definida e escrita.
- **40 empreendimentos catalogados** com dados curados de fontes públicas (sites das incorporadoras, Novo Metro, Campinas na Planta, Seina, imprensa local). Ver `condominios-rmc-guia.md` para fontes e critério de confiança.
- 7 prédios com prioridade A prontos para começar mídia paga já (Alenza Cambuí, Cyrela Haus Nova Campinas, Hub Cambuí, Una Proença, Sirius Patriani, Sensia Parque Prado, Città Di Módena).
- Landing de conversão `/solicitar-art.html` já existe.
- **Falta:** popular planilha até 150 prédios (via LAI nas prefeituras), recrutar embaixadores, ligar mídia paga.

## Próxima ação (dia 1)

Pegar os 7 prédios de prioridade A e recrutar o primeiro embaixador em cada — script pronto em `embaixador.md`. Em paralelo, protocolar LAI de CCO residencial vertical nas 6 prefeituras da RMC para desbloquear os próximos 100+ prédios.
