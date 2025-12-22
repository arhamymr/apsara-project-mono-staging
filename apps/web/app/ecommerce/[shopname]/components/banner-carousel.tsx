'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position: number;
}

interface BannerCarouselProps {
  banners: Banner[];
  shopName: string;
}

export function BannerCarousel({ banners, shopName }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // No banners - show default header
  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to {shopName}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of products
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Single banner - display as hero
  if (banners.length === 1) {
    const banner = banners[0];
    if (!banner) return null; // Type guard
    
    const content = (
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 pb-12 md:pb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {banner.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    if (banner.linkUrl) {
      return (
        <Link href={banner.linkUrl} className="block hover:opacity-95 transition-opacity">
          {content}
        </Link>
      );
    }

    return content;
  }

  // Multiple banners - display as carousel
  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
      {/* Banners */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        const content = (
          <div
            key={banner._id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto max-w-7xl px-4 md:px-6 pb-12 md:pb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

        if (banner.linkUrl) {
          return (
            <Link
              key={banner._id}
              href={banner.linkUrl}
              className={cn(
                'absolute inset-0 transition-opacity duration-500 hover:opacity-95',
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              {content}
            </Link>
          );
        }

        return content;
      })}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            )}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
