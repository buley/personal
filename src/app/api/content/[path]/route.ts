// app/api/content/[path]/route.ts
import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cwd } from 'process';
import { marked, MarkedOptions } from 'marked';

const renderer = new marked.Renderer();

renderer.blockquote = function (token) {
  // Use the block parser instead of the inline parser.
  let html = this.parser.parse(token.tokens);

  // Remove the <p> tags that are automatically added by the block parser.
  html = html.replace(/^<p>|<\/p>$/g, "");
  html = html.replace(/<\/p>/g, "");

  console.log(html);

  return `<blockquote>${html}</blockquote>`;
};

marked.setOptions({
  renderer,
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string }> }  // Note the Promise type here
) {
  try {
    // Await the params before destructuring
    const { path: contentPath } = await context.params;

    // Build the file path properly using cwd()
    const filePath = path.join(cwd(), 'src', 'content', `${contentPath}.md`);
    const markdown = await fs.readFile(filePath, 'utf8');
    
    const options: MarkedOptions = {
      gfm: true,   // GitHub Flavored Markdown
      breaks: true // Convert line breaks to <br>
    };

    // Convert markdown to HTML
    const content = marked(markdown, options);

    return new Response(JSON.stringify({ content }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
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
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
