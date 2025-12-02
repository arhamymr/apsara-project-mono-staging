'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <title>404 - Page Not Found | Apsara Digital</title>
      <main className="bg-background relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative h-[50vh] w-[50vw] max-h-[400px] max-w-[600px]">
            <Image
              src="https://cdn.prod.website-files.com/680244911c3d7d28354cb55b/682402da44729946dbe193c6_404.avif"
              alt=""
              fill
              className="object-contain opacity-60"
              priority
            />
          </div>
          <div className="from-background/80 via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>

        {/* Content */}
        <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
          <div className="flex max-w-2xl flex-col items-center text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="bg-destructive h-2 w-2 rounded-full" />
              <Badge variant="outline" className="text-muted-foreground uppercase tracking-wider">
                Page Not Found
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-foreground mb-10 text-3xl font-normal leading-tight tracking-tight md:text-4xl lg:text-5xl"
            >
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </motion.h1>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" asChild>
                <Link href="/">
                  Return home
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
