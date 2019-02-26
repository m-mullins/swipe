import React from 'react';
import Stack from './Stack';
import './App.css';

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'swipe-dog:*');
}

function App(props) {
    return (
        <div className="App">
          <div id="viewport">
            <div style={{display: 'contents'}}>
              <Stack />
            </div>
          </div>
        </div>
    )
}

export default App;