import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const path = name => fileURLToPath(new URL(name, import.meta.url));
// Isolated visual QA only. Production config and authentication are untouched.
export default defineConfig({ root:path('../'), plugins:[react(), {
 name:'isolated-qa-navigation',
 configureServer(server){server.middlewares.use((request,response,next)=>{
  if(request.method==='GET' && request.headers.accept?.includes('text/html') && !request.url.startsWith('/qa/'))request.url='/qa/index.html';
  next();
 });}
}], resolve:{ alias:[
 {find:'@/application/context/AuthContext',replacement:path('./FixtureAuth.jsx')},
 {find:'@/api/httpClient',replacement:path('./fixtureHttpClient.js')},
 {find:'@/infrastructure/api/axiosClient',replacement:path('./fixtureAxios.js')},
 {find:'@',replacement:path('../src')},
]}, server:{port:5174,strictPort:true,host:'localhost'} });

