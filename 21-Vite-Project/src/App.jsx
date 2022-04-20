import React from 'react'
import './App.css'
import ButtonFunction from './button_function'

import ViteSvg from './public/Vite.svg'

function App() {

  return (
    <div className="App">
      <header className="App-header">

        <img src={ViteSvg} alt="First slide" />

        <h1>This is Vite React</h1>
        <p>WGS Bootcamp ReactJS</p>
      </header>

      <section className='App-section'>
        <ButtonFunction></ButtonFunction>
      </section>
    </div>
  )
}

export default App
