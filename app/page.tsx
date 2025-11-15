import { Problem } from '@/types';
import problemsData from '@/data/problems.json';

// Static Generation - Forzar generación estática para mejor caché
export const dynamic = 'force-static';

export default function Home() {
  const problemsList = (problemsData as Problem[]).map((p: Problem) => ({ id: p.id, title: p.title }));

  return (
    <div style={{ fontFamily: 'serif', backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '20px' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>LeetCode Lite</h1>
        <p style={{ marginBottom: '20px' }}>Selecciona un problema para ver sus soluciones:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {problemsList.map((problem: { id: string; title: string }) => (
            <li key={problem.id} style={{ marginBottom: '10px' }}>
              <a
                href={`/problems/${problem.id}`}
                style={{ textDecoration: 'none', color: 'black', display: 'block', padding: '10px', border: '1px solid #ccc' }}
              >
                {problem.title}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
