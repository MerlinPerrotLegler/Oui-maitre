"use client";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function PlayerView() {
  const [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.emit('subscribe', { world_id: 'demo' });
    socket.on('event', (e) => setEvents((prev) => [JSON.stringify(e), ...prev].slice(0, 10)));
    return () => { socket.close(); };
  }, []);
  return (
    <main style={{ padding: 16 }}>
      <h2>Autour de moi (demo)</h2>
      <p>Notifications temps réel (derniers événements)</p>
      <ul>{events.map((e, i) => (<li key={i}><code>{e}</code></li>))}</ul>
    </main>
  );
}

