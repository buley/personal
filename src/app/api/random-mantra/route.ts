import { promises as fs } from 'fs';
import path from 'path';

interface Mantra {
  mantra: string;
  section: string;
}

let cachedMantras: Mantra[] | null = null;

async function getAllMantras(): Promise<Mantra[]> {
  if (cachedMantras) return cachedMantras;

  const mantrasPath = path.join(process.cwd(), 'src', 'content', 'mantras.md');
  const content = await fs.readFile(mantrasPath, 'utf-8');

  const sections = content.split(/^## /m).slice(1); // Skip intro

  const mantras: Mantra[] = [];

  for (const section of sections) {
    const lines = section.split('\n');
    const sectionTitle = lines[0].trim();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- ')) {
        const mantra = line.replace(/^- /, '');
        mantras.push({ mantra, section: sectionTitle });
      }
    }
  }

  cachedMantras = mantras;
  return mantras;
}

export async function GET() {
  try {
    const mantras = await getAllMantras();
    const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];

    return new Response(JSON.stringify(randomMantra), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error getting random mantra:', error);
    return new Response(JSON.stringify({ error: 'Failed to get mantra' }), { status: 500 });
  }
}