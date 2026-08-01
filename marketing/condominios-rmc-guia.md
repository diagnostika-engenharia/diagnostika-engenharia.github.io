# Guia de preenchimento — condominios-rmc.csv

## Estado atual

**40 empreendimentos catalogados** com dados curados de fontes públicas (sites das incorporadoras, portais Novo Metro / Campinas na Planta / Seina / Pazim, matérias de imprensa, blogs corporativos). Chegou-se aqui por múltiplas buscas dirigidas — nenhum portal imobiliário grande (ZAP, Viva Real) permitiu scraping direto (Cloudflare 403), então a colheita foi via sumários de busca + páginas oficiais.

Meta próxima: chegar em **150 prédios validados** antes de ligar mídia paga.

## Colunas da planilha

| Coluna | Descrição |
|--------|-----------|
| `codigo` | ID único: CPS=Campinas, VLH=Valinhos, VDO=Vinhedo, PLN=Paulínia, IND=Indaiatuba, SUM=Sumaré, HRT=Hortolândia |
| `nome, cidade, bairro, endereco` | Identificação |
| `incorporadora` | Vazio quando não foi possível confirmar |
| `unidades` | Nº apts. Vazio = falta validar |
| `data_entrega` | AAAA-MM. Vazio = falta validar |
| `status` | `confirmado_entregue` \| `em_obras` \| `lancamento` |
| `perfil` | `vertical` \| `horizontal` \| `misto` |
| `padrao` | `MCMV` \| `medio` \| `medio_alto` \| `alto` — segmenta abordagem e ticket |
| `fonte` | De onde veio o dado |
| `confianca` | `alta` (site oficial + data explícita) \| `media` (portal 3rd party) \| `baixa` (menção sem detalhe) |
| `prioridade` | `A` = ativar mídia agora (janela + volume) \| `B` = pipeline 30d \| `C` = fora janela ou baixo volume |
| `landing_slug` | Path para SEO programático |
| `observacoes` | Tudo mais |

## Filtro operacional (o que vai para mídia paga primeiro)

Ligar canais pagos apenas quando:

- `status = confirmado_entregue`
- `data_entrega` entre 3 e 24 meses atrás
- `confianca = alta` ou `media`
- `padrao != MCMV` (MCMV converte melhor por indicação de zelador, não por Meta Ads — ticket baixo, comportamento diferente)

**Prioridade A hoje = pilotos:**
CPS001 Alenza Cambuí · CPS002 Cyrela Haus Nova Campinas · CPS004 Hub Cambuí · CPS005 Una Proença · CPS008 Sirius Patriani · CPS007 Sensia Parque Prado · PLN001 Città Di Módena.

## O que ainda falta preencher (gargalos)

Praticamente todas as linhas estão sem: `endereco` completo, `unidades`, `data_entrega` exata em alguns casos. Para chegar em 150 prédios validados, ainda precisa:

1. **Habite-se Prefeitura de Campinas** — portal Aprova Fácil (`aprova-facil.campinas.sp.gov.br`) não expõe lista pública, é consulta por protocolo. Solução: solicitar via LAI (Lei de Acesso à Informação) uma lista de Certificados de Conclusão de Obras (CCO) residencial vertical emitidos nos últimos 24 meses. Prazo de resposta: 20 dias úteis.
2. **Prefeituras da RMC** — mesma abordagem (Valinhos, Vinhedo, Paulínia, Sumaré, Hortolândia, Indaiatuba) via portal e-SIC ou LAI presencial.
3. **Sindicato da Indústria da Construção (SindusCon-SP Campinas)** — publicam relatório trimestral de entregas. Contato direto: (19) 3255-0011.
4. **CBIC** — dados agregados por município, útil para dimensionar mercado.
5. **Pesquisa manual nos sites das outras incorporadoras ativas na RMC** que não caíram no radar: Rossi, Living, Yng, Cury, Direcional, Idea!Zarvos, Tegra, Building, MPD, Alpha Construtora.

## Como manter atualizado

- CSV vive no git (source of truth).
- Duplicar em Google Sheets para edição colaborativa.
- Reimport semanal do Sheets pro CSV mantém histórico.
- Cada ART emitida no futuro atualiza `art_emitidas` e `ultima_art` (a serem adicionadas quando plugar CRM).

## Fontes coletadas nesta rodada

Sites oficiais e portais utilizados na curadoria dos 40 empreendimentos:
- `pradogoncalves.com.br/lancamento/*`
- `cyrela.com.br/empreendimentos/*`
- `construtorapatriani.com.br`
- `eme.maishm.com.br/imoveis/*`
- `plaenge.com.br` + `blog.plaenge.com.br`
- `mrv.com.br/imoveis/sao-paulo/*`
- `auten.com.br/paulinia`
- `campinasnaplanta.com.br/imoveis/*`
- `novometro.com.br/blog`
- `seinaimoveis.com.br`
- `pazim.com.br`
- Reclame Aqui (útil para confirmar atrasos e nomes exatos de empreendimentos com problemas de entrega)
- Matérias: Correio Popular / RAC, Panorama de Negócios, Gazeta de Pinheiros, ACidade ON

## Alertas para uso operacional

- **HM Engenharia** entregou 2.950 unidades em Campinas desde 2020 — potencial enorme, mas MCMV, ticket baixo, aposta em zelador/porteiro.
- **Cidade Sete Sóis Dunlop (MRV)** = 5.000 unidades, entrega 2027 — não abordar ainda, mas colocar no radar para 2027-2028.
- **Cambuí** concentra alto padrão (Cyrela, Plaenge, Prado Gonçalves) — CPL alto mas ticket alto, boa conta.
- **Nova Campinas** próximo do Cambuí em perfil, boa expansão.
- **Cores do Poente / Colina do Sol / Portal dos Buritis (MRV)** — vários empreendimentos MCMV no Campo Grande / Parque Prado com grande volume no médio prazo.
