// Acesso e gravação compartilhada das marcações do croqui e do modelo 3D (tabela obra_mapa).
// Cada marcação vira uma linha (obra_id, chave, etapa). Sem internet, fica numa fila local e sobe depois.
const SUPABASE_URL='https://fimmjgdwhifsrrbreche.supabase.co';
const SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbW1qZ2R3aGlmc3JyYnJlY2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzU2NDIsImV4cCI6MjA5NTE1MTY0Mn0.eAmMS95M8BkfX3NCcOtHnhKWXy0jkvXwSGEoqv_Q21Q';
const OBRA_ID='menotti', PEND_KEY='obra-mapa-pend';
let sb=null, user=null, enviando=false, pend={};
try{pend=JSON.parse(localStorage.getItem(PEND_KEY)||'{}')}catch(e){}
const salvaPend=()=>{try{localStorage.setItem(PEND_KEY,JSON.stringify(pend))}catch(e){}};
const escH=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function nomeUser(){return user?.user_metadata?.nome||(user?.email?user.email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):'Equipe');}
function bloqueia(msg){const g=document.getElementById('gate');if(g)g.innerHTML=`<div class="bx"><h2>🔒 Acesso restrito</h2><p>${msg}</p><a href="/">Ir para o login</a></div>`;}

// Mesmo controle do app: precisa de login e não pode ser síndico
async function mapaEntrar(){
  const t0=Date.now(); while(!window.supabase&&Date.now()-t0<6000) await new Promise(r=>setTimeout(r,80));
  if(!window.supabase){bloqueia('Não foi possível carregar a biblioteca de acesso. Verifique a conexão.');return false;}
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
  for(;;){const {data,error}=await sb.from('obra_mapa').select('chave,etapa,user_nome,updated_at').eq('obra_id',OBRA_ID).like('chave',pref+'%').range(de,de+999);
    if(error) throw error; data.forEach(r=>out[r.chave]=r); if(data.length<1000) break; de+=1000;}
  Object.entries(pend).forEach(([k,e])=>{if(k.startsWith(pref)) out[k]={chave:k,etapa:e,user_nome:nomeUser(),updated_at:null,pend:1};});
  return out;
}
function mapaGravar(chave,etapa){pend[chave]=etapa; salvaPend(); statusSync(); mapaEnviar();}
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
  el.textContent=n?`⏳ ${n} marcação${n>1?'ões':''} aguardando internet`:'✓ salvo para a equipe';}
const fmtQuando=iso=>{if(!iso) return 'agora (aguardando envio)'; const d=new Date(iso); return d.toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});};
