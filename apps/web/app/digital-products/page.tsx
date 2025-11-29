'use client';

import { Background, Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { Button } from '@/components/ui/button';
import { DIGITAL_PRODUCTS_STRINGS } from '@/i18n/digital-products';
import { useLocale } from '@/i18n/LocaleContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Grid3X3, Image, Layout } from 'lucide-react';
import { useState } from 'react';

function useStrings() {
  const { lang } = useLocale();
  return DIGITAL_PRODUCTS_STRINGS[lang];
}

export default function DigitalProducts() {
  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <Background />
      <TopNav />
      <main id="main-content" className="pt-20">
        <ProductShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function ProductShowcase() {
  const s = useStrings();
  const [category, setCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'web-design', label: s.webDesign.title },
    { id: 'illustrations', label: s.illustrations.title },
  ];

  type ProductItem = {
    title: string;
    description: string;
    price: string;
    type: string;
  };

  const allProducts: ProductItem[] = [
    ...s.webDesign.items.map((item: { title: string; description: string; price: string }) => ({ ...item, type: 'web-design' })),
    ...s.illustrations.items.map((item: { title: string; description: string; price: string }) => ({
      ...item,
      type: 'illustrations',
    })),
  ];

  const filteredProducts =
    category === 'all'
      ? allProducts
      : allProducts.filter((item) => item.type === category);

  return (
    <Section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Category Filters - Pill Style */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200',
                category === cat.id
                  ? 'bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground border bg-transparent',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item, i) => (
            <motion.article
              key={`${category}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="group"
            >
              <div className="border-border hover:border-foreground/20 flex h-full flex-col overflow-hidden rounded-lg border bg-transparent transition-colors duration-200">
                {/* Thumbnail */}
                <div className="bg-muted/50 relative aspect-[4/3] w-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {item.type === 'web-design' ? (
                      <Layout className="text-muted-foreground/30 h-8 w-8" />
                    ) : (
                      <Image className="text-muted-foreground/30 h-8 w-8" />
                    )}
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      View
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-foreground text-sm leading-tight font-medium">
                      {item.title}
                    </h3>
                    <span className="text-muted-foreground shrink-0 text-sm font-medium">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-xs leading-relaxed">
                    {item.description}
                  </p>
                  <button className="text-foreground hover:text-muted-foreground inline-flex items-center text-xs font-medium transition-colors duration-200">
                    <Download className="mr-1.5 h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <Grid3X3 className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              No products in this category
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}

function CTASection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="border-border mx-auto max-w-3xl border-t border-b py-16 text-center"
        >
          <h2 className="text-foreground text-3xl tracking-tight md:text-4xl">
            {s.cta.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-base">
            {s.cta.subtitle}
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-11 rounded-full px-8 text-sm font-medium"
              asChild
            >
              <a
                href="https://wa.me/6289669594959"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.cta.button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
