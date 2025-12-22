'use client';

import { Store, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface StorefrontFooterProps {
  shop: {
    name: string;
    description?: string;
    logo?: string;
    slug: string;
    footerEmail?: string;
    footerPhone?: string;
    footerAddress?: string;
    footerFacebook?: string;
    footerInstagram?: string;
    footerTwitter?: string;
    footerLinkedin?: string;
  };
}

export function StorefrontFooter({ shop }: StorefrontFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {shop.logo ? (
                <img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="bg-primary/10 rounded-lg p-2">
                  <Store className="h-6 w-6 text-primary" />
                </div>
              )}
              {/* <h3 className="text-lg font-semibold">{shop.name}</h3> */}
            </div>
            <p className="text-sm text-muted-foreground">
              {shop.description || 'Your trusted online store for quality products and exceptional service.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/ecommerce/${shop.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  href={`/ecommerce/${shop.slug}#featured`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Featured Items
                </Link>
              </li>
              <li>
                <Link 
                  href={`/ecommerce/${shop.slug}#new`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Information
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Connect With Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${shop.footerEmail || 'contact@example.com'}`} className="hover:text-foreground transition-colors">
                  {shop.footerEmail || 'contact@example.com'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${shop.footerPhone || '+1234567890'}`} className="hover:text-foreground transition-colors">
                  {shop.footerPhone || '+1 (234) 567-890'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{shop.footerAddress || '123 Business St, City, State 12345'}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={shop.footerFacebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href={shop.footerInstagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href={shop.footerTwitter || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href={shop.footerLinkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {shop.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
