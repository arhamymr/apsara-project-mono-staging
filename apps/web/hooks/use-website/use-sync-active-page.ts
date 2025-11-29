'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

/** Sinkronisasi activePage -> website.pages[...] + push ke RHF form */
export function useSyncActivePage<
  TWebsite extends { pages: Record<string, any> },
  TPage extends { id: string },
>({
  activePage,
  setWebsite,
  form,
  formKey = 'structure',
}: {
  activePage: TPage;
  setWebsite: React.Dispatch<React.SetStateAction<TWebsite>>;
  form: any;
  formKey?: string;
}) {
  useEffect(() => {
    setWebsite((prev) => {
      const next = {
        ...prev,
        pages: {
          ...prev.pages,
          [activePage.id]: activePage,
        },
      };
      form.setValue(formKey, next);
      return next as TWebsite;
    });
  }, [activePage, setWebsite, form, formKey]);
}
