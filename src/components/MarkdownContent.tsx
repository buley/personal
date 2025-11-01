import React, { useEffect, useState } from 'react';

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
      <div className="animate-pulse min-h-[50vh]">
        <div className="space-y-6">
          <div className="h-12 bg-white/5 rounded w-3/4"></div>
          <div className="h-6 bg-white/5 rounded w-full"></div>
          <div className="h-6 bg-white/5 rounded w-5/6"></div>
          <div className="h-6 bg-white/5 rounded w-full"></div>
          <div className="h-6 bg-white/5 rounded w-4/5"></div>
          <div className="h-8 bg-white/5 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-6 bg-white/5 rounded w-full"></div>
            <div className="h-6 bg-white/5 rounded w-11/12"></div>
            <div className="h-6 bg-white/5 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="prose prose-invert prose-sm md:prose-base lg:prose-lg prose-loading">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default MarkdownContent;