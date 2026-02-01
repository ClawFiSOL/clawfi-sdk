/**
 * ClawFi SDK Types
 */

export interface ClawFiConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Signal {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  title: string;
  summary: string;
  details?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type SignalType = 
  | 'whale_movement'
  | 'liquidity_change'
  | 'holder_concentration'
  | 'contract_risk'
  | 'price_manipulation'
  | 'rugpull_risk'
  | 'honeypot'
  | 'mint_authority'
  | 'social_sentiment';

export type SignalSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface TokenData {
  address: string;
  chain: ChainId;
  name?: string;
  symbol?: string;
  decimals?: number;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  fdv?: number;
  volume24h?: number;
  liquidity?: number;
  holders?: number;
  createdAt?: number;
}

export interface MarketData {
  price: number;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  transactions: {
    buys: number;
    sells: number;
  };
  liquidity: number;
  marketCap?: number;
  fdv?: number;
}

export interface HolderAnalysis {
  totalHolders: number;
  top10Percentage: number;
  top50Percentage: number;
  top100Percentage: number;
  whaleCount: number;
  avgHoldingTime?: number;
}

export interface ContractAnalysis {
  verified: boolean;
  renounced: boolean;
  honeypot: boolean;
  mintable: boolean;
  pausable: boolean;
  blacklist: boolean;
  taxBuy?: number;
  taxSell?: number;
  maxTransaction?: number;
  maxWallet?: number;
}

export interface TokenAnalysis {
  token: TokenData;
  market: MarketData;
  holders?: HolderAnalysis;
  contract?: ContractAnalysis;
  signals: Signal[];
  riskScore: number;
  timestamp: number;
}

export type ChainId = 
  | 'ethereum'
  | 'bsc'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'avalanche'
  | 'base'
  | 'solana'
  | string;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
