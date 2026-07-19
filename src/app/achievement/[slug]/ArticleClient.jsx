'use client';

import ContentClient from '@/components/ContentClient';

export default function ArticleClient({ article }) {
  return (
    <ContentClient
      item={article}
      backPath="/achievements"
      backLabel="All Achievements"
      scrollPromptText="Scroll down to read full achievement"
    />
  );
}
