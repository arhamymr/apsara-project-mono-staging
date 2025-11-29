/**
 * LogoSwitch - Reusable component for light/dark logo switching
 *
 * This component automatically switches between light and dark logos
 * based on the current theme. Uses Tailwind's dark mode classes.
 *
 * @example
 * <LogoSwitch
 *   width="120px"
 *   lightLogo="https://assets.apsaradigital.com/logo.png"
 *   darkLogo="https://assets.apsaradigital.com/logo-white.png"
 * />
 */

type LogoSwitchProps = {
  width?: string;
  lightLogo?: string;
  darkLogo?: string;
  alt?: string;
  className?: string;
};

export function LogoSwitch({
  width = '120px',
  lightLogo = 'https://assets.apsaradigital.com/logo.png',
  darkLogo = 'https://assets.apsaradigital.com/logo-white.png',
  alt = 'logo',
  className = '',
}: LogoSwitchProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Light mode logo - shows by default, hides in dark mode */}
      <img
        src={lightLogo}
        alt={alt}
        className={`block dark:hidden`}
        style={{ width }}
      />

      {/* Dark mode logo - hidden by default, shows in dark mode */}
      <img
        src={darkLogo}
        alt={alt}
        className={`hidden dark:block`}
        style={{ width }}
      />
    </div>
  );
}
