// Medição do avanço da obra a partir do mapa 3D (tabela obra_mapa, chaves '3d:<faixa>-<pav>#<etapa>').
// Fonte única usada por modelo3d.html, croqui.html e pelo app de vistoria (index.html). Não depende de supabase nem de DOM.
// Decisão de 20/10/2026 (Rogério): o mapa 3D é a fonte da verdade do avanço; o % declarado por serviço no app é estimativa do fiscal.
// Convenção das fachadas (observador na rua, olhando o prédio):
//   Fachada 1 — Frontal          = fc 'rua'
//   Fachada 2 — Lateral Esquerda = fc 'oposta'  (Oposta à Piscina)
//   Fachada 3 — Posterior        = fc 'churrasqueira'
//   Fachada 4 — Lateral Direita  = fc 'piscina'
const MED_FACH={rua:'Fachada 1 — Frontal',oposta:'Fachada 2 — Lateral Esquerda',churrasqueira:'Fachada 3 — Posterior',piscina:'Fachada 4 — Lateral Direita'};
const MED_PAV=16;
// Etapas do quadro (mesma ordem das tiras do 3D e da Planta). Cada etapa tem o seu % de área, para a medição por etapa
// (ex.: 30% das pastilhas removidas → libera 30% da etapa de remoção no cronograma físico-financeiro).
const MED_ETAPAS=['','Remoção de pastilhas','Tratamento / regularização','Fundo preparador','Revestimento final','Aprovado (fiscalização)'];
const MED_ETAPAS_CURTO=['','Remoção','Tratamento','Fundo','Revestimento','Aprovado'];
const MED_CORES=['','#e8a33d','#d8c24a','#8ec1e0','#2e7fb0','#2f9e5b'];
// Faixas de pastilha (id, área do croqui em m², fachada do cronograma AAM). Geometria de desenho fica em cada página.
const MED_FAIXAS=[
 {id:'b1',a:96,fc:'oposta'},{id:'b2',a:112,fc:'oposta'},{id:'b3',a:147.2,fc:'oposta'},{id:'b4',a:32,fc:'oposta'},{id:'b5',a:96,fc:'oposta'},{id:'b6',a:216,fc:'oposta'},
 {id:'b7',a:96,fc:'oposta'},{id:'b8',a:32,fc:'oposta'},{id:'b9',a:147.2,fc:'oposta'},{id:'b10',a:112,fc:'oposta'},{id:'b11',a:96,fc:'oposta'},
 {id:'r1',a:96,fc:'piscina'},{id:'r2',a:8,fc:'rua'},{id:'r3',a:182.4,fc:'rua'},
 {id:'f1',a:96,fc:'churrasqueira'},{id:'f2',a:8,fc:'rua'},{id:'f3',a:121.6,fc:'churrasqueira'},{id:'f4',a:16,fc:'churrasqueira'},
 {id:'t1',a:80,fc:'piscina'},{id:'t2',a:40,fc:'piscina'},{id:'t3',a:96,fc:'piscina'},{id:'t4',a:32,fc:'piscina'},{id:'t5',a:48,fc:'piscina'},{id:'t6',a:144,fc:'piscina'},{id:'t7',a:80,fc:'piscina'}];

// ---------- etapas registradas uma a uma ----------
const tem=(m,s)=>(m>>s)&1;
function etapasMontar(d,pref){
  const out={}, vazio=k=>out[k]=out[k]||{m:0,por:{},leg:0,step:{}};
  const linhas=Object.values(d).map(r=>{const c=r.chave.slice(pref.length), i=c.lastIndexOf('#'); return {r,k:i<0?c:c.slice(0,i),s:i<0?0:+c.slice(i+1)};});
  linhas.filter(x=>x.s).forEach(({r,k,s})=>{const o=vazio(k); o.step[s]=1; if(r.etapa){o.m|=1<<s; o.por[s]=r;}});
  linhas.filter(x=>!x.s).forEach(({r,k})=>{const o=vazio(k); o.leg=r.etapa; if(r.etapa&&!o.step[r.etapa]){o.m|=1<<r.etapa; o.por[r.etapa]=r;}});
  return out;
}
// Última etapa cumprida sem pulos (ini=2 nas sacadas, que não têm remoção)
function nivelDe(m,ini=1){let n=ini-1; while(n<5&&tem(m,n+1)) n++; return n<ini?0:n;}
// Etapas que faltam antes da mais avançada registrada
function faltando(m,ini=1){let top=0; for(let s=1;s<=5;s++) if(tem(m,s)) top=s; const f=[]; for(let s=ini;s<top;s++) if(!tem(m,s)) f.push(s); return f;}

