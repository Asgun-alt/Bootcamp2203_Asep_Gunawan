import React from 'react'
import ReactDOM from 'react-dom/client'
import Navigation from './navbar'
import App from './App'
import ContactList from './contact_page'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navigation />
    <App />
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('contact')).render( 
  <React.StrictMode>
    <ContactList />
  </React.StrictMode>
)
