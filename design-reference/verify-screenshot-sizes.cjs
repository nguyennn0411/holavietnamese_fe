const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/An/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
 const dir='docs/screenshots', failures=[];
 const files=fs.readdirSync(dir).filter(name=>/^[a-z_]+-(1440|1280|768|375)\.jpg$/i.test(name));
 for(const file of files){const expected=Number(file.match(/-(\d+)\.jpg$/)[1]);const meta=await sharp(path.join(dir,file)).metadata();if(meta.width>expected||meta.width<expected-20)failures.push({file,expected,width:meta.width});}
 console.log(JSON.stringify({files:files.length,failures}));
 if(failures.length)process.exit(1);
})();
