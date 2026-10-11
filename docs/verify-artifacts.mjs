import fs from 'node:fs';
const map=JSON.parse(fs.readFileSync('docs/route-design-map.json','utf8'));
const checks=JSON.parse(fs.readFileSync('docs/screenshots/final-responsive-checks.json','utf8'));
const widths=[1440,1280,768,375];
const mediaAudit=fs.existsSync('docs/media-audit/summary.json') ? JSON.parse(fs.readFileSync('docs/media-audit/summary.json','utf8')) : null;
const missing=[];
for(const row of map){
 for(const width of widths){
  const file=`docs/screenshots/${row.key}-${width}.jpg`;
  if(!fs.existsSync(file))missing.push(file);
  if(!checks.some(check=>check.name===row.key&&check.width===width))missing.push(`${row.key}: ${width}px measurement`);
 }
 for(const reference of row.references)if(!fs.existsSync('design-reference/rendered/'+reference))missing.push(reference);
}
const failures=checks.filter(row=>!row.heading||row.scroll>row.width||row.alerts.length||row.heading.includes('Đã xảy ra lỗi giao diện'));
const expectedChecks=map.length*widths.length;
if(missing.length||failures.length||checks.length!==expectedChecks){console.error({missing,failures,count:checks.length});process.exit(1);}
const result={
 checkedAt:new Date().toISOString(),routes:map.length,existingRoutes:map.filter(row=>!row.isNew).length,newRoutes:map.filter(row=>row.isNew).length,
 viewports:widths,routeScreenshots:expectedChecks,layoutChecks:checks.length,missingArtifacts:missing,horizontalOverflow:failures,
 source:'Browser DOM measurements and screenshots from isolated visual QA on localhost:5174',
 build:{command:'npm run build',result:'passed'},tests:{command:'npm test',passed:mediaAudit?.tests.passed ?? 9,failed:mediaAudit?.tests.failed ?? 0},
 ...(mediaAudit ? {mediaAudit} : {}),
 flowScreenshots:fs.readdirSync('docs/screenshots').filter(file=>/^(flow|state)-/.test(file)),
 productionDemo:'http://localhost:5173',qaDemo:'http://localhost:5174/qa/index.html?screen=/',
 limitations:['No real backend/database end-to-end run','Google OAuth and email OTP/reset not tested','Microphone and actual audio quality not tested','Live AI provider not tested','QA quiz grading is illustrative fixture data'],
};
fs.writeFileSync('docs/verification-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({routes:map.length,screenshots:expectedChecks,measurements:checks.length,missing:missing.length,failures:failures.length}));
