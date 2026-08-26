#!/usr/bin/env node
// Gera 7 pedidos LAI prontos para copiar/colar em cada e-SIC da RMC.
// Uso: node marketing/scripts/gerar-lai.js
// Output: marketing/lai/<cidade-slug>.md

const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'lai');

const CIDADES = [
  {
    slug: 'campinas',
    nome: 'Campinas',
    prefeitura: 'Prefeitura Municipal de Campinas',
    secretaria: 'Secretaria Municipal de Urbanismo (SEMURB) — Departamento de Uso e Ocupação do Solo (DUOS)',
    esic: 'https://esic.campinas.sp.gov.br/',
    endereco_pref: 'Avenida Anchieta, 200 — Centro — Campinas/SP — CEP 13015-904',
    obs: 'Se o e-SIC devolver "não localizado", refazer o pedido para "Departamento de Controle Urbano" ou usar o portal complementar aprova-facil.campinas.sp.gov.br apenas como referência (consulta é por protocolo, não expõe lista).'
  },
  {
    slug: 'valinhos',
    nome: 'Valinhos',
    prefeitura: 'Prefeitura Municipal de Valinhos',
    secretaria: 'Secretaria de Planejamento e Meio Ambiente — Divisão de Uso e Ocupação do Solo',
    esic: 'https://esic.valinhos.sp.gov.br/',
    endereco_pref: 'Rua Antônio Carlos, 301 — Centro — Valinhos/SP — CEP 13270-070',
    obs: ''
  },
  {
    slug: 'vinhedo',
    nome: 'Vinhedo',
    prefeitura: 'Prefeitura Municipal de Vinhedo',
    secretaria: 'Secretaria de Planejamento Urbano',
    esic: 'https://vinhedo.sp.gov.br/e-sic/',
    endereco_pref: 'Rua Humberto Pescarini, 1 — Centro — Vinhedo/SP — CEP 13280-000',
    obs: 'A prefeitura de Vinhedo às vezes exige protocolar presencialmente — se o e-SIC ficar sem resposta em 10 dias, ir presencialmente à Secretaria com o mesmo texto impresso.'
  },
  {
    slug: 'paulinia',
    nome: 'Paulínia',
    prefeitura: 'Prefeitura Municipal de Paulínia',
    secretaria: 'Secretaria de Planejamento Urbano',
    esic: 'https://paulinia.sp.gov.br/portal/ (seção "Acesso à Informação")',
    endereco_pref: 'Av. Prefeito José Lozano de Araújo, 1551 — Vila Bressani — Paulínia/SP — CEP 13140-000',
    obs: ''
  },
  {
    slug: 'sumare',
    nome: 'Sumaré',
    prefeitura: 'Prefeitura Municipal de Sumaré',
    secretaria: 'Secretaria de Planejamento e Urbanismo',
    esic: 'https://www.sumare.sp.gov.br/ (menu "Serviços" → "SIC — Serviço de Informação ao Cidadão")',
    endereco_pref: 'Avenida da Amizade, 285 — Jardim Bandeirantes — Sumaré/SP — CEP 13170-020',
    obs: ''
  },
  {
    slug: 'hortolandia',
    nome: 'Hortolândia',
    prefeitura: 'Prefeitura Municipal de Hortolândia',
    secretaria: 'Secretaria de Urbanismo',
    esic: 'https://hortolandia.sp.gov.br/ (seção "Transparência" → "SIC/LAI")',
    endereco_pref: 'Rua José Camilo Camargo, 100 — Jardim Amanda I — Hortolândia/SP — CEP 13184-330',
    obs: ''
  },
  {
    slug: 'indaiatuba',
    nome: 'Indaiatuba',
    prefeitura: 'Prefeitura Municipal de Indaiatuba',
    secretaria: 'Secretaria Municipal de Urbanismo',
    esic: 'https://www.indaiatuba.sp.gov.br/comunicacao/ouvidoria/ (Acesso à Informação)',
    endereco_pref: 'Av. Engenheiro Fábio Roberto Barnabé, 3665 — Jardim Regina — Indaiatuba/SP — CEP 13330-900',
    obs: ''
  }
];

