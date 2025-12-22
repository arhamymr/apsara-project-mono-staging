"use client";

import { useFadeUp } from "@/components/home/hooks/useFadeUp";
import { getWhatsAppUrl } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

import LanguageSelector from "@/components/LanguageSelector";
import { Logo } from "./top-nav/Logo";

export function Footer() {
  const fadeUp = useFadeUp();

  return (
    <motion.footer
      {...fadeUp}
      className="border-border bg-background border-t pt-16 pb-8"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto w-full px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
              Build, Launch & Scale Your Digital Business From professional
              websites and AI automation to custom applications — everything you
              need to establish and grow your online presence.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/arhamymr"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/arhamymr"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {/* Product */}
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Product
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <Link
                    href="/full-stack-development"
                    className="hover:text-foreground transition-colors"
                  >
                    Full Stack Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mobile-app-development"
                    className="hover:text-foreground transition-colors"
                  >
                    Mobile App Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-development"
                    className="hover:text-foreground transition-colors"
                  >
                    API Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fix-website"
                    className="hover:text-foreground transition-colors"
                  >
                    Fix Website
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ai-integration"
                    className="hover:text-foreground transition-colors"
                  >
                    AI Integration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Company
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Legal
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Stay up to date
            </h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row">
          <p>
            © {new Date().getFullYear()} Apsara Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <LanguageSelector ariaLabel="Language selector" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-xs font-medium">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
