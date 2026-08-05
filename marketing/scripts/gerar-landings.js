#!/usr/bin/env node
// Gera uma landing SEO por condomínio a partir de marketing/condominios-rmc.csv.
// Filtra por prioridade A e B (evita "C" fora-da-janela ou lançamento tardio).
// Uso: node marketing/scripts/gerar-landings.js
//
// Output: condominio/<slug>.html (uma por prédio) + condominio/index.html (índice).

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const CSV_PATH = path.join(REPO, 'marketing', 'condominios-rmc.csv');
const OUT_DIR = path.join(REPO, 'condominio');
const SITE_ORIGIN = 'https://diagnostika-engenharia.github.io';

function parseCSV(text){
  const rows = [];
  let field = '', row = [], inQuote = false;
  for(let i=0;i<text.length;i++){
    const c = text[i], n = text[i+1];
    if(inQuote){
      if(c === '"' && n === '"'){ field += '"'; i++; }
      else if(c === '"'){ inQuote = false; }
      else field += c;
    } else {
      if(c === '"') inQuote = true;
      else if(c === ','){ row.push(field); field = ''; }
      else if(c === '\n'){ row.push(field); rows.push(row); row = []; field = ''; }
      else if(c === '\r'){ /* skip */ }
      else field += c;
    }
  }
  if(field !== '' || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map(h => h.trim());
  return rows.filter(r => r.length && r.some(v => v)).map(r => {
    const o = {};
    header.forEach((h,i) => o[h] = (r[i]||'').trim());
    return o;
  });
}

function htmlEscape(s){
  return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function urlEnc(s){ return encodeURIComponent(s||''); }

function padraoLabel(p){
  return {
    'MCMV': 'padrão Minha Casa Minha Vida',
    'medio': 'padrão médio',
    'medio_alto': 'padrão médio-alto',
    'alto': 'alto padrão'
  }[p] || '';
}

function statusFrase(s){
  return {
    'confirmado_entregue': 'já entregue e habitado',
    'em_obras': 'em fase final de obras',
    'lancamento': 'em lançamento'
  }[s] || '';
}

function bairroFrase(row){
  const b = row.bairro || '';
  const c = row.cidade || '';
  if(b && c) return `${b}, ${c}`;
  return c || b || 'Campinas';
}

// Observações do CSV têm anotações internas (verificar, PROVAVEL, janela ideal…)
// Só usa se o texto for útil para o público — descarta se tem palavras internas.
const OBS_INTERNAS = /\b(verificar|pendente|PROVAVEL|PREENCHER|janela ideal|fora janela|validar|breve lançamento|checar|confirmar cronograma)\b/i;
function obsPublica(obs){
  if(!obs) return '';
  if(OBS_INTERNAS.test(obs)) return '';
  return obs;
}

function pageHTML(row){
  const nome = row.nome;
  const nomeEnc = urlEnc(nome);
  const cod = row.codigo;
  const url = `${SITE_ORIGIN}/condominio/${row.landing_slug}.html`;
  const linkCta = `/solicitar-art.html?p=${urlEnc(cod)}&pn=${nomeEnc}&src=seo-landing&c=predio-page`;
  const linkCtaBottom = `/solicitar-art.html?p=${urlEnc(cod)}&pn=${nomeEnc}&src=seo-landing&c=predio-page-bottom`;

  const bairroC = bairroFrase(row);
  const padrao = padraoLabel(row.padrao);
  const statusF = statusFrase(row.status);
  const incorp = row.incorporadora ? ` da incorporadora ${row.incorporadora}` : '';
  const entrega = row.data_entrega ? ` (entrega registrada em ${row.data_entrega})` : '';
  const obs = obsPublica(row.observacoes);

  const title = `ART de Reforma no ${nome} — ${bairroC} | Diagnóstika Engenharia`;
  const desc = `Emissão de ART (Anotação de Responsabilidade Técnica) para reforma de apartamento no ${nome}, ${bairroC}. Documento aceito pelo síndico, emissão em 24-48h por engenheiro CREA-SP, 100% online.`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#155B67">
<title>${htmlEscape(title)}</title>
<meta name="description" content="${htmlEscape(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="ART para Reforma no ${htmlEscape(nome)}">
<meta property="og:description" content="Moradores do ${htmlEscape(nome)}: emita sua ART de reforma em até 48h com engenheiro registrado no CREA-SP.">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta name="robots" content="index,follow">
<link rel="apple-touch-icon" href="/assets/icon.png">
<script type="application/ld+json">
${JSON.stringify({
  "@context":"https://schema.org",
  "@type":"Service",
  "name":`ART de Reforma no ${nome}`,
  "provider":{
    "@type":"ProfessionalService",
    "name":"Diagnóstika Engenharia LTDA",
    "areaServed":{"@type":"City","name":row.cidade||"Campinas"}
  },
  "serviceType":"Anotação de Responsabilidade Técnica (ART) para reforma",
  "areaServed":row.cidade||"Campinas"
}, null, 2)}
</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{--teal:#155B67;--teal-dk:#0D3C44;--turq:#00B4AC;--lime:#8DB72A;--bg:#F0F4F5;--card:#fff;--text:#1A2E31;--text2:#4A6568;--mut:#A8BFC2;--line:#E0EAEC}
html,body{min-height:100%;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:linear-gradient(160deg,var(--teal-dk) 0%,var(--teal) 100%);color:var(--text);font-size:16px;line-height:1.55}
body{min-height:100vh;display:flex;flex-direction:column}
header{padding:18px 18px 14px;text-align:center;color:#fff}
header img{height:38px;filter:brightness(0) invert(1)}
header h1.brand{font-size:15px;font-weight:600;margin-top:8px;opacity:.9;letter-spacing:.2px}
main{flex:1;background:var(--bg);border-radius:22px 22px 0 0;padding:26px 18px 60px;box-shadow:0 -8px 32px rgba(0,0,0,.15)}
.wrap{max-width:760px;margin:0 auto}
h1.title{font-size:24px;font-weight:800;color:var(--teal);line-height:1.25;margin-bottom:8px}
h1.title span{color:var(--turq)}
.lead{font-size:15px;color:var(--text2);margin-bottom:22px}
.cta-box{background:var(--card);border-radius:16px;padding:22px 18px;box-shadow:0 4px 22px rgba(21,91,103,.14);text-align:center;margin:22px 0}
.btn-cta{display:inline-block;background:linear-gradient(135deg,var(--turq),var(--teal));color:#fff;font-weight:800;padding:16px 28px;border-radius:12px;text-decoration:none;font-size:16px;box-shadow:0 4px 14px rgba(0,180,172,.3);letter-spacing:.2px}
.btn-cta:active{transform:scale(.98)}
.cta-sub{font-size:12.5px;color:var(--text2);margin-top:10px}
section{background:var(--card);border-radius:14px;padding:20px 18px;box-shadow:0 2px 12px rgba(21,91,103,.06);margin-bottom:14px}
section h2{font-size:17px;font-weight:700;color:var(--teal);margin-bottom:10px}
section p{font-size:14.5px;color:var(--text);margin-bottom:10px}
section ul,section ol{padding-left:22px;margin-bottom:8px}
section li{font-size:14.5px;color:var(--text);margin-bottom:6px}
section b{color:var(--teal-dk)}
.faq details{border-bottom:1px solid var(--line);padding:10px 0}
.faq details:last-child{border-bottom:0}
.faq summary{cursor:pointer;font-weight:700;color:var(--teal);font-size:14.5px}
.faq details[open] summary{margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.chip{background:rgba(0,180,172,.12);color:var(--teal);font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:14px;letter-spacing:.2px}
footer{background:var(--teal-dk);color:rgba(255,255,255,.7);text-align:center;padding:22px 16px;font-size:12px}
footer a{color:var(--turq);text-decoration:none}
@media(min-width:640px){h1.title{font-size:28px} main{padding:36px 24px 60px}}
</style>
</head>
<body>
<header>
  <a href="/" style="text-decoration:none;color:inherit"><img src="/assets/logo-dark.png" alt="Diagnóstika Engenharia"></a>
  <h1 class="brand">Diagnóstika Engenharia · Campinas / RMC</h1>
</header>
<main>
<div class="wrap">
  <h1 class="title">ART de Reforma no <span>${htmlEscape(nome)}</span></h1>
  <p class="lead">Moradores do ${htmlEscape(nome)}${incorp ? ',' : ''} em ${htmlEscape(bairroC)}${incorp}: emissão da Anotação de Responsabilidade Técnica de Reforma (ART) por engenheiro registrado no CREA-SP. Documento exigido pelo síndico antes de qualquer obra em unidade.</p>

  <div class="chips">
    ${statusF ? `<span class="chip">Condomínio ${htmlEscape(statusF)}</span>` : ''}
    ${padrao ? `<span class="chip">${htmlEscape(padrao)}</span>` : ''}
    <span class="chip">Emissão em 24–48h</span>
    <span class="chip">Pix aceito</span>
    <span class="chip">100% online</span>
  </div>

  <div class="cta-box">
    <a href="${linkCta}" class="btn-cta">Solicitar minha ART agora</a>
    <p class="cta-sub">3 minutos para preencher · engenheiro responsável CREA-SP · entrega por WhatsApp</p>
  </div>

  <section>
    <h2>Por que o ${htmlEscape(nome)} exige ART antes da reforma?</h2>
    <p>Todo condomínio residencial na região de Campinas segue a <b>NBR 16.280/2015</b> (Reforma em Edificações — Sistema de Gestão de Reformas) e o próprio Regulamento Interno do prédio. Ambos exigem a <b>Anotação de Responsabilidade Técnica (ART)</b> do CREA para qualquer obra em unidade autônoma. Sem esse documento:</p>
    <ul>
      <li>O síndico pode <b>embargar a obra</b> a qualquer momento.</li>
      <li>A prefeitura pode <b>multar o proprietário</b> em fiscalização.</li>
      <li>Em caso de dano estrutural, infiltração no vizinho ou acidente com prestador, o morador responde <b>civil e criminalmente</b>.</li>
      <li>A seguradora do condomínio <b>nega cobertura</b> se houver reforma sem responsável técnico registrado.</li>
    </ul>
  </section>

  <section>
    <h2>Como funciona</h2>
    <ol>
      <li><b>Preencha o formulário</b> com os dados do apto e da reforma (3 minutos).</li>
      <li><b>Pague por Pix</b> — R$ 350 fixo, sem custo escondido.</li>
      <li><b>Receba a ART assinada</b> pelo engenheiro no seu WhatsApp em até 48h.</li>
      <li><b>Entregue ao síndico</b> — obra liberada.</li>
    </ol>
  </section>

  <section>
    <h2>Sobre o ${htmlEscape(nome)}</h2>
    <p>${htmlEscape(nome)} está localizado em ${htmlEscape(bairroC)}${entrega}. ${obs ? htmlEscape(obs) + '. ' : ''}A Diagnóstika Engenharia já atende moradores da região e conhece as exigências específicas de administradoras e síndicos da RMC.</p>
  </section>

  <div class="cta-box">
    <a href="${linkCtaBottom}" class="btn-cta">Solicitar minha ART</a>
    <p class="cta-sub">Já preenchemos o nome do prédio pra você</p>
  </div>

  <section class="faq">
    <h2>Perguntas frequentes</h2>
    <details>
      <summary>Preciso mesmo de ART para uma reforma simples de apartamento?</summary>
      <p>Sim. A NBR 16.280 obriga a apresentação de ART para <b>qualquer reforma</b> que altere sistemas do apto — hidráulica, elétrica, remoção de parede (mesmo drywall), troca de piso com nova impermeabilização, ampliação de sacada. Apenas pintura e substituição estética sem intervenção em sistemas dispensa. Na dúvida, o síndico pode exigir.</p>
    </details>
    <details>
      <summary>Quanto tempo leva para receber?</summary>
      <p>A emissão é feita em <b>até 48h úteis</b> após a confirmação do pagamento. Em casos simples e horário comercial, entregamos no <b>mesmo dia</b>.</p>
    </details>
    <details>
      <summary>O síndico e a administradora do ${htmlEscape(nome)} vão aceitar?</summary>
      <p>Sim. A ART é o documento formal do CREA para responsabilização técnica, aceito universalmente por síndicos e administradoras na RMC. Enviamos junto o memorial descritivo da obra, se o condomínio pedir.</p>
    </details>
    <details>
      <summary>E se eu já comecei a obra sem ART?</summary>
      <p>Emitimos ART <b>durante o andamento</b> da obra também — cobre o período restante. Se houver embargo ativo, o documento serve como base para o desembargo. Fale conosco antes de iniciar para evitar essa situação.</p>
    </details>
    <details>
      <summary>Vocês fazem visita técnica ao apto?</summary>
      <p>Para ART de reforma padrão, não é necessário — o engenheiro emite com base nos dados e descrição enviados. Para obras estruturais (remoção de parede portante, ampliação) fazemos visita técnica com custo adicional, sob orçamento.</p>
    </details>
  </section>
</div>
</main>
<footer>© Diagnóstika Engenharia LTDA · CNPJ 54.027.948/0001-60 · <a href="/">portal</a> · <a href="/solicitar-art.html?p=${urlEnc(cod)}&pn=${nomeEnc}&src=seo-landing&c=predio-page-footer">solicitar ART</a></footer>
</body>
</html>`;
}

function indexHTML(rows){
  const grouped = {};
  rows.forEach(r => {
    const c = r.cidade || 'Outros';
    (grouped[c] = grouped[c] || []).push(r);
  });
  const sections = Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([cidade, items]) => {
    const lis = items.sort((a,b)=>a.nome.localeCompare(b.nome)).map(r =>
      `<li><a href="/condominio/${htmlEscape(r.landing_slug)}.html">${htmlEscape(r.nome)}${r.bairro?` <span style="color:#4A6568">— ${htmlEscape(r.bairro)}</span>`:''}</a></li>`
    ).join('\n');
    return `<section><h2>${htmlEscape(cidade)}</h2><ul>${lis}</ul></section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#155B67">
<title>ART de Reforma por Condomínio — RMC Campinas | Diagnóstika Engenharia</title>
<meta name="description" content="Solicite a ART (Anotação de Responsabilidade Técnica) para reforma no seu condomínio. Atendemos os principais empreendimentos da RMC Campinas.">
<link rel="canonical" href="${SITE_ORIGIN}/condominio/">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--teal:#155B67;--teal-dk:#0D3C44;--turq:#00B4AC;--bg:#F0F4F5;--card:#fff;--text:#1A2E31;--text2:#4A6568;--line:#E0EAEC}
html,body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:linear-gradient(160deg,var(--teal-dk) 0%,var(--teal) 100%);color:var(--text);font-size:16px;line-height:1.55;min-height:100vh}
body{display:flex;flex-direction:column;min-height:100vh}
header{padding:22px 18px 18px;text-align:center;color:#fff}
header img{height:40px;filter:brightness(0) invert(1)}
header h1{font-size:22px;font-weight:800;margin-top:10px}
header p{font-size:13px;opacity:.85;margin-top:4px}
main{flex:1;background:var(--bg);border-radius:22px 22px 0 0;padding:26px 18px 60px}
.wrap{max-width:760px;margin:0 auto}
section{background:var(--card);border-radius:14px;padding:20px 18px;box-shadow:0 2px 12px rgba(21,91,103,.06);margin-bottom:14px}
section h2{font-size:17px;font-weight:700;color:var(--teal);margin-bottom:12px;border-bottom:2px solid var(--line);padding-bottom:8px}
ul{list-style:none;padding:0}
ul li{padding:8px 0;border-bottom:1px solid var(--line)}
ul li:last-child{border-bottom:0}
ul li a{color:var(--teal);text-decoration:none;font-weight:600;font-size:14.5px}
ul li a:hover{color:var(--turq)}
.intro{background:var(--card);border-radius:14px;padding:18px;margin-bottom:18px;color:var(--text2);font-size:14.5px}
footer{background:var(--teal-dk);color:rgba(255,255,255,.7);text-align:center;padding:22px 16px;font-size:12px}
footer a{color:var(--turq);text-decoration:none}
</style>
</head>
<body>
<header>
  <a href="/" style="text-decoration:none;color:inherit"><img src="/assets/logo-dark.png" alt="Diagnóstika Engenharia"></a>
  <h1>ART de Reforma por Condomínio</h1>
  <p>Emissão rápida para os principais empreendimentos da RMC Campinas</p>
</header>
<main>
<div class="wrap">
  <div class="intro">Encontre seu condomínio abaixo para ir direto à página com o formulário pré-preenchido. Não encontrou? <a href="/solicitar-art.html" style="color:var(--teal);font-weight:700">Solicitar direto</a>.</div>
  ${sections}
</div>
</main>
<footer>© Diagnóstika Engenharia LTDA · CNPJ 54.027.948/0001-60 · <a href="/">portal</a></footer>
</body>
</html>`;
}

// ============ MAIN ============
const csv = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(csv).filter(r =>
  (r.prioridade === 'A' || r.prioridade === 'B') &&
  r.landing_slug &&
  r.nome
);

if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
rows.forEach(r => {
  const html = pageHTML(r);
  const out = path.join(OUT_DIR, `${r.landing_slug}.html`);
  fs.writeFileSync(out, html);
  count++;
  console.log(`✓ ${r.landing_slug}.html — ${r.nome}`);
});

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHTML(rows));
console.log(`✓ index.html (${rows.length} condomínios)`);

// sitemap.xml no root — Google indexa mais rápido
// URLs das páginas de topo/meio de funil (home do serviço + guias por ambiente),
// geradas por gerar-guias.js. Merge no sitemap se o arquivo existir.
let guiasUrls = [];
try {
  const gp = path.join(REPO, 'marketing', '.urls-guias.json');
  if (fs.existsSync(gp)) guiasUrls = JSON.parse(fs.readFileSync(gp, 'utf8'));
} catch (_) {}

const sitemapUrls = [
  `${SITE_ORIGIN}/`,
  `${SITE_ORIGIN}/art/`,
  `${SITE_ORIGIN}/solicitar-art.html`,
  `${SITE_ORIGIN}/condominio/`,
  ...guiasUrls.filter(u => u !== `${SITE_ORIGIN}/art/`),
  ...rows.map(r => `${SITE_ORIGIN}/condominio/${r.landing_slug}.html`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(REPO, 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml (${sitemapUrls.length} URLs)`);

// robots.txt (se não existir) apontando para o sitemap
const robotsPath = path.join(REPO, 'robots.txt');
if(!fs.existsSync(robotsPath)){
  fs.writeFileSync(robotsPath, `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
  console.log(`✓ robots.txt`);
}

console.log(`\nGerado(s): ${count} landing(s) em ${path.relative(REPO, OUT_DIR)}/`);