const template = (c) => `# Pedido LAI — ${c.nome} — pronto para envio

Copie o CORPO (entre os separadores abaixo) e cole no e-SIC de ${c.nome} ou envie por e-mail à Ouvidoria. Preencha seus dados no final.

- **Canal preferencial (e-SIC):** ${c.esic}
- **Destinatário sugerido no assunto:** ${c.secretaria}
- **Endereço presencial (alternativa):** ${c.endereco_pref}
- **Prazo legal de resposta:** 20 dias corridos (Lei 12.527/2011, Art. 11).${c.obs ? '\n- **Observação:** ' + c.obs : ''}

---

## Assunto
Solicitação de lista de Certificados de Conclusão de Obras (CCO / Habite-se) emitidos para uso residencial multifamiliar vertical nos últimos 24 meses — ${c.nome}.

## Corpo do pedido (copiar a partir daqui)

Prezados(as),

Com fundamento na Lei nº 12.527/2011 (Lei de Acesso à Informação) e no direito constitucional de acesso à informação pública (art. 5º, XXXIII, CF/88), solicito à ${c.prefeitura} o fornecimento da relação dos **Certificados de Conclusão de Obras (CCO) / Habite-se** emitidos para edificações de **uso residencial multifamiliar vertical** (edifícios de apartamentos) nos **últimos 24 meses** contados da data deste pedido.

O pedido é dirigido preferencialmente à ${c.secretaria}, ou setor equivalente responsável pela emissão do Habite-se municipal.

Para cada certificado emitido, requeiro os seguintes campos, quando disponíveis no cadastro municipal:

1. Nome do empreendimento (denominação comercial ou razão do projeto);
2. Endereço completo da edificação (logradouro, número, bairro, CEP);
3. Incorporadora e/ou construtora responsável (razão social e CNPJ);
4. Número de unidades habitacionais entregues;
5. Área construída total (m²);
6. Número de pavimentos;
7. Data de emissão do Habite-se / CCO;
8. Número do processo administrativo.

Solicito o envio em **formato eletrônico aberto** (preferencialmente CSV, XLSX ou PDF pesquisável), remetido para o e-mail cadastrado neste pedido.

Ressalto que:
- A informação solicitada é **de natureza pública** — o Habite-se é ato administrativo com publicidade obrigatória (art. 37, CF), e os campos requisitados constam do cadastro imobiliário e do sistema de aprovação de projetos da Secretaria de Urbanismo;
- **Não requer produção de novo estudo ou consolidação inédita** (Art. 13, §2º, Decreto 7.724/2012), pois trata-se de exportação de relatório de sistema já existente;
- Caso o volume seja considerado excessivo, aceito recebimento em **lotes trimestrais** ou restrição a empreendimentos com **mais de 20 unidades**.

Fico à disposição para esclarecimentos e agradeço a atenção.

Atenciosamente,

**[NOME COMPLETO]**
CPF: [SEU CPF]
E-mail: [SEU E-MAIL]
Telefone: [SEU WHATSAPP]

(copiar até aqui)

---

## Após o envio

1. **Anote o número de protocolo** que o e-SIC devolver.
2. **Dia 15:** contato de acompanhamento (algumas prefeituras não notificam mudança de status).
3. **Dia 20:** se sem resposta, invocar prazo legal expirado.
4. **Dia 30:** se negado ou sem resposta, protocolar recurso à autoridade superior (10 dias, Art. 15, Lei 12.527/2011).
5. **Dia 60:** se insistir sem retorno, denunciar à CGU municipal (quando houver) ou ao Ministério Público de São Paulo.
`;

if(!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

CIDADES.forEach(c => {
  const filePath = path.join(OUT, `${c.slug}.md`);
  fs.writeFileSync(filePath, template(c));
  console.log(`✓ ${c.slug}.md — ${c.nome}`);
});

console.log(`\nGerados: ${CIDADES.length} pedidos LAI em marketing/lai/`);
