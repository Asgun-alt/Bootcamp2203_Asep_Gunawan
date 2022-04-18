import React from 'react';

const nav = () => {
    return (
        <div class='main'>

            <div class='nav-bar'>
                <h2>BootCamp Batch 1 : Experiment with REACTJS</h2>
                <ul className='nav-items'>
                    <a href='./mainContent.js'><li>Home</li></a>
                    <a href='./mainContent.js'><li>About</li></a>
                    <a href='./mainContent.js'><li>Contact</li></a>
                    <li>{new Date().toLocaleTimeString()}</li>
                </ul>
            </div>

        </div>
    );
};

export default nav