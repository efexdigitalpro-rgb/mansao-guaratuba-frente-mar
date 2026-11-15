import type { IncomingMessage, ServerResponse } from 'node:http';

interface RateCache {
  usdToBrl: number;
  updatedAt: string;
  provider: string;
  cachedAt: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000;
const FALLBACK_USD_TO_BRL = 5.65;
let rateCache: RateCache | null = null;

async function fetchLiveUsdToBrl(): Promise<{
  usdToBrl: number;
  updatedAt: string;
  provider: string;
  source: 'live' | 'fallback';
}> {
  if (rateCache && Date.now() - rateCache.cachedAt < CACHE_TTL_MS) {
    return {
      usdToBrl: rateCache.usdToBrl,
      updatedAt: rateCache.updatedAt,
      provider: rateCache.provider,
      source: 'live',
    };
  }

  // 1. ExchangeRate-API (open.er-api.com)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        result?: string;
        rates?: { BRL?: number };
        time_last_update_utc?: string;
      };
      const rate = data?.rates?.BRL;
      if (typeof rate === 'number' && Number.isFinite(rate) && rate > 1 && rate < 20) {
        rateCache = {
          usdToBrl: Number(rate.toFixed(4)),
          updatedAt: data.time_last_update_utc || new Date().toISOString(),
          provider: 'ExchangeRate-API',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // try next provider
  }

  // 2. Frankfurter (ECB reference)
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        date?: string;
        rates?: { BRL?: number };
      };
      const rate = data?.rates?.BRL;
      if (typeof rate === 'number' && Number.isFinite(rate) && rate > 1 && rate < 20) {
        rateCache = {
          usdToBrl: Number(rate.toFixed(4)),
          updatedAt: data.date || new Date().toISOString(),
          provider: 'Frankfurter / ECB',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // try next provider
  }

  // 3. AwesomeAPI (USD-BRL comercial)
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        USDBRL?: { bid?: string; create_date?: string };
      };
      const bid = Number(data?.USDBRL?.bid);
      if (Number.isFinite(bid) && bid > 1 && bid < 20) {
        rateCache = {
          usdToBrl: Number(bid.toFixed(4)),
          updatedAt: data?.USDBRL?.create_date || new Date().toISOString(),
          provider: 'AwesomeAPI',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // fallback below
  }

  return {
    usdToBrl: rateCache?.usdToBrl ?? FALLBACK_USD_TO_BRL,
    updatedAt: rateCache?.updatedAt ?? new Date().toISOString(),
    provider: 'Referência',
    source: 'fallback',
  };
}

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const quote = await fetchLiveUsdToBrl();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
  res.end(
    JSON.stringify({
      ok: true,
      base: 'USD',
      target: 'BRL',
      usdToBrl: quote.usdToBrl,
      updatedAt: quote.updatedAt,
      provider: quote.provider,
      source: quote.source,
    })
  );
}
