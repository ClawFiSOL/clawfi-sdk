/**
 * Market Data Utilities
 */

import { MarketData, TokenData } from './types';

/**
 * Format price with appropriate decimals
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else if (price >= 0.0001) {
    return price.toFixed(6);
  } else {
    return price.toExponential(2);
  }
}

/**
 * Format market cap
 */
export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format volume
 */
export function formatVolume(value: number): string {
  return formatMarketCap(value);
}

/**
 * Format percentage change
 */
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Calculate buy/sell ratio
 */
export function getBuySellRatio(market: MarketData): number {
  const total = market.transactions.buys + market.transactions.sells;
  if (total === 0) return 0.5;
  return market.transactions.buys / total;
}

/**
 * Get momentum indicator
 */
export function getMomentum(market: MarketData): 'bullish' | 'bearish' | 'neutral' {
  const changes = [
    market.priceChange.m5,
    market.priceChange.h1,
    market.priceChange.h6,
    market.priceChange.h24,
  ];
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  
  if (avgChange > 5) return 'bullish';
  if (avgChange < -5) return 'bearish';
  return 'neutral';
}

/**
 * Check if token has sufficient liquidity
 */
export function hasSufficientLiquidity(market: MarketData, minUsd: number = 10000): boolean {
  return market.liquidity >= minUsd;
}

/**
 * Calculate liquidity to market cap ratio
 */
export function getLiquidityRatio(market: MarketData): number | null {
  if (!market.marketCap || market.marketCap === 0) return null;
  return market.liquidity / market.marketCap;
}

/**
 * Check for potential pump patterns
 */
export function detectPumpPattern(market: MarketData): boolean {
  // Rapid price increase with low volume = potential pump
  const bigPriceMove = market.priceChange.h1 > 50 || market.priceChange.m5 > 20;
  const lowLiquidityRatio = getLiquidityRatio(market);
  
  return bigPriceMove && (lowLiquidityRatio !== null && lowLiquidityRatio < 0.05);
}

/**
 * Check for potential dump patterns
 */
export function detectDumpPattern(market: MarketData): boolean {
  // Rapid price decrease with high sell volume
  const bigPriceDrop = market.priceChange.h1 < -30 || market.priceChange.m5 < -15;
  const highSellRatio = getBuySellRatio(market) < 0.3;
  
  return bigPriceDrop && highSellRatio;
}

/**
 * Get market summary
 */
export function getMarketSummary(market: MarketData): {
  priceFormatted: string;
  change24h: string;
  volume24h: string;
  liquidity: string;
  momentum: string;
  buySellRatio: string;
} {
  return {
    priceFormatted: `$${formatPrice(market.price)}`,
    change24h: formatChange(market.priceChange.h24),
    volume24h: formatVolume(market.volume.h24),
    liquidity: formatMarketCap(market.liquidity),
    momentum: getMomentum(market),
    buySellRatio: `${Math.round(getBuySellRatio(market) * 100)}% buys`,
  };
}

/**
 * Compare two tokens by market metrics
 */
export function compareTokens(a: TokenData, b: TokenData): {
  higherMcap: string;
  higherVolume: string;
  higherLiquidity: string;
} {
  return {
    higherMcap: (a.marketCap || 0) > (b.marketCap || 0) ? a.symbol || 'A' : b.symbol || 'B',
    higherVolume: (a.volume24h || 0) > (b.volume24h || 0) ? a.symbol || 'A' : b.symbol || 'B',
    higherLiquidity: (a.liquidity || 0) > (b.liquidity || 0) ? a.symbol || 'A' : b.symbol || 'B',
  };
}
