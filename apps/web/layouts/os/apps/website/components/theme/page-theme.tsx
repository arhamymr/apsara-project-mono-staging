// usePageTheme.ts
import { create } from 'zustand';

export type TypographyPreset =
  | 'sans'
  | 'serif'
  | 'mono'
  | 'inter'
  | 'roboto'
  | 'poppins'
  | 'lato'
  | 'montserrat'
  | 'open-sans'
  | 'raleway'
  | 'nunito'
  | 'merriweather'
  | 'playfair'
  | 'fira-code'
  | 'source-code'
  | 'work-sans'
  | 'rubik'
  | 'manrope'
  | 'ubuntu'
  | 'josefin';

export const FONT_OPTIONS: Record<TypographyPreset, string> = {
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
  mono: "ui-monospace, Menlo, Monaco, 'Courier New', monospace",
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
  lato: "'Lato', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  'open-sans': "'Open Sans', sans-serif",
  raleway: "'Raleway', sans-serif",
  nunito: "'Nunito', sans-serif",
  merriweather: "'Merriweather', serif",
  playfair: "'Playfair Display', serif",
  'fira-code': "'Fira Code', monospace",
  'source-code': "'Source Code Pro', monospace",
  'work-sans': "'Work Sans', sans-serif",
  rubik: "'Rubik', sans-serif",
  manrope: "'Manrope', sans-serif",
  ubuntu: "'Ubuntu', sans-serif",
  josefin: "'Josefin Sans', sans-serif",
};

type ThemeState = {
  typography: TypographyPreset | 'string';
  setTypography: (t: TypographyPreset) => void;

  theme: string;
  setTheme: (t: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  typography: 'inter',
  setTypography: (t) => {
    set({ typography: t });
  },
  theme: 'light',
  setTheme: (t) => set({ theme: t }),
}));

export function usePageTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const typography = useThemeStore((s) => s.typography);
  const setTypography = useThemeStore((s) => s.setTypography);
  return { typography, setTypography, theme, setTheme };
}
