// app/api/faq/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { cwd } from 'process';

interface FAQItem {
  question: string;
  answer: string;
}

export async function GET() {
  try {
    // Read the FAQ markdown file
    const filePath = path.join(cwd(), 'src', 'content', 'faq.md');
    const markdown = await fs.readFile(filePath, 'utf8');

    // Parse the markdown to extract Q&A pairs
    const faqItems: FAQItem[] = [];
    const lines = markdown.split('\n');

    let currentQuestion = '';
    let currentAnswer = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if this is a question (starts with ** and ends with **?)
      if (line.startsWith('**') && line.endsWith('**?') && line.includes('?')) {
        // Save previous Q&A pair if exists
        if (currentQuestion && currentAnswer) {
          faqItems.push({
            question: currentQuestion,
            answer: currentAnswer.trim()
          });
        }

        // Start new Q&A pair
        currentQuestion = line.slice(2, -3); // Remove ** and ? at end
        currentAnswer = '';
      }
      // Check if this is an answer line (not a header, not empty, not a question)
      else if (currentQuestion && line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('*') && !line.startsWith('**')) {
        currentAnswer += line + ' ';
      }
    }

    // Add the last Q&A pair
    if (currentQuestion && currentAnswer) {
      faqItems.push({
        question: currentQuestion,
        answer: currentAnswer.trim()
      });
    }

    // Return a random FAQ item
    if (faqItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * faqItems.length);
      const randomFAQ = faqItems[randomIndex];

      return new Response(JSON.stringify(randomFAQ), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'No FAQ items found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Error loading FAQ:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to load FAQ',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}