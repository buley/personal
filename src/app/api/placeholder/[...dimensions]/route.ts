// app/api/placeholder/[...dimensions]/route.ts
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  try {
    // Extract width and height from the URL parameters
    const [width, height] = params.dimensions.map(Number);

    // Validate dimensions
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return new Response('Invalid dimensions', { status: 400 });
    }

    // Generate a random color for the placeholder
    const fillColor = Math.floor(Math.random() * 16777215).toString(16);
    
    // Create a simple SVG with the specified dimensions
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${fillColor}"/>
      </svg>
    `;

    // Return the SVG
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
