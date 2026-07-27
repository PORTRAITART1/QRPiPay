import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Import design system & global styles
import './styles/design-tokens.css'
import './styles/gradients-effects.css'
import './styles/globals.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
