// Acesso e gravação compartilhada das marcações do croqui e do modelo 3D (tabela obra_mapa).
// Cada marcação vira uma linha (obra_id, chave, etapa). Sem internet, fica numa fila local e sobe depois.
const SUPABASE_URL='https://fimmjgdwhifsrrbreche.supabase.co';
const SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbW1qZ2R3aGlmc3JyYnJlY2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzU2NDIsImV4cCI6MjA5NTE1MTY0Mn0.eAmMS95M8BkfX3NCcOtHnhKWXy0jkvXwSGEoqv_Q21Q';
const OBRA_ID='menotti', PEND_KEY='obra-mapa-pend';
let sb=null, user=null, enviando=false, pend={};
// Modo só visualização: link com ?ver=<token> (Conselho, síndica, AAM). Sem login e sem gravação.
const VER=new URLSearchParams(location.search).get('ver'), SO_LEITURA=!!VER;
let verQuando=null;
try{pend=JSON.parse(localStorage.getItem(PEND_KEY)||'{}')}catch(e){}
const salvaPend=()=>{try{localStorage.setItem(PEND_KEY,JSON.stringify(pend))}catch(e){}};
const escH=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function nomeUser(){return user?.user_metadata?.nome||(user?.email?user.email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):'Equipe');}
function bloqueia(msg){const g=document.getElementById('gate');if(g)g.innerHTML=`<div class="bx"><h2>🔒 Acesso restrito</h2><p>${msg}</p><a href="/">Ir para o login</a></div>`;}

// Mesmo controle do app: precisa de login e não pode ser síndico. Com ?ver=<token>, abre só para leitura.
async function mapaEntrar(){
  const t0=Date.now(); while(!window.supabase&&Date.now()-t0<6000) await new Promise(r=>setTimeout(r,80));
  if(!window.supabase){bloqueia('Não foi possível carregar a biblioteca de acesso. Verifique a conexão.');return false;}
  if(SO_LEITURA) return entrarLeitura();
  sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  let s=null; for(let i=0;i<3;i++){const {data}=await sb.auth.getSession();if(data?.session){s=data.session;break;}await new Promise(r=>setTimeout(r,250));}
  if(!s){bloqueia('É necessário fazer login no portal de sistemas da Diagnóstika.');return false;}
  user=s.user;
  try{const {data:v}=await sb.from('user_condos').select('role').eq('user_id',user.id);if(v&&v.some(x=>x.role==='sindico')){bloqueia('Esta tela é exclusiva da equipe técnica da Diagnóstika.');return false;}}catch(e){}
  document.getElementById('gate')?.remove();
  addEventListener('online',mapaEnviar); setInterval(mapaEnviar,20000); mapaEnviar();
  return true;
}

// Devolve {chave:{etapa,user_nome,updated_at}} das chaves que começam com pref (inclui o que ainda está na fila local)
async function mapaCarregar(pref){
  const out={}; let de=0;
  if(SO_LEITURA){const {data,error}=await sb.rpc('obra_mapa_publico',{p_token:VER}); if(error) throw error;
    (data||[]).forEach(r=>{if(r.chave.startsWith(pref)) out[r.chave]=r;}); verQuando=new Date(); return out;}
  for(;;){const {data,error}=await sb.from('obra_mapa').select('chave,etapa,user_nome,updated_at').eq('obra_id',OBRA_ID).like('chave',pref+'%').range(de,de+999);
    if(error) throw error; data.forEach(r=>out[r.chave]=r); if(data.length<1000) break; de+=1000;}
  Object.entries(pend).forEach(([k,e])=>{if(k.startsWith(pref)) out[k]={chave:k,etapa:e,user_nome:nomeUser(),updated_at:null,pend:1};});
  return out;
}
function mapaGravar(chave,etapa){if(SO_LEITURA) return; pend[chave]=etapa; salvaPend(); statusSync(); mapaEnviar();}
async function mapaEnviar(){
  if(enviando||!sb||!user) return; const ks=Object.keys(pend); if(!ks.length){statusSync();return;}
  enviando=true;
  try{const rows=ks.map(k=>({obra_id:OBRA_ID,chave:k,etapa:pend[k],user_id:user.id,user_nome:nomeUser()}));
    const {error}=await sb.from('obra_mapa').upsert(rows,{onConflict:'obra_id,chave'});
    if(!error){rows.forEach(r=>{if(pend[r.chave]===r.etapa) delete pend[r.chave];}); salvaPend();}
  }catch(e){}
  enviando=false; statusSync();
}
function statusSync(){const el=document.getElementById('sync'); if(!el) return; const n=Object.keys(pend).length;
  if(SO_LEITURA){el.textContent=`👁 somente visualização · atualizado às ${(verQuando||new Date()).toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'})}`;return;}
  el.textContent=n?`⏳ ${n} marcação${n>1?'ões':''} aguardando internet`:'✓ salvo para a equipe';}
