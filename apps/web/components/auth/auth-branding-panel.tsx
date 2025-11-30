'use client';

import Image from 'next/image';

interface AuthBrandingPanelProps {
  tagline?: string;
}

export function AuthBrandingPanel({
  tagline = 'Build, automate, and manage your workspace—beautifully.',
}: AuthBrandingPanelProps) {
  return (
    <div
      className="bg-background relative m-4 hidden overflow-hidden rounded-lg md:block"
      style={{
        backgroundImage: `url(/hero-bg.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/20 to-transparent" />
      <div className="absolute right-8 bottom-8 left-8 text-white">
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
        <p className="text-md mt-2 max-w-md opacity-90">{tagline}</p>
      </div>
    </div>
  );
}
