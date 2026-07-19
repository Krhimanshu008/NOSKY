'use client';

import ContentClient from '@/components/ContentClient';

export default function ArticleClient({ article }) {
  return (
    <ContentClient
      item={article}
      backPath="/article"
      backLabel="All Articles"
      scrollPromptText="Scroll down to read full article"
    />
  );
}
