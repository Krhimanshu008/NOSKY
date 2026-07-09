'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DelayedPrefetch({ routes = [], delay = 5000 }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [routes, delay, router]);

  return null;
}
