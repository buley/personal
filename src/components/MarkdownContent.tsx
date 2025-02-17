import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface MarkdownContentProps {
  path: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ path }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/content/${path}`);
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (path) {
      fetchContent();
    }
  }, [path]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <article className="prose prose-invert prose-sm md:prose-base lg:prose-lg">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default MarkdownContent;