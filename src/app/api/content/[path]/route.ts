// app/api/content/[path]/route.ts
import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cwd } from 'process';
import { marked } from 'marked';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    // Use process.cwd() to get the root directory
    const resolvedParams = await params;
    const filePath = path.join(cwd() + '/src', 'content', `${resolvedParams.path}.md`);
    const markdown = await fs.readFile(filePath, 'utf8');
    
    // Convert markdown to HTML
    const content = marked(markdown, {
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
    });

    return new Response(JSON.stringify({ content }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error loading content:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to load content',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}