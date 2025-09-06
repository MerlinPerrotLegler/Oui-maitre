import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Oui-Maître</h1>
      <p>Frontend minimal (iteration 08 scaffold)</p>
      <ul>
        <li><Link href="/player">Vue Joueur</Link></li>
        <li><Link href="/world">Vue Monde</Link></li>
        <li><Link href="/groups">Vue Groupes</Link></li>
        <li><a href="/oauth/google/start">Connexion Google</a></li>
      </ul>
    </main>
  );
}

