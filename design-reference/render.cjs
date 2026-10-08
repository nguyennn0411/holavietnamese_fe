const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/An/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
 const dir='design-reference/Hola_Vietnamese_Figma_Import_Package';
 const files=fs.readdirSync(dir).filter(f=>/^\d\d_.*svg$/.test(f)).sort();
 for (const file of files) await sharp(path.join(dir,file)).png().toFile('design-reference/rendered/'+file.replace('.svg','.png'));
 for(let i=0;i<files.length;i+=4){
  const layers=[];
  for(let j=0;j<4 && i+j<files.length;j++){
   const buf=await sharp('design-reference/rendered/'+files[i+j].replace('.svg','.png')).resize({width:720,height:510,fit:'contain',background:'#ffffff'}).toBuffer();
   layers.push({input:buf,left:(j%2)*720,top:Math.floor(j/2)*540+30});
   const label=Buffer.from(`<svg width="720" height="30"><text x="14" y="21" font-size="18" font-family="Arial">${files[i+j]}</text></svg>`);
   layers.push({input:label,left:(j%2)*720,top:Math.floor(j/2)*540});
  }
  await sharp({create:{width:1440,height:1080,channels:3,background:'#ffffff'}}).composite(layers).png().toFile(`design-reference/rendered/contact-${i/4}.png`);
 }
})();
