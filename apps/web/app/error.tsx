'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <title>Error | Apsara Digital</title>
      <main className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm tracking-wider text-gray-400 uppercase">
                Error{error.digest ? ` · ${error.digest}` : ''}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-3xl font-normal leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Something went wrong
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-10 text-gray-400"
            >
              {error.message || 'An unexpected error occurred. Please try again.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-4"
            >
              <button
                onClick={reset}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
              <a
                href="/"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                <span>Return home</span>
                <span className="flex h-5 w-5 items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
