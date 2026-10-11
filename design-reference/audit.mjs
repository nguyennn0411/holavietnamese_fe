import fs from 'node:fs';
import path from 'node:path';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk('src').filter(f=>/\.(jsx|js|css)$/.test(f));
const audit=files.map(file=>{const text=fs.readFileSync(file,'utf8'); return {file,bytes:text.length,imports:[...text.matchAll(/from\s+['"]([^'"]+)/g)].map(m=>m[1]),functions:[...text.matchAll(/(?:function\s+|const\s+)([A-Za-z]\w*)\s*(?:\(|=\s*(?:async\s*)?\()/g)].map(m=>m[1]),services:[...new Set([...text.matchAll(/\b(\w+Service\.\w+)\(/g)].map(m=>m[1]))],classNames:[...new Set([...text.matchAll(/className="([^"]+)"/g)].map(m=>m[1]))],dialogs:(text.match(/Modal|Drawer|role="dialog"/g)||[]).length,colors:[...new Set(text.match(/#[0-9a-f]{3,8}\b/ig)||[])]};});
fs.mkdirSync('docs',{recursive:true}); fs.writeFileSync('docs/source-inventory.json',JSON.stringify(audit,null,2));
for(const item of audit.filter(f=>f.file.includes('pages'))) console.log(item.file, item.services.join(', '), item.classNames.slice(0,12).join(' | '));
