// app/api/advice/route.ts

import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'advice.md');
    const content = await fs.readFile(filePath, 'utf-8');

    // Parse quotes from the markdown
    const lines = content.split('\n');
    const quotes: { quote: string; source?: string }[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('>') || trimmed.startsWith('- *')) {
        // Remove the > or - * and clean up
        let fullQuote = trimmed.replace(/^>\s*/, '').replace(/^- \*\s*/, '').trim();
        // Split on -- for author
        const parts = fullQuote.split(' -- ');
        let quote = parts[0].trim();
        const source = parts[1]?.trim();
        // Remove surrounding * if present
        quote = quote.replace(/^\*/, '').replace(/\*$/, '');
        if (quote) {
          quotes.push({ quote, source });
        }
      }
    }

    if (quotes.length === 0) {
      return new Response(JSON.stringify({ error: 'No quotes found' }), { status: 404 });
    }

    const randomItem = quotes[Math.floor(Math.random() * quotes.length)];

    return new Response(JSON.stringify({ quote: randomItem.quote, source: randomItem.source }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch random quote:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch random quote' }),
      { status: 500 }
    );
  }
}