# @clawfi/sdk

[![npm version](https://badge.fury.io/js/@clawfi%2Fsdk.svg)](https://www.npmjs.com/package/@clawfi/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

Official TypeScript SDK for the ClawFi crypto intelligence API. Get real-time token analysis, signals, and risk assessment.

## Features

- 🔐 **Token Analysis** - Comprehensive token metrics and risk scoring
- 📡 **Real-time Signals** - Whale movements, liquidity changes, contract risks
- 🛡️ **Security Checks** - Honeypot detection, contract verification
- 📊 **Market Data** - Price, volume, liquidity, holder analysis
- 🔔 **Webhooks** - Subscribe to signal notifications
- ⚡ **Lightweight** - Zero dependencies, full TypeScript support

## Installation

```bash
npm install @clawfi/sdk
# or
yarn add @clawfi/sdk
# or
pnpm add @clawfi/sdk
```

## Quick Start

```typescript
import { ClawFi } from '@clawfi/sdk';

const clawfi = new ClawFi({
  apiKey: 'your-api-key', // Optional for public endpoints
});

// Analyze a token
const analysis = await clawfi.analyzeToken('ethereum', '0x...');
console.log('Risk Score:', analysis.data?.riskScore);

// Get signals
const signals = await clawfi.getSignals('ethereum', '0x...');
console.log('Signals:', signals.data?.length);

// Check for honeypot
const honeypot = await clawfi.checkHoneypot('bsc', '0x...');
if (honeypot.data?.isHoneypot) {
  console.log('WARNING: Honeypot detected!');
}
```

## API Reference

### Configuration

```typescript
const clawfi = new ClawFi({
  apiKey: 'your-api-key',           // API key for authenticated endpoints
  baseUrl: 'https://api.clawfi.ai', // Custom API URL
  timeout: 30000,                    // Request timeout in ms
});
```

### Token Analysis

```typescript
// Full analysis
const analysis = await clawfi.analyzeToken('ethereum', '0xTokenAddress');

// Quick token data
const token = await clawfi.getToken('base', '0xTokenAddress');
```

### Signals

```typescript
// Get signals for a token
const signals = await clawfi.getSignals('solana', 'TokenMintAddress');

// Get recent signals across all tokens
const recent = await clawfi.getRecentSignals(100);

// Subscribe to webhook notifications
await clawfi.subscribeSignals('https://your-webhook.com/signals', {
  chains: ['ethereum', 'base'],
  severity: ['high', 'critical'],
});
```

### Market Data

```typescript
// Get market data
const market = await clawfi.getMarketData('ethereum', '0x...');

// Get trending tokens
const trending = await clawfi.getTrending('base');
```

### Security

```typescript
// Contract analysis
const contract = await clawfi.getContractAnalysis('bsc', '0x...');

// Honeypot check
const honeypot = await clawfi.checkHoneypot('bsc', '0x...');
```

### Holders

```typescript
// Holder analysis
const holders = await clawfi.getHolders('ethereum', '0x...');

// Top holders
const topHolders = await clawfi.getTopHolders('ethereum', '0x...', 50);
```

### Watchlist

```typescript
// Add to watchlist
await clawfi.addToWatchlist('ethereum', '0x...');

// Get watchlist
const watchlist = await clawfi.getWatchlist();

// Remove from watchlist
await clawfi.removeFromWatchlist('watchlist-id');
```

## Signal Utilities

```typescript
import { 
  calculateRiskScore,
  filterBySeverity,
  getCriticalSignals,
  isHighRisk,
  getRiskLevel,
  formatSignal,
} from '@clawfi/sdk';

// Calculate risk from signals
const riskScore = calculateRiskScore(signals);
const riskLevel = getRiskLevel(riskScore); // 'safe' | 'low' | 'medium' | 'high' | 'critical'

// Filter signals
const criticalSignals = getCriticalSignals(signals);
const highAndAbove = filterBySeverity(signals, 'high');

// Check if high risk
if (isHighRisk(signals)) {
  console.log('⚠️ High risk token!');
}

// Format for display
signals.forEach(s => console.log(formatSignal(s)));
```

## Market Utilities

```typescript
import {
  formatPrice,
  formatMarketCap,
  getMomentum,
  getBuySellRatio,
  detectPumpPattern,
  getMarketSummary,
} from '@clawfi/sdk';

// Format values
console.log(formatPrice(0.00001234));    // "0.000012"
console.log(formatMarketCap(1500000));   // "$1.50M"

// Get momentum
const momentum = getMomentum(marketData); // 'bullish' | 'bearish' | 'neutral'

// Detect patterns
if (detectPumpPattern(marketData)) {
  console.log('⚠️ Potential pump detected');
}

// Get summary
const summary = getMarketSummary(marketData);
```

## Types

All types are exported:

```typescript
import type {
  Signal,
  SignalType,
  SignalSeverity,
  TokenData,
  MarketData,
  HolderAnalysis,
  ContractAnalysis,
  TokenAnalysis,
  ChainId,
  ApiResponse,
} from '@clawfi/sdk';
```

## Supported Chains

- Ethereum (`ethereum`)
- BNB Smart Chain (`bsc`)
- Base (`base`)
- Arbitrum (`arbitrum`)
- Optimism (`optimism`)
- Polygon (`polygon`)
- Avalanche (`avalanche`)
- Solana (`solana`)
- And more...

## Error Handling

```typescript
const result = await clawfi.analyzeToken('ethereum', '0x...');

if (!result.success) {
  console.error('Error:', result.error);
  return;
}

// Safe to use result.data
console.log(result.data);
```

## Rate Limits

- Public endpoints: 100 requests/minute
- Authenticated: 1000 requests/minute

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © [ClawFi](https://github.com/ClawFiSOL)

## Related

- [dexscreener-ts](https://github.com/ClawFiSOL) - Dexscreener API wrapper
- [ClawFi Extension](https://github.com/ClawFiSOL) - Browser extension
