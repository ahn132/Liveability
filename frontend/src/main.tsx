import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.js'

createRoot(document.getElementById('root')! as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>                                     
    </BrowserRouter>
  </StrictMode>,
)                                                               
