import fs from 'node:fs';
const dir='design-reference/Hola_Vietnamese_Figma_Import_Package/';
const source=fs.readFileSync(dir+'03_Learn.svg','utf8').replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
const crops={food:[74,485,600,114.75],coffee:[696,485,628,114.75],village:[74,820,390,146.25],coast:[74,1175,390,146.25],lanterns:[906,1175,418,146.25]};
for (const [name,box] of Object.entries(crops)) {
 const body=source.replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
 fs.writeFileSync(`public/design/${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}">${body}</svg>`);
}
const detail=fs.readFileSync(dir+'04_Course_Detail.svg','utf8').replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
fs.writeFileSync('public/design/food-hero.svg',detail.replace(/<svg[^>]*>/,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="820 105 504 295">'));
fs.copyFileSync(dir+'Asset_Vietnam_Map.svg','public/design/vietnam-map.svg');
fs.copyFileSync(dir+'Asset_Dong_Son_Watermark.svg','public/design/dong-son.svg');
