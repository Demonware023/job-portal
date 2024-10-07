// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching data!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Board Frontend</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
