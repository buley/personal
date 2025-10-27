import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Fragment {
  title: string;
  content: string;
  source: string;
}

let cachedFragments: Fragment[] | null = null;

function getAllFragments(): Fragment[] {
  if (cachedFragments) return cachedFragments;

  const contentDir = path.join(process.cwd(), 'src', 'content');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

  const fragments: Fragment[] = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const source = file.replace('.md', '');

    // Split by ## headers (h2)
    const sections = content.split(/^## /m);

    for (let i = 1; i < sections.length; i++) { // Skip the first part (before first ##)
      const section = sections[i];
      const lines = section.split('\n');
      let title = lines[0].trim();
      title = title.replace(/\*\*/g, ''); // Remove bold markdown
      title = title.replace(/^\d+\.\s*/, ''); // Remove numbered prefixes like "1. "
      title = title.replace(/^[IVXLCDM]+\.\s*/i, ''); // Remove Roman numeral prefixes like "I. "
      title = title.replace(/:$/, ''); // Remove colon at the end
      const body = lines.slice(1).join('\n').trim();

      if (body.length > 50 && body.length < 1000) { // Filter for coherent chunks
        fragments.push({
          title,
          content: body,
          source
        });
      }
    }
  }

  cachedFragments = fragments;
  return fragments;
}

export async function GET() {
  try {
    const fragments = getAllFragments();
    const randomFragment = fragments[Math.floor(Math.random() * fragments.length)];

    return NextResponse.json(randomFragment);
  } catch (error) {
    console.error('Error getting random fragment:', error);
    return NextResponse.json({ error: 'Failed to get fragment' }, { status: 500 });
  }
}