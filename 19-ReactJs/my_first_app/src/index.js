import React from 'react';
import ReactDOM  from 'react-dom';
import './styles.css';

const element = (
<div class='main'>

    <div class = 'nav-bar'>
    <h2>BootCamp Batch 1 : Experiment with REACTJS</h2>
    <ul className='nav-items'>
        <a href='#'><li>Home</li></a>
        <a href='#'><li>About</li></a>
        <a href='#'><li>Contact</li></a>
    </ul>
    </div>

    <div class='content'>
        <h1>This is React</h1>
    </div>

</div>
);
ReactDOM.render(element, document.getElementById("root"))