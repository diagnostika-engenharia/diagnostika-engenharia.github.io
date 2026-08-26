#!/usr/bin/env node
// Gera as paginas por ambiente/tipo de reforma (SEO meio-de-funil) em /reforma/*.html.
// Linguagem do morador, responde "preciso de ART pra [ambiente]?", CTA pro formulario.
// Uso: node marketing/scripts/gerar-guias.js

const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
const OUT = path.join(REPO, 'reforma');
const ORIGIN = 'https://diagnostika-engenharia.github.io';

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Cada guia: o ambiente, o que o morador busca, quando precisa, quando não, exemplos.
const GUIAS = [
  {
    slug:'banheiro', emoji:'🚿', titulo:'Reforma de banheiro',
    h1:'Reforma de banheiro precisa de ART?',
    resumo:'Na maioria das vezes, sim. Reforma de banheiro quase sempre mexe em hidráulica e impermeabilização — e aí o síndico exige a ART.',
    precisa:['Trocar ou mover o chuveiro, a torneira ou o vaso','Refazer a impermeabilização do piso','Trocar revestimento (piso ou parede) com quebra','Instalar banheira ou hidromassagem','Mudar o ponto de água ou esgoto'],
    naoPrecisa:['Trocar só o chuveiro por outro no mesmo lugar','Pintar as paredes','Trocar o assento do vaso, espelho ou acessórios'],
    porque:'O banheiro é o ponto mais sensível do apartamento: um erro de impermeabilização vira infiltração no vizinho de baixo. Por isso a NBR 16.280 e os síndicos são rigorosos aqui.'
  },
  {
    slug:'cozinha', emoji:'🍳', titulo:'Reforma de cozinha',
    h1:'Reforma de cozinha precisa de ART?',
    resumo:'Precisa sempre que mexe em ponto de água, gás, elétrica ou parede — o que acontece na maioria das reformas de cozinha, principalmente as americanas.',
    precisa:['Fazer cozinha americana (derrubar parede)','Mudar a pia ou o ponto de água de lugar','Mexer no ponto de gás','Trocar ou criar pontos de tomada','Refazer revestimento com quebra de piso'],
    naoPrecisa:['Trocar armários e bancada sem mexer em ponto de água','Pintar','Trocar a torneira no mesmo lugar'],
    porque:'Cozinha junta água, gás e elétrica no mesmo ambiente. Qualquer mudança nesses pontos precisa de responsável técnico — é segurança sua e do prédio.'
  },
  {
    slug:'parede', emoji:'🧱', titulo:'Derrubar ou mover parede',
    h1:'Derrubar parede de apartamento precisa de ART?',
    resumo:'Sim — sempre. Remover ou mover parede, mesmo de drywall, exige ART. E se a parede for estrutural, exige laudo e projeto antes de encostar nela.',
    precisa:['Integrar sala e cozinha','Remover parede de drywall ou alvenaria','Abrir vão ou passagem nova','Juntar dois ambientes'],
    naoPrecisa:['Nenhum caso: qualquer remoção de parede precisa de ART. Se alguém disser que não precisa, desconfie.'],
    porque:'Parece simples, mas derrubar a parede errada pode comprometer a estrutura do prédio inteiro. Por isso é um dos pontos que síndico e administradora mais cobram — e onde o responsável técnico é indispensável.'
  },
  {
    slug:'eletrica', emoji:'🔌', titulo:'Reforma elétrica',
    h1:'Mexer na elétrica do apartamento precisa de ART?',
    resumo:'Precisa quando você cria ou move pontos, troca o quadro ou aumenta a carga. Trocar uma tomada por outra no mesmo lugar, não.',
    precisa:['Criar novos pontos de tomada ou luz','Mover pontos de lugar','Trocar ou reforçar o quadro de energia','Instalar chuveiro/ar de alta potência que exige fiação nova'],
    naoPrecisa:['Trocar uma tomada ou interruptor no mesmo ponto','Trocar lâmpadas ou luminárias'],
    porque:'Elétrica mal feita é a maior causa de incêndio em apartamento. Mexer na fiação sem responsável técnico é risco pra você, pro vizinho e pro prédio — e a seguradora não cobre.'
  },
  {
    slug:'piso', emoji:'◾', titulo:'Troca de piso',
    h1:'Trocar o piso do apartamento precisa de ART?',
    resumo:'Depende. Se envolve quebrar o piso antigo e refazer a impermeabilização (áreas molhadas, sacada), sim. Se é só assentar por cima, geralmente não.',
    precisa:['Quebrar o piso e refazer a impermeabilização','Trocar piso de banheiro, cozinha, área de serviço ou sacada','Mexer no contrapiso'],
    naoPrecisa:['Assentar piso vinílico ou laminado por cima do existente','Trocar rodapé'],
    porque:'O problema não é o piso em si — é a impermeabilização embaixo dele nas áreas molhadas. Refazer errado gera infiltração. Por isso quando há quebra, entra a ART.'
  },
  {
    slug:'sacada', emoji:'🪟', titulo:'Fechar ou envidraçar a sacada',
    h1:'Envidraçar a sacada precisa de ART?',
    resumo:'Sim. Fechamento de sacada com vidro altera a fachada e adiciona carga — precisa de ART e, quase sempre, de autorização do condomínio seguindo o padrão do prédio.',
    precisa:['Envidraçar a sacada (cortina de vidro)','Fechar a varanda com esquadria','Instalar qualquer estrutura fixa na sacada'],
    naoPrecisa:['Colocar tela de proteção removível','Móveis e plantas'],
    porque:'A sacada é parte da fachada — mexer nela afeta o prédio inteiro, por isso o condomínio exige padrão único e responsável técnico. Sem ART e sem aprovação, a obra é embargada na hora.'
  }
];