const fmtQuando=iso=>{if(!iso) return 'agora (aguardando envio)'; const d=new Date(iso); return d.toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});};

// ---------- base das áreas: projeto original medido (padrão) ou croqui de 18/12/2025 (mantido para voltar) ----------
// Medido nas elevações 1 a 4 do projeto Badaró (Folhas 08 a 11, esc. 1:50) em 04/10/2026.
// Pastilha A (escura) do piso ao teto, cerca de 52 m; pastilha B (clara) só abaixo da janela, 16 andares:
// oposta 1,85 m/andar (29,6 m), piscina 1,26 (20,2), rua 1,71 (27,4), churrasqueira 1,73 (27,7).
const PROJ_ORIG={
 b1:{c:2.93,a:152.4,esc:1,n:'Pastilha A de 2,93 m × 52 m.'},
 b2:{c:3.06,a:90.6,n:'Pastilha B de 3,06 m, só abaixo da janela (1,85 m × 16 andares).'},
 b3:{c:3.64,a:107.7,n:'Pastilha B de 3,64 m, só abaixo da janela (1,85 m × 16 andares).'},
 b4:{c:.67,a:19.8,n:'Pastilha B (clara, não escura) de 0,67 m × 29,6 m.'},
 b5:{c:1.87,a:97.2,esc:1,n:'Diagonal de 1,87 m × 52 m.'},
 b6:{c:4.8,a:238,esc:1,n:'4,28 m de pastilha A × 52 m mais 0,52 m de pastilha B no núcleo.'},
 b7:{c:1.87,a:97.2,esc:1,n:'Diagonal de 1,87 m × 52 m.'},
 b8:{c:.67,a:19.8,n:'Pastilha B (clara, não escura) de 0,67 m × 29,6 m.'},
 b9:{c:3.64,a:107.7,n:'Pastilha B de 3,64 m, só abaixo da janela (1,85 m × 16 andares).'},
 b10:{c:3.06,a:90.6,n:'Pastilha B de 3,06 m, só abaixo da janela (1,85 m × 16 andares).'},
 b11:{c:2.93,a:152.4,esc:1,n:'Pastilha A de 2,93 m × 52 m.'},
 r3:{c:5.11,a:140,n:'Vão de 5,11 m, pastilha B abaixo da janela (1,71 m × 16 andares).'},
 f3:{c:5.18,a:143.5,n:'Vão de 5,18 m, pastilha B abaixo da janela (1,73 m × 16 andares).'},
 t1:{c:4.54,a:91.7,n:'Pastilha B de 4,54 m (1,45 + 3,09), abaixo da janela (1,26 m × 16 andares).'},
 t3:{c:3.14,a:163.3,esc:1,n:'Pastilha A de 3,14 m × 52 m.'},
 t4:{c:2.58,a:52.1,n:'Pastilha B de 2,58 m, abaixo da janela (1,26 m × 16 andares).'},
 t5:{c:3.39,a:68.5,n:'Pastilha B de 3,39 m, abaixo da janela (1,26 m × 16 andares).'},
 t6:{c:3.17,a:164.8,esc:1,n:'Pastilha A de 3,17 m × 52 m.'},
 t7:{c:4.61,a:93.1,n:'Pastilha B de 4,61 m (3,11 + 1,50), abaixo da janela (1,26 m × 16 andares).'}};
const BASE_KEY='obra-base-areas';
let BASE='projeto'; try{if(!SO_LEITURA) BASE=localStorage.getItem(BASE_KEY)||'projeto'}catch(e){}
// Guarda os valores do croqui em f.croqui e aplica a base escolhida. Faixa sem medida no projeto fica com a área do croqui.
function aplicarBase(lista,b){
  if(b){BASE=b; try{localStorage.setItem(BASE_KEY,b)}catch(e){}}
  lista.forEach(f=>{
    if(!f.croqui) f.croqui={c:f.c,a:f.a,esc:f.esc,conf:f.conf};
    const o=f.croqui, p=PROJ_ORIG[f.id];
    if(BASE==='projeto'&&p){f.c=p.c;f.a=p.a;f.esc=p.esc;f.conf=undefined;f.nota=p.n;}
    else{f.c=o.c;f.a=o.a;f.esc=o.esc;f.nota=undefined;
      f.conf=BASE==='projeto'?'Não aparece de frente nas elevações do projeto (retorno ou parede lateral). Mantida a área do croqui; conferir em campo.'+(o.conf?' '+o.conf:''):o.conf;}
  });
}
function seletorBase(fn){if(SO_LEITURA) return ''; return `<div class="acoes" style="margin:0 0 8px"><label><input type="radio" name="base" ${BASE==='projeto'?'checked':''} onchange="${fn}('projeto')"> Projeto original (medido)</label>
 <label><input type="radio" name="base" ${BASE==='croqui'?'checked':''} onchange="${fn}('croqui')"> Croqui 18/12/2025</label></div>`;}

