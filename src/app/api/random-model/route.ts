import { promises as fs } from 'fs';
import path from 'path';

interface Model {
  title: string;
  subtitle: string;
  description: string;
  application: string;
}

let cachedModels: Model[] | null = null;

async function getAllModels(): Promise<Model[]> {
  if (cachedModels) return cachedModels;

  const modelsPath = path.join(process.cwd(), 'src', 'content', 'models.md');
  const content = await fs.readFile(modelsPath, 'utf-8');

  const sections = content.split(/^## /m).slice(1); // Skip the intro

  const models: Model[] = [];

  for (const section of sections) {
    const lines = section.split('\n');
    const titleLine = lines[0].trim();
    const title = titleLine.replace(/^\d+\.\s*/, ''); // Remove "1. "

    let subtitle = '';
    let description = '';
    let application = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('*') && line.endsWith('*')) {
        subtitle = line.replace(/^\*/, '').replace(/\*$/, '');
      } else if (line.startsWith('- **Description:**')) {
        description = line.replace(/^- \*\*Description:\*\* /, '');
      } else if (line.startsWith('- **Application:**')) {
        application = line.replace(/^- \*\*Application:\*\* /, '');
      }
    }

    if (title && description && application) {
      models.push({ title, subtitle, description, application });
    }
  }

  cachedModels = models;
  return models;
}

export async function GET() {
  try {
    const models = await getAllModels();
    const randomModel = models[Math.floor(Math.random() * models.length)];

    return new Response(JSON.stringify(randomModel), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error getting random model:', error);
    return new Response(JSON.stringify({ error: 'Failed to get model' }), { status: 500 });
  }
}