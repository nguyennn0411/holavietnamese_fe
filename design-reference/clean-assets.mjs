import fs from 'node:fs';
for (const name of ['vietnam-map','dong-son']) {
 let s=fs.readFileSync(`public/design/${name}.svg`,'utf8');
 console.log(name,s.match(/<svg[^>]*>/)[0],[...s.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(m=>m[1]).slice(0,10));
 s=s.replace(/<text\b[^>]*>(?:Vietnam Journey Map Asset|Dong Son Watermark Asset|Dong Son watermark component)[^<]*<\/text>/g,'');
 fs.writeFileSync(`public/design/${name}.svg`,s);
}
