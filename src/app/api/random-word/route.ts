import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface LexiconEntry {
  word: string;
  definition: string;
}

let cachedLexicon: LexiconEntry[] | null = null;

function getAllLexiconEntries(): LexiconEntry[] {
  if (cachedLexicon) return cachedLexicon;

  const lexiconPath = path.join(process.cwd(), 'src', 'content', 'lexicon.md');
  const content = fs.readFileSync(lexiconPath, 'utf-8');

  const entries: LexiconEntry[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('- **')) {
      const match = line.match(/- \*\*(.+?):\*\* (.+)/);
      if (match) {
        const word = match[1].trim();
        const definition = match[2].trim();
        entries.push({
          word,
          definition
        });
      }
    }
  }

  cachedLexicon = entries;
  return entries;
}

export async function GET() {
  try {
    const entries = getAllLexiconEntries();
    const randomEntry = entries[Math.floor(Math.random() * entries.length)];

    return NextResponse.json(randomEntry);
  } catch (error) {
    console.error('Error getting random word:', error);
    return NextResponse.json({ error: 'Failed to get word' }, { status: 500 });
  }
}