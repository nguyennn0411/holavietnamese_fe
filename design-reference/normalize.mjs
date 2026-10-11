import fs from 'node:fs'; import path from 'node:path';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const palette={ink:'#24362F',muted:'#7F817A',red:'#B43B32','red-hover':'#963027',sage:'#71866D',gold:'#C9A04F',sand:'#EFE8DB',cream:'#F8F6F1',surface:'#FFFDF8',border:'#E3DED4','red-soft':'#F7E7E1','sage-soft':'#EDF2E8','gold-soft':'#F6EDD3'};
const rgb=h=>h.length===4?[...h.slice(1)].map(v=>parseInt(v+v,16)):[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function token(hex){if(hex.length!==4&&hex.length!==7)return hex; const c=rgb(hex); let best; let dist=Infinity; for(const [key,value] of Object.entries(palette)){const d=rgb(value).reduce((s,v,i)=>s+(v-c[i])**2,0); if(d<dist){dist=d;best=key;}}return `var(--color-${best})`;}
for(const f of walk('src').filter(f=>/\.(jsx|css)$/.test(f)&&!f.endsWith('Ui.jsx'))){let s=fs.readFileSync(f,'utf8'); if(f.endsWith('.css')) s=s.replace(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/ig,token); else s=s.replace(/(['"])(#[0-9a-f]{6}|#[0-9a-f]{3})\1/ig,(m,q,h)=>`${q}${token(h)}${q}`); fs.writeFileSync(f,s);}