// ---------- modo só visualização ----------
async function entrarLeitura(){
  sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {error}=await sb.rpc('obra_mapa_publico',{p_token:VER});
  if(error){bloqueia('Este link de visualização não é válido ou foi desativado. Peça um novo link à Diagnóstika Engenharia.');document.querySelector('#gate a')?.remove();return false;}
  document.body.classList.add('leitura');
  const st=document.createElement('style'); st.textContent='body.leitura #pal,body.leitura .so-equipe{display:none!important}'; document.head.appendChild(st);
  // cabeçalho: sem atalhos para o app interno; links entre croqui e 3D mantêm o token
  document.querySelectorAll('header a').forEach(a=>{const h=a.getAttribute('href')||'';
    if(/^(croqui|modelo3d)\.html/.test(h)) a.setAttribute('href',h.split('?')[0]+'?ver='+encodeURIComponent(VER));
    else if(a.querySelector('img')) a.replaceWith(...a.childNodes);
    else{const prox=a.nextSibling; if(prox&&prox.nodeType===3&&prox.textContent.trim()==='·') prox.remove(); a.remove();}});
  document.getElementById('gate')?.remove();
  setInterval(()=>{if(!document.hidden&&window.recarregar) recarregar();},60000);
  return true;
}

// ---------- links de visualização (cartão só da equipe) ----------
const PUBLICOS=['Conselho','Síndica','AAM Engenharia'];
function urlLeitura(tok,pag){return new URL(pag+'?ver='+tok,location.href).href;}
async function cardCompartilhar(el){
  if(SO_LEITURA||!el) return;
  const {data,error}=await sb.from('obra_mapa_links').select('token,rotulo,ativo,criado_em,ultimo_acesso').eq('obra_id',OBRA_ID).order('criado_em');
  if(error){el.innerHTML='<h3>Compartilhar só para visualização</h3><div class="mut">Não consegui ler os links.</div>';return;}
  const q=iso=>iso?fmtQuando(iso):'nunca';
  el.innerHTML=`<h3>Compartilhar só para visualização</h3>
   <div class="mut" style="margin-bottom:8px">Quem abre o link vê o 3D e a planta atualizados, sem login e sem poder marcar nada. Cada público tem o seu link, que pode ser desativado.</div>
   ${(data||[]).map(l=>`<div style="border-top:1px solid #e3e3df;padding:8px 0;${l.ativo?'':'opacity:.5'}">
     <div class="lin"><span><b>${escH(l.rotulo)}</b>${l.ativo?'':' (desativado)'}</span><span class="mut">último acesso: ${q(l.ultimo_acesso)}</span></div>
     ${l.ativo?`<div class="acoes"><button data-cp="${escH(urlLeitura(l.token,'modelo3d.html'))}">Copiar link do 3D</button><button data-cp="${escH(urlLeitura(l.token,'croqui.html'))}">Copiar link da planta</button><button data-off="${escH(l.token)}">Desativar</button></div>`:''}</div>`).join('')}
   <div class="acoes" style="border-top:1px solid #e3e3df;padding-top:8px"><select id="novoPub">${PUBLICOS.map(p=>`<option>${p}</option>`).join('')}<option value="">Outro…</option></select><button id="novoLink">Criar link</button></div>`;
  el.querySelectorAll('[data-cp]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.cp);b.textContent='Copiado ✓';}catch(e){prompt('Copie o link:',b.dataset.cp);}});
  el.querySelectorAll('[data-off]').forEach(b=>b.onclick=async()=>{if(!confirm('Desativar este link? Quem tiver o link deixa de ver o mapa.')) return;
    await sb.from('obra_mapa_links').update({ativo:false}).eq('token',b.dataset.off); cardCompartilhar(el);});
  el.querySelector('#novoLink').onclick=async()=>{let r=el.querySelector('#novoPub').value; if(!r) r=(prompt('Para quem é o link?')||'').trim(); if(!r) return;
    const {error}=await sb.from('obra_mapa_links').insert({obra_id:OBRA_ID,rotulo:r,criado_por:nomeUser()}); if(error) alert('Não consegui criar o link: '+error.message); cardCompartilhar(el);};
}
