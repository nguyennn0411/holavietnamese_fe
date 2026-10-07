import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../src/App';
import { MediaCheck } from './MediaCheck';
import '../src/styles.css';
import '../src/presentation/styles/layout.css';
import '../src/presentation/styles/admin.css';
import '../src/presentation/styles/auth.css';
import '../src/presentation/styles/home.css';
import '../src/presentation/styles/dashboard.css';
import '../src/presentation/styles/account.css';
import '../src/presentation/styles/ai-tutor.css';
import '../src/presentation/styles/design-system.css';
const qaParams = new URLSearchParams(location.search);
const screen = qaParams.get('screen') || (location.pathname.startsWith('/qa/') ? '/' : location.pathname + location.search);
const screenUrl = new URL(screen, location.origin);
// Lazy page modules must still see the fixture mode after the initial route rewrite.
for (const key of ['fixture', 'role', 'avatar']) {
  if (qaParams.has(key)) screenUrl.searchParams.set(key, qaParams.get(key));
}
history.replaceState(null,'',screenUrl.pathname + screenUrl.search + screenUrl.hash);
createRoot(document.getElementById('root')).render(<><div className="qa-label" style={{position:'fixed',bottom:0,right:0,zIndex:9999,fontSize:10,background:'#24362F',color:'#FFFDF8',padding:'3px 8px',pointerEvents:'none'}}>QA · dữ liệu minh họa · cổng 5174</div>{qaParams.has('media-check') ? <MediaCheck /> : <App/>}</>);