function page(g){
  const url = `${ORIGIN}/reforma/${g.slug}.html`;
  const title = `${g.h1} | Diagnóstika Engenharia — Campinas`;
  const desc = `${g.resumo} Emissão de ART em 24h, R$ 350 fixo, engenheiro CREA-SP. Atende Campinas e RMC.`;
  const cta = t => `/solicitar-art.html?src=guia-${g.slug}&c=${t}`;
  const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
  const faqLd = {
    "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":g.h1,"acceptedAnswer":{"@type":"Answer","text":g.resumo}},
      {"@type":"Question","name":"Quanto custa a ART?","acceptedAnswer":{"@type":"Answer","text":"R$ 350 fixo com a taxa do CREA inclusa, emitida em até 24h."}}
    ]};
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#155B67">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(g.h1)}">
<meta property="og:description" content="${esc(g.resumo)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta name="robots" content="index,follow">
<link rel="apple-touch-icon" href="/assets/icon.png">
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--teal:#155B67;--teal-dk:#0D3C44;--turq:#00B4AC;--lime-dk:#6a8a1e;--amber:#B9832C;--bg:#F4F7F7;--bg2:#E9F0F0;--card:#fff;--ink:#15272A;--ink2:#4A6568;--mut:#8AA4A8;--line:#DDE8E9;--err:#C0392B;--ok:#1B8A4A}
@media (prefers-color-scheme:dark){:root{--bg:#0C1416;--bg2:#111d1f;--card:#162325;--ink:#E6EEF0;--ink2:#A6BEC2;--line:#223234;--teal:#3FA9BA;--turq:#2EC9BF}}
:root[data-theme="dark"]{--bg:#0C1416;--bg2:#111d1f;--card:#162325;--ink:#E6EEF0;--ink2:#A6BEC2;--line:#223234;--teal:#3FA9BA;--turq:#2EC9BF}
:root[data-theme="light"]{--bg:#F4F7F7;--bg2:#E9F0F0;--card:#fff;--ink:#15272A;--ink2:#4A6568;--line:#DDE8E9;--teal:#155B67;--turq:#00B4AC}
html{scroll-behavior:smooth}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--ink);font-size:16px;line-height:1.62;-webkit-font-smoothing:antialiased}
a{color:var(--teal);text-decoration:none}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
.top{background:var(--teal-dk)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.brand{display:flex;align-items:center;gap:9px;font-weight:800;color:#fff}
.brand .m{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,var(--teal),var(--turq));display:grid;place-items:center;color:#fff}
.top a.back{color:rgba(255,255,255,.8);font-size:13px;font-weight:600}
.hero{background:linear-gradient(160deg,var(--teal-dk),var(--teal));color:#fff;padding:40px 0 44px}
.hero .emoji{font-size:38px}
.hero h1{font-size:clamp(25px,4.6vw,36px);font-weight:800;letter-spacing:-.02em;line-height:1.12;margin:10px 0 12px;text-wrap:balance}
.hero p{font-size:17px;color:rgba(255,255,255,.92);max-width:60ch}
.crumb{font-size:12.5px;color:rgba(255,255,255,.7);margin-bottom:6px}
.crumb a{color:rgba(255,255,255,.85)}
main{padding:40px 0 20px}
.verdict{display:flex;gap:12px;align-items:flex-start;background:color-mix(in oklab,var(--ok) 10%,var(--card));border:1px solid color-mix(in oklab,var(--ok) 30%,transparent);border-radius:14px;padding:18px 18px;margin-bottom:26px}
.verdict .b{font-size:24px;line-height:1}
.verdict b{color:var(--ok)}
h2{font-size:21px;font-weight:800;margin:28px 0 12px;letter-spacing:-.01em}
.cols{display:grid;grid-template-columns:1fr;gap:14px;margin:6px 0 8px}
@media(min-width:620px){.cols{grid-template-columns:1fr 1fr}}
.col{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.col.sim{border-top:3px solid var(--ok)}
.col.nao{border-top:3px solid var(--mut)}
.col h3{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;gap:7px;align-items:center}
.col.sim h3{color:var(--ok)}
.col ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.col li{font-size:14px;color:var(--ink2);padding-left:20px;position:relative}
.col.sim li::before{content:'✓';position:absolute;left:0;color:var(--ok);font-weight:900}
.col.nao li::before{content:'–';position:absolute;left:0;color:var(--mut);font-weight:900}
.porque{background:var(--bg2);border-radius:14px;padding:18px;color:var(--ink2);font-size:15px;margin:8px 0 4px}
.porque b{color:var(--ink)}
.cta{background:linear-gradient(135deg,var(--teal),var(--turq));border-radius:18px;padding:26px 22px;text-align:center;color:#fff;margin:30px 0}
.cta h3{font-size:20px;font-weight:800;margin-bottom:6px}
.cta p{color:rgba(255,255,255,.9);font-size:14.5px;margin-bottom:16px}
.btn{display:inline-flex;align-items:center;gap:8px;justify-content:center;font-weight:800;font-size:16px;padding:15px 26px;border-radius:12px;border:0;cursor:pointer;background:#fff;color:var(--teal);box-shadow:0 8px 22px rgba(0,0,0,.16)}
.price{font-size:13px;color:rgba(255,255,255,.85);margin-top:12px}
.faq details{background:var(--card);border:1px solid var(--line);border-radius:12px;margin-bottom:9px;padding:2px 16px}
.faq summary{cursor:pointer;font-weight:700;padding:14px 0;font-size:15px;list-style:none;display:flex;justify-content:space-between;gap:10px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:'+';color:var(--turq);font-size:20px}
.faq details[open] summary::after{content:'–'}
.faq details p{padding:0 0 15px;color:var(--ink2);font-size:14px}
.rel{margin:26px 0 6px;font-size:13px;color:var(--ink2)}
.rel a{margin-right:14px;font-weight:600}
footer{background:var(--teal-dk);color:rgba(255,255,255,.7);padding:26px 0;font-size:12.5px;text-align:center;margin-top:20px}
footer a{color:var(--turq)}
.tbtn{background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer}
</style>
</head>
<body>
<div class="top"><div class="wrap"><a class="brand" href="/art/"><span class="m">D</span> Diagnóstika</a><button class="tbtn" onclick="tt()" aria-label="tema">◐</button></div></div>

<header class="hero"><div class="wrap">
  <div class="crumb"><a href="/art/">Início</a> › ${esc(g.titulo)}</div>
  <div class="emoji">${g.emoji}</div>
  <h1>${esc(g.h1)}</h1>
  <p>${esc(g.resumo)}</p>
</div></header>

<main><div class="wrap">
  <div class="verdict"><span class="b">${g.emoji}</span><div><b>Resposta rápida:</b> ${esc(g.resumo)} Se for o seu caso, a Diagnóstika resolve em 24h por R$ 350 — <a href="${cta('verdict')}">emitir agora</a>.</div></div>

  <h2>Quando ${esc(g.titulo.toLowerCase())} exige ART</h2>
  <div class="cols">
    <div class="col sim"><h3>✅ Precisa de ART</h3><ul>${li(g.precisa)}</ul></div>
    <div class="col nao"><h3>Dispensa ART</h3><ul>${li(g.naoPrecisa)}</ul></div>
  </div>

  <div class="porque"><b>Por que isso importa:</b> ${esc(g.porque)}</div>

  <div class="cta">
    <h3>Vai fazer essa reforma? A gente resolve o documento.</h3>
    <p>ART emitida em 24h por engenheiro CREA-SP. Sem visita, sem orçamento demorado.</p>
    <a class="btn" href="${cta('cta')}">Emitir minha ART agora →</a>
    <div class="price">R$ 350 fixo · taxa do CREA inclusa · Pix</div>
  </div>

  <h2>Perguntas frequentes</h2>
  <div class="faq">
    <details open><summary>${esc(g.h1)}</summary><p>${esc(g.resumo)} Na dúvida sobre o seu caso específico, fale com a gente — a avaliação é rápida.</p></details>
    <details><summary>Quanto custa e quanto tempo demora?</summary><p>R$ 350 fixo, com a taxa do CREA já inclusa. Emitimos em até 24h úteis, entrega por WhatsApp.</p></details>
    <details><summary>O síndico vai aceitar?</summary><p>Sim. A ART é o documento oficial do CREA, aceito por todas as administradoras e síndicos da RMC Campinas.</p></details>
    <details><summary>Vocês precisam ir no apartamento?</summary><p>Para reforma padrão, não. O engenheiro emite com base nos dados que você preenche. Só obra estrutural exige visita.</p></details>
  </div>

  <div class="rel"><strong>Outras reformas:</strong>
    <a href="/reforma/banheiro.html">Banheiro</a><a href="/reforma/cozinha.html">Cozinha</a><a href="/reforma/parede.html">Parede</a><a href="/reforma/eletrica.html">Elétrica</a><a href="/reforma/piso.html">Piso</a><a href="/reforma/sacada.html">Sacada</a>
  </div>
</div></main>

<footer><div class="wrap">
  <div><strong>Diagnóstika Engenharia LTDA</strong> · CNPJ 54.027.948/0001-60 · CREA-SP · Campinas e RMC</div>
  <div style="margin-top:6px"><a href="/art/">Início</a> · <a href="/solicitar-art.html?src=guia-${g.slug}&c=footer">Solicitar ART</a> · <a href="/condominio/">Condomínios</a></div>
</div></footer>
<script>
function tt(){var r=document.documentElement,d=r.getAttribute('data-theme'),p=matchMedia('(prefers-color-scheme:dark)').matches,dk=d==='dark'||(!d&&p);r.setAttribute('data-theme',dk?'light':'dark');try{localStorage.setItem('th-art',dk?'light':'dark')}catch(e){}}
try{var s=localStorage.getItem('th-art');if(s)document.documentElement.setAttribute('data-theme',s)}catch(e){}
</script>
</body>
</html>`;
}

if(!fs.existsSync(OUT)) fs.mkdirSync(OUT,{recursive:true});
GUIAS.forEach(g=>{ fs.writeFileSync(path.join(OUT,`${g.slug}.html`), page(g)); console.log('✓ reforma/'+g.slug+'.html — '+g.titulo); });
console.log('\nGerado(s): '+GUIAS.length+' guia(s) por ambiente em reforma/');

// exporta as URLs pra o sitemap consolidado
const urls = [`${ORIGIN}/art/`, ...GUIAS.map(g=>`${ORIGIN}/reforma/${g.slug}.html`)];
fs.writeFileSync(path.join(REPO,'marketing','.urls-guias.json'), JSON.stringify(urls,null,2));
