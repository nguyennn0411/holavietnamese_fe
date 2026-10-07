import fs from 'node:fs';
let s=fs.readFileSync('src/pages/ai-tutor/AiTutorPage.jsx','utf8');
const start=s.indexOf('          {/* 7 Modes Switcher Bar */}'); const end=s.indexOf('          {/* Current Mode Banner */}',start);
const block=s.slice(start,end);
if(start>=0&&end>=0){s=s.slice(0,start)+s.slice(end);s=s.replace('          <div className="tutor-history-list">',block+'          <p className="eyebrow">Cuộc trò chuyện gần đây</p>\n          <div className="tutor-history-list">');}
s=s.replace('<h1 className="p4-title">Hola AI Tutor</h1>','<h1 className="p4-title">Một cuộc trò chuyện nhỏ, một bước tiến xa.</h1>');
fs.writeFileSync('src/pages/ai-tutor/AiTutorPage.jsx',s);
