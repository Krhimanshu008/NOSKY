import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLdScript from './JsonLdScript';
import { getBreadcrumbSchema } from '@/lib/schema';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const fullItems = [
    { name: 'Home', url: '/' },
    ...items,
  ];

  const schema = getBreadcrumbSchema(fullItems);

  return (
    <>
      <JsonLdScript data={schema} />
      <nav aria-label="Breadcrumb" className="py-3 px-1">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
                {isLast ? (
                  <span className="text-gray-200 font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="w-3.5 h-3.5" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
