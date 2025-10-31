import React from 'react';
import Chat from './components/Chat';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f6f6f6', minHeight: '100vh' }}>
      <header style={{ padding: 20, textAlign: 'center', background: '#282c34', color: 'white' }}>
        <h1>Real-Time Chat (Socket.io)</h1>
      </header>
      <main style={{ padding: 20 }}>
        <Chat />
      </main>
    </div>
  );
}

export default App;
