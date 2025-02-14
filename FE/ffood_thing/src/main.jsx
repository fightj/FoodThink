import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // 두번 렌더링
  <StrictMode>
    <App />
  </StrictMode>,
)
