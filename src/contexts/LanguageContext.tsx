import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { TRANSLATIONS, type Language, type SiteTranslations } from '../content/translations';

const STORAGE_KEY = 'mansao_guaratuba_lang';
const FALLBACK_USD_TO_BRL = 5.65;

interface ExchangeRateState {
  usdToBrl: number;
  isLiveRate: boolean;
  updatedAt: string;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: SiteTranslations;
  usdToBrl: number;
  isLiveRate: boolean;
  rateUpdatedAt: string;
  isUsd: boolean;
  currencyCode: 'BRL' | 'USD';
  currencySymbol: 'R$' | 'US$';
  convertBrlToActive: (brlAmount: number) => number;
  convertActiveToBrl: (activeAmount: number) => number;
  formatActiveCurrency: (brlAmount: number) => string;
  formatGroupingNumber: (num: number) => string;
  formatActiveCompact: (brlAmount: number) => string;
  formatApproxDiffActive: (brlAmount: number) => string;
  formatUsdRateLabel: () => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'es' || saved === 'en') {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'pt';
}

function getNumberLocale(lang: Language): string {
  if (lang === 'en') return 'en-US';
  if (lang === 'es') return 'es-AR';
  return 'pt-BR';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);
  const [rateState, setRateState] = useState<ExchangeRateState>({
    usdToBrl: FALLBACK_USD_TO_BRL,
    isLiveRate: false,
    updatedAt: '',
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const htmlLang = language === 'pt' ? 'pt-BR' : language;
    document.documentElement.lang = htmlLang;
    document.title = TRANSLATIONS[language].docTitle;
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    async function loadDailyUsdRate() {
      // 1. Server / Vercel cached endpoint (/api/cotacao)
      try {
        const res = await fetch('/api/cotacao');
        if (res.ok) {
          const data = (await res.json()) as {
            usdToBrl?: number;
            source?: string;
            updatedAt?: string;
          };
          if (
            !cancelled &&
            typeof data.usdToBrl === 'number' &&
            Number.isFinite(data.usdToBrl) &&
            data.usdToBrl > 1 &&
            data.usdToBrl < 20
          ) {
            setRateState({
              usdToBrl: data.usdToBrl,
              isLiveRate: data.source === 'live',
              updatedAt: data.updatedAt || '',
            });
            if (data.source === 'live') return;
          }
        }
      } catch {
        // Fallback to direct client fetch below
      }

      // 2. Direct browser fallback: open.er-api.com
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = (await res.json()) as {
            rates?: { BRL?: number };
            time_last_update_utc?: string;
          };
          const rate = data?.rates?.BRL;
          if (!cancelled && typeof rate === 'number' && rate > 1 && rate < 20) {
            setRateState({
              usdToBrl: Number(rate.toFixed(4)),
              isLiveRate: true,
              updatedAt: data.time_last_update_utc || '',
            });
            return;
          }
        }
      } catch {
        // try Frankfurter
      }

      // 3. Direct browser fallback: Frankfurter
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL');
        if (res.ok) {
          const data = (await res.json()) as { rates?: { BRL?: number }; date?: string };
          const rate = data?.rates?.BRL;
          if (!cancelled && typeof rate === 'number' && rate > 1 && rate < 20) {
            setRateState({
              usdToBrl: Number(rate.toFixed(4)),
              isLiveRate: true,
              updatedAt: data.date || '',
            });
          }
        }
      } catch {
        // keep current fallback
      }
    }

    loadDailyUsdRate();
    return () => {
      cancelled = true;
    };
  }, []);

  const isUsd = language !== 'pt';
  const currencyCode = isUsd ? 'USD' : 'BRL';
  const currencySymbol = isUsd ? 'US$' : 'R$';
  const locale = getNumberLocale(language);

  const convertBrlToActive = useCallback(
    (brlAmount: number) => {
      if (!isUsd) return Math.round(brlAmount);
      return Math.round(brlAmount / rateState.usdToBrl);
    },
    [isUsd, rateState.usdToBrl]
  );

  const convertActiveToBrl = useCallback(
    (activeAmount: number) => {
      if (!isUsd) return Math.round(activeAmount);
      return Math.round(activeAmount * rateState.usdToBrl);
    },
    [isUsd, rateState.usdToBrl]
  );

  const formatGroupingNumber = useCallback(
    (num: number) =>
      new Intl.NumberFormat(locale, {
        useGrouping: true,
        maximumFractionDigits: 0,
      }).format(Math.round(num)),
    [locale]
  );

  const formatActiveCurrency = useCallback(
    (brlAmount: number) => {
      const activeVal = convertBrlToActive(brlAmount);
      const formattedDigits = formatGroupingNumber(activeVal);
      if (isUsd) {
        return `US$ ${formattedDigits}`;
      }
      return `R$ ${formattedDigits}`;
    },
    [convertBrlToActive, formatGroupingNumber, isUsd]
  );

  const formatActiveCompact = useCallback(
    (brlAmount: number) => {
      const activeVal = convertBrlToActive(brlAmount);
      if (activeVal >= 1_000_000) {
        const millions = Math.round((activeVal / 1_000_000) * 10) / 10;
        if (language === 'pt') {
          const label = millions === 1 ? 'milhão' : 'milhões';
          return `R$ ${millions.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
        }
        if (language === 'es') {
          const label = millions === 1 ? 'millón' : 'millones';
          return `US$ ${millions.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
        }
        return `US$ ${millions.toFixed(1).replace('.0', '')} million`;
      }
      return formatActiveCurrency(brlAmount);
    },
    [convertBrlToActive, formatActiveCurrency, language]
  );

  const formatApproxDiffActive = useCallback(
    (brlAmount: number) => {
      const absActive = Math.abs(convertBrlToActive(brlAmount));
      if (absActive >= 1_000_000) {
        const millions = Math.round((absActive / 1_000_000) * 10) / 10;
        if (language === 'pt') {
          const label = millions === 1 ? 'milhão' : 'milhões';
          return `R$ ${millions.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
        }
        if (language === 'es') {
          const label = millions === 1 ? 'millón' : 'millones';
          return `US$ ${millions.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
        }
        return `US$ ${millions.toFixed(1).replace('.0', '')} million`;
      }
      if (absActive >= 1_000) {
        const thousands = Math.round(absActive / 1_000);
        if (language === 'pt') {
          return `R$ ${thousands.toLocaleString('pt-BR')} mil`;
        }
        if (language === 'es') {
          return `US$ ${thousands.toLocaleString('es-AR')} mil`;
        }
        return `US$ ${thousands.toLocaleString('en-US')}K`;
      }
      return isUsd
        ? `US$ ${formatGroupingNumber(absActive)}`
        : `R$ ${formatGroupingNumber(absActive)}`;
    },
    [convertBrlToActive, formatGroupingNumber, isUsd, language]
  );

  const formatUsdRateLabel = useCallback(() => {
    const rateFormatted = rateState.usdToBrl.toFixed(2);
    if (language === 'en') {
      return `1 USD = R$ ${rateFormatted}`;
    }
    return `1 USD = R$ ${rateFormatted.replace('.', ',')}`;
  }, [language, rateState.usdToBrl]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: TRANSLATIONS[language],
      usdToBrl: rateState.usdToBrl,
      isLiveRate: rateState.isLiveRate,
      rateUpdatedAt: rateState.updatedAt,
      isUsd,
      currencyCode,
      currencySymbol,
      convertBrlToActive,
      convertActiveToBrl,
      formatActiveCurrency,
      formatGroupingNumber,
      formatActiveCompact,
      formatApproxDiffActive,
      formatUsdRateLabel,
    }),
    [
      language,
      setLanguage,
      rateState.usdToBrl,
      rateState.isLiveRate,
      rateState.updatedAt,
      isUsd,
      currencyCode,
      currencySymbol,
      convertBrlToActive,
      convertActiveToBrl,
      formatActiveCurrency,
      formatGroupingNumber,
      formatActiveCompact,
      formatApproxDiffActive,
      formatUsdRateLabel,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
