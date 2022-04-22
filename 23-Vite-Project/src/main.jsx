import React from 'react'
import ReactDOM from 'react-dom/client'
import Navigation from './navbar'
import App from './App'
import ContactFunction from './contact_functions'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navigation />
    <App />
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('contact')).render( 
  <React.StrictMode>
    <ContactFunction />
  </React.StrictMode>
)
