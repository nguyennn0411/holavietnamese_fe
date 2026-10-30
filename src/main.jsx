import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './i18n'
import './tailwind.css'
import './styles.css'
import './styles/layout.css'
import './styles/admin.css'
import './styles/home.css'
import './styles/dashboard.css'
import './styles/account.css'
import './styles/ai-tutor.css'
import './styles/design-system.css'
import './styles/heritage.css'
import './styles/auth.css'
import './styles/coach-ai-sidebar.css'
import './features/onboarding/styles/onboarding.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
