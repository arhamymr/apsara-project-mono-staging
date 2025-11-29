import { generateTOCFromDOM } from '@/lib/legal-utils';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>(items || []);

  useEffect(() => {
    // Auto-generate TOC from page sections if not provided
    if (!items || items.length === 0) {
      // Wait for DOM to be ready
      const timer = setTimeout(() => {
        setTocItems(generateTOCFromDOM());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [items]);

  useEffect(() => {
    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' },
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-20" aria-label="Table of contents">
      <h3 className="mb-4 text-sm font-semibold">On This Page</h3>
      <ul className="space-y-2 text-sm" role="list">
        {tocItems.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            role="listitem"
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                'hover:text-primary focus:ring-primary block rounded-sm py-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground',
              )}
              aria-current={activeId === item.id ? 'location' : undefined}
              aria-label={`Jump to section: ${item.title}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
