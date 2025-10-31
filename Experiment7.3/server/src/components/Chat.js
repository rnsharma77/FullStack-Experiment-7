import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const [username, setUsername] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // { type: 'chat'|'system', username, message, time }
  const [users, setUsers] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    s.on('chat message', (payload) => {
      setMessages((prev) => [...prev, { type: 'chat', ...payload }]);
    });

    s.on('system message', (text) => {
      setMessages((prev) => [...prev, { type: 'system', message: text, time: new Date().toISOString() }]);
    });

    s.on('users', (userList) => {
      setUsers(userList);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitName = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || !socket) return;
    socket.emit('join', trimmed);
    setNameSubmitted(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !socket) return;

    const payload = {
      username,
      message: trimmed,
      time: new Date().toISOString()
    };

    socket.emit('chat message', payload);
    setMessage('');
    // optional: push immediately (server will also broadcast it back)
    // setMessages(prev => [...prev, { type: 'chat', ...payload }]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.panel}>
          <h3>Connected: {connected ? 'Yes' : 'No'}</h3>
          {!nameSubmitted ? (
            <form onSubmit={submitName} style={styles.form}>
              <input
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.btn}>Join</button>
            </form>
          ) : (
            <div>
              <p style={{ margin: '8px 0' }}><strong>You:</strong> {username}</p>
              <button onClick={() => { socket && socket.emit('join', username); }} style={styles.btnSmall}>
                Reannounce
              </button>
            </div>
          )}
          <hr />
          <h4>Online ({users.length})</h4>
          <ul style={styles.userList}>
            {users.map((u, idx) => <li key={idx}>{u}</li>)}
          </ul>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.messagesPanel}>
          <div style={styles.messages}>
            {messages.map((m, idx) => (
              <MessageItem key={idx} item={m} currentName={username} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} style={styles.messageForm}>
            <input
              placeholder={nameSubmitted ? "Type a message..." : "Join the chat to send messages"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.messageInput}
              disabled={!nameSubmitted}
            />
            <button type="submit" style={styles.sendBtn} disabled={!nameSubmitted || !message.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const MessageItem = ({ item, currentName }) => {
  if (item.type === 'system') {
    return (
      <div style={styles.systemMessage}>
        <em>{item.message}</em>
      </div>
    );
  }

  // chat message
  const mine = item.username === currentName;
  return (
    <div style={{ ...styles.messageItem, alignSelf: mine ? 'flex-end' : 'flex-start', background: mine ? '#dcf8c6' : '#fff' }}>
      <div style={{ fontSize: 12, color: '#555' }}>
        <strong>{item.username}</strong> <span style={{ fontSize: 11, marginLeft: 6 }}>{new Date(item.time).toLocaleTimeString()}</span>
      </div>
      <div style={{ marginTop: 6 }}>{item.message}</div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: 20, maxWidth: 1000, margin: '20px auto' },
  left: { width: '28%' },
  right: { width: '72%' },

  panel: { background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  form: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: 8, fontSize: 14 },
  btn: { padding: '8px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSmall: { padding: '6px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8 },

  userList: { listStyle: 'none', padding: 0, marginTop: 8 },

  messagesPanel: { height: '70vh', display: 'flex', flexDirection: 'column' },
  messages: { flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 8, background: '#e9eef3' },
  messageItem: { maxWidth: '70%', padding: 10, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },

  systemMessage: { textAlign: 'center', color: '#666', fontSize: 13, margin: '6px 0' },

  messageForm: { display: 'flex', gap: 8, marginTop: 10 },
  messageInput: { flex: 1, padding: 10, fontSize: 14, borderRadius: 6, border: '1px solid #ccc' },
  sendBtn: { padding: '10px 14px', borderRadius: 6, background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }
};

export default Chat;
