import { useLocale } from '@/i18n/LocaleContext';
import type { Lang } from '@/i18n/types';
import { LANG_LABEL } from '@/i18n/types';

export type LanguageSelectorProps = {
  wrapperClassName?: string;
  ariaLabel?: string;
  hideOnMobile?: boolean;
};

export function LanguageSelector({
  wrapperClassName = 'hidden items-center gap-1 rounded-sm border px-1.5 py-1 text-xs md:flex',
  ariaLabel = 'Language selector',
}: LanguageSelectorProps) {
  const { lang, setLang } = useLocale();

  return (
    <div className={wrapperClassName} aria-label={ariaLabel}>
      {(['en', 'id'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-xs px-1.5 py-0.5 ${
            lang === l
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-pressed={lang === l}
          aria-label={`Switch language to ${LANG_LABEL[l]}`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