// ---------- áreas medidas no projeto original ----------
// Medido nas elevações 1 a 4 do projeto Badaró (Folhas 08 a 11, esc. 1:50) em 04/10/2026.
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

// Área de uma faixa na base "projeto" (padrão da medição); faixa sem medida no projeto usa a do croqui.
function medArea(id){const f=MED_FAIXAS.find(x=>x.id===id); return (PROJ_ORIG[id]&&PROJ_ORIG[id].a)||(f?f.a:0);}

// Calcula o avanço medido. rows = linhas de obra_mapa com chave '3d:…' ({chave,etapa,updated_at}).
// Quadro conta como feito quando chegou ao revestimento (etapa 4) sem pular etapa anterior (mesma regra do resumo do 3D).
// Devolve {geral, area, feita, fach:{<nome app>:{pct,area,feita,quadros,feitos}}, pulados, quadros, atualizado}
function medirAvanco(rows){
  const d={}; let atualizado=null;
  (rows||[]).forEach(r=>{if(!r||!String(r.chave).startsWith('3d:'))return; d[r.chave]=r; if(r.updated_at&&(!atualizado||r.updated_at>atualizado)) atualizado=r.updated_at;});
  const st=etapasMontar(d,'3d:');
  const fach={}; Object.entries(MED_FACH).forEach(([fc,n])=>fach[n]={fc,pct:0,area:0,feita:0,quadros:0,feitos:0,et:[0,0,0,0,0,0],etArea:[0,0,0,0,0,0]});
  let pul=0;
  MED_FAIXAS.forEach(f=>{const a=medArea(f.id)/MED_PAV, o=fach[MED_FACH[f.fc]];
    for(let p=1;p<=MED_PAV;p++){const m=(st[`${f.id}-${p}`]||{m:0}).m; o.area+=a; o.quadros++; for(let s=1;s<=5;s++) if(tem(m,s)) o.etArea[s]+=a; if(nivelDe(m)>=4){o.feita+=a;o.feitos++;} if(faltando(m).length) pul++;}});
  let A=0,T=0,Q=0; const etArea=[0,0,0,0,0,0];
  // et[s] = área com a etapa s registrada ÷ área total (independe das outras etapas): é o % que vale para a medição daquela etapa.
  Object.values(fach).forEach(o=>{o.pct=o.area?o.feita/o.area*100:0; for(let s=1;s<=5;s++){o.et[s]=o.area?o.etArea[s]/o.area*100:0; etArea[s]+=o.etArea[s];} A+=o.feita; T+=o.area; Q+=o.quadros;});
  const et=etArea.map(v=>T?v/T*100:0);
  return {geral:T?A/T*100:0,area:T,feita:A,et,etArea,fach,pulados:pul,quadros:Q,atualizado,marcado:Object.keys(d).length>0};
}
const medPct=v=>(Math.round(v*10)/10).toFixed(1).replace('.',',')+'%';

// Texto curto do avanço por etapa de um objeto com et[] (geral ou fachada): "Remoção 12,5% · Tratamento 0,0% · …"
const medEtapasTxt=o=>o&&o.et?[1,2,3,4,5].map(s=>MED_ETAPAS_CURTO[s]+' '+medPct(o.et[s])).join(' · '):'';
