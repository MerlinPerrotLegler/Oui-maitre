"use client";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function PlayerView() {
  const [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.emit('subscribe', { world_id: 'demo' });
    socket.on('event', (e: any) => {
      setEvents((prev) => [JSON.stringify(e), ...prev].slice(0, 10));
      if (e?.type === 'sound.play') {
        const url = e?.data?.url;
        const volume = e?.data?.volume ?? 1;
        if (url) {
          const audio = new Audio(url);
          audio.volume = Math.max(0, Math.min(1, volume));
          audio.play().catch(() => {});
        }
      }
    });
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
