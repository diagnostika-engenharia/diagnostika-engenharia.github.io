# Guia de preenchimento — condominios-rmc.csv

## Aviso importante

A planilha `condominios-rmc.csv` sai com **20 prédios semente** apenas com nome/cidade/incorporadora conhecidos publicamente e coluna `status_entrega=pendente_confirmacao`. **Todos os campos operacionais precisam ser validados** antes de ligar mídia paga — nomes de empreendimentos e datas de entrega mudam, e alguns podem já ter passado da janela de 90 dias.

Meta: chegar em **150 prédios validados** nos primeiros 15 dias.

## Fontes de coleta (ordem de prioridade)

### 1. Habite-se das prefeituras (fonte oficial, mais precisa)
- Campinas: portal e-Cidade / SEPLAN → consulta pública de Habite-se emitidos.
- Valinhos, Vinhedo, Paulínia, Sumaré, Hortolândia, Indaiatuba: mesma consulta na secretaria de urbanismo.
- Filtrar: uso residencial multifamiliar, área > 3000m², emissão nos últimos 24 meses.

### 2. CBIC / SindusCon-SP
- Radar de lançamentos e entregas regional.
- Reporta unidades entregues por município.

### 3. ZAP Imóveis / Viva Real / OLX — filtro "Lançamentos"
- Filtrar por cidade + "pronto para morar" ou "entrega recente".
- Ler descrição pra pegar data de entrega.

### 4. LinkedIn dos gerentes comerciais das incorporadoras
- MRV, Cyrela, Rossi, Plaenge, HM, Tenda, Living, A.Yoshii — publicam entregas.

### 5. Google Maps + Street View
- Confirma se o prédio está de pé e habitado (janelas com cortinas, carros, etc).

## Prioridade de preenchimento (colunas por ordem)

1. **codigo, nome, cidade, bairro** — identificação (30s por prédio).
2. **endereco, unidades, data_entrega** — qualificação (5min por prédio).
3. **incorporadora, administradora** — abre porta pra abordagem B2B (2min).
4. **landing_slug** — automático se seguir padrão `nome-bairro` sem espaço, minúsculo, sem acento.
5. **meta_ads_ativo** — marca `sim` quando anúncio ligado.
6. **embaixador_nome/whatsapp** — preenchido após recrutamento (ver `embaixador.md`).
7. **zelador, sindico** — abordagem física; preenchido a partir do dia 30.
8. **grupo_whatsapp_link** — quase sempre vazio (grupos são privados); serve como flag se o embaixador conseguir adicionar a Diagnostika.

## Filtros que precisa aplicar antes de ativar

Só ligar canal pago em prédio que atende:
- `data_entrega` entre 3 e 24 meses atrás.
- `unidades >= 80` (custo/benefício de mídia geo-cercada).
- `status_entrega=confirmado`.

Prédios fora da janela (>24 meses): mantém no CSV, muda status para `saturado`, foco em SEO orgânico apenas.

## Segmentação sugerida para os 150 primeiros

- 60 em Campinas (Cambuí, Taquaral, Nova Campinas, Guanabara, Alphaville).
- 30 em Valinhos + Vinhedo (público de maior ticket).
- 30 em Paulínia + Sumaré + Hortolândia + Indaiatuba (volume).
- 30 restantes: reserva/expansão.

## Update do CSV

- Fonte da verdade fica no repositório (versão git).
- Duplicar em Google Sheets pra edição colaborativa da equipe comercial.
- Reimport semanal do Sheets pro CSV mantém commit history.
