import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './i18n'
import './tailwind.css'
import './styles.css'
import './presentation/styles/layout.css'
import './presentation/styles/admin.css'
import './presentation/styles/home.css'
import './presentation/styles/dashboard.css'
import './presentation/styles/account.css'
import './presentation/styles/ai-tutor.css'
import './presentation/styles/design-system.css'
import './presentation/styles/heritage.css'
import './presentation/styles/auth.css'
import './features/onboarding/styles/onboarding.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
