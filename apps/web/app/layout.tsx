import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

export const metadata: Metadata = {
  title: {
    default: "Apsara Digital - AI-Powered Web Development & Digital Solutions",
    template: "%s | Apsara Digital",
  },
  description: "AI-powered web development and digital solutions platform",
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="w-full">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased w-full min-w-full max-w-full`}
      >
        <ConvexAuthNextjsServerProvider>
          <Providers>
            <main className="w-full min-w-full">{children}</main>
          </Providers>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
