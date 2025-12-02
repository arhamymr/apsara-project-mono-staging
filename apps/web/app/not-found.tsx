'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <title>404 - Page Not Found | Apsara Digital</title>
      <main className="relative min-h-screen w-full overflow-hidden bg-black">
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
              <span className="font-mono text-sm tracking-wider text-gray-400 uppercase">
                404 Error. Page not Found
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-3xl font-normal leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              If you&apos;re reading this, something has gone terribly, terribly wrong.
            </motion.h1>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-gray-100"
              >
                <span className="relative z-10">Return home</span>
                <span className="relative z-10 flex h-5 w-5 items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
