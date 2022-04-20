import React from 'react';
import ReactDOM  from 'react-dom';
import './styles.css';
import  Nav  from './nav';
import  MainContent  from './mainContent';
import  Items  from './items';

function renderDOM(content, id) {
    ReactDOM.render(content, document.getElementById(id))
}

renderDOM(<Nav />, ("nav"))
renderDOM(<MainContent />,("root"))