import fs from 'node:fs';
for(const f of ['04_Course_Detail','03_Learn','05_Explore_Vietnam','01_Login']){
const s=fs.readFileSync('design-reference/Hola_Vietnamese_Figma_Import_Package/'+f+'.svg','utf8');
console.log(f,s.match(/<svg[^>]*>/)[0]); console.log([...s.matchAll(/<rect[^>]*>/g)].map(m=>m[0]).filter(m=>{const w=Number(m.match(/width="([^"]*)"/)?.[1]); return w>200;}).slice(0,18).join('\n'));
}
