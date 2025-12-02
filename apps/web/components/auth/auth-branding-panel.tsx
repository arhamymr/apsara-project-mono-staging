'use client';

import Image from 'next/image';

interface AuthBrandingPanelProps {
  tagline?: string;
}

export function AuthBrandingPanel({
  tagline = 'Build, automate, and manage your workspace—beautifully.',
}: AuthBrandingPanelProps) {
  return (
    <div className="bg-card border relative m-4 hidden overflow-hidden rounded-lg md:block">
      {/* Spinning Logo */}
      <Image
        src="/logo.svg"
        alt="Logo"
        width={512}
        height={512}
        className="absolute -right-[150px] -bottom-[200px] size-128 w-auto animate-spin opacity-50 [animation-duration:30s]"
      />
      
      <div className="absolute right-8 bottom-8 left-8">
        <Image
          src="https://assets.apsaradigital.com/logo.png"
          alt="logo"
          width={130}
          height={40}
          className="mb-4 block dark:hidden"
        />
        <Image
          src="https://assets.apsaradigital.com/logo-white.png"
          alt="logo"
          width={130}
          height={40}
          className="mb-4 hidden dark:block"
        />
        <p className="text-muted-foreground text-md mt-2 max-w-md">{tagline}</p>
      </div>
    </div>
  );
}
