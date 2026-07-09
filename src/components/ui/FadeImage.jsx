'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function FadeImage({ alt, className = '', style = {}, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      alt={alt}
      {...props}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
      onLoad={() => setLoaded(true)}
    />
  );
}
