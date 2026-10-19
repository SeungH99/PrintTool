'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { useConsent, useHasConsentChoice } from '@/hooks/useConsent';
import { useGoogleConsent } from '@/hooks/useGoogleConsent';
import {
  defaultConsent,
  hasGlobalPrivacyControl,
  OPEN_CONSENT_EVENT,
  openConsentManager,
  readConsent,
  writeConsent,
  type ConsentState,
} from '@/lib/consent/consent';
import { consentMessages } from '@/lib/consent/messages';

const actionClass =
  'rounded-md border border-hairline bg-elevated px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-hairline-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** A nonmodal first-visit notice, with a keyboard-contained customization dialog. */
export function ConsentPreferences({ locale }: { locale: Locale }) {
  const t = consentMessages[locale];
  const hasChoice = useHasConsentChoice();
  const local = useConsent();
  const google = useGoogleConsent(Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT));
  const [customize, setCustomize] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(defaultConsent);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLElement>(null);
  const gpc = hasGlobalPrivacyControl();

  useEffect(() => {
    const open = () => {
      setDraft(readConsent());
      setError('');
      setCustomize(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  useEffect(() => {
    if (!customize) return;
    const origin = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setCustomize(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialog.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled),input:not(:disabled),a[href]',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      origin?.focus();
    };
  }, [customize]);

  const save = (choice: ConsentState) => {
    if (!writeConsent(gpc ? defaultConsent : choice)) {
      setError(t.storageError);
      return;
    }
    setError('');
    setCustomize(false);
  };
  const openCustomize = () => {
    setDraft(local);
    setError('');
    setCustomize(true);
  };
  const status = gpc
    ? t.gpc
    : google.status === 'regional'
      ? t.regional
      : google.status === 'not-applicable'
        ? null
        : t[google.status];

  if (!customize && hasChoice) return null;
  const actions = (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={actionClass} onClick={() => save(defaultConsent)}>
        {t.reject}
      </button>
      <button
        type="button"
        className={actionClass}
        disabled={gpc}
        onClick={() => save({ ads: true, analytics: true })}
      >
        {t.accept}
      </button>
      {!customize && (
        <button type="button" className={actionClass} onClick={openCustomize}>
          {t.customize}
        </button>
      )}
    </div>
  );

  if (!customize)
    return (
      <section
        role="region"
        aria-label={t.title}
        className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-lg border border-hairline bg-elevated p-4 shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-5"
      >
        <h2 className="m-0 text-base font-semibold">{t.title}</h2>
        <p className="my-2 text-sm leading-relaxed text-body">{t.description}</p>
        {status && (
          <p role="status" className="my-2 text-sm text-body">
            {status}
          </p>
        )}
        {actions}
        {error && (
          <p role="alert" className="mb-0 text-sm text-ink">
            {error}
          </p>
        )}
      </section>
    );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <section
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-choice-title"
        aria-describedby="cookie-choice-description"
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-lg border border-hairline bg-elevated p-5 shadow-xl sm:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="cookie-choice-title" className="m-0 text-xl font-semibold">
            {t.title}
          </h2>
          <button type="button" className={actionClass} onClick={() => setCustomize(false)}>
            {t.close}
          </button>
        </div>
        <p id="cookie-choice-description" className="text-sm leading-relaxed text-body">
          {t.description}
        </p>
        <p className="text-sm text-body">{t.essential}</p>
        {status && (
          <p
            role="status"
            className="rounded-md bg-hairline-soft p-3 text-sm leading-relaxed text-body"
          >
            {status}
          </p>
        )}
        <div className="my-5 space-y-4">
          {(['analytics', 'ads'] as const).map((category) => (
            <div key={category}>
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={!gpc && draft[category]}
                  disabled={gpc}
                  onChange={(event) => setDraft({ ...draft, [category]: event.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                {t[category]}
              </label>
              <p className="mb-0 ml-7 mt-1 text-sm text-body">
                {t[category === 'ads' ? 'adsDescription' : 'analyticsDescription']}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-body">{t.reload}</p>
        {google.status === 'regional' && (
          <button
            type="button"
            className={`${actionClass} mb-4`}
            onClick={() => {
              if (!openConsentManager()) setError(t.googleUnavailable);
            }}
          >
            {t.googleChoices}
          </button>
        )}
        {actions}
        <button type="button" className={`${actionClass} mt-2`} onClick={() => save(draft)}>
          {t.save}
        </button>
        {error && (
          <p role="alert" className="text-sm text-ink">
            {error}
          </p>
        )}
        <a
          className="mt-4 inline-block text-sm text-body underline"
          href={`/${locale}/privacy#consent-and-cookie-settings`}
        >
          {t.privacy}
        </a>
      </section>
    </div>
  );
}
