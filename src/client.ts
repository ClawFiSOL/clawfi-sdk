/**
 * ClawFi API Client
 */

import { ClawFiConfig, Signal, TokenAnalysis, ApiResponse, ChainId } from './types';

const DEFAULT_CONFIG: Required<ClawFiConfig> = {
  apiKey: '',
  baseUrl: 'https://api.clawfi.ai',
  timeout: 30000,
};

/**
 * ClawFi SDK Client
 * 
 * @example
 * ```typescript
 * import { ClawFi } from '@clawfi/sdk';
 * 
 * const clawfi = new ClawFi({ apiKey: 'your-api-key' });
 * 
 * // Get token analysis
 * const analysis = await clawfi.analyzeToken('ethereum', '0x...');
 * 
 * // Get signals
 * const signals = await clawfi.getSignals('ethereum', '0x...');
 * ```
 */
export class ClawFi {
  private config: Required<ClawFiConfig>;

  constructor(config: ClawFiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          timestamp: Date.now(),
        };
      }

      return {
        success: true,
        data,
        timestamp: Date.now(),
      };
    } catch (error) {
      clearTimeout(timeout);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // ============================================
  // Token Analysis
  // ============================================

  /**
   * Get comprehensive token analysis
   */
  async analyzeToken(chain: ChainId, address: string): Promise<ApiResponse<TokenAnalysis>> {
    return this.request<TokenAnalysis>(`/analyze/${chain}/${address}`);
  }

  /**
   * Get quick token data
   */
  async getToken(chain: ChainId, address: string): Promise<ApiResponse<TokenAnalysis['token']>> {
    return this.request<TokenAnalysis['token']>(`/token/${chain}/${address}`);
  }

  // ============================================
  // Signals
  // ============================================

  /**
   * Get signals for a token
   */
  async getSignals(chain: ChainId, address: string): Promise<ApiResponse<Signal[]>> {
    return this.request<Signal[]>(`/signals/${chain}/${address}`);
  }

  /**
   * Get all recent signals
   */
  async getRecentSignals(limit: number = 50): Promise<ApiResponse<Signal[]>> {
    return this.request<Signal[]>(`/signals/recent?limit=${limit}`);
  }

  /**
   * Subscribe to signals (webhook)
   */
  async subscribeSignals(
    webhookUrl: string,
    filters?: { chains?: ChainId[]; severity?: string[] }
  ): Promise<ApiResponse<{ subscriptionId: string }>> {
    return this.request<{ subscriptionId: string }>('/signals/subscribe', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl, filters }),
    });
  }

  // ============================================
  // Market Data
  // ============================================

  /**
   * Get market data for a token
   */
  async getMarketData(chain: ChainId, address: string): Promise<ApiResponse<TokenAnalysis['market']>> {
    return this.request<TokenAnalysis['market']>(`/market/${chain}/${address}`);
  }

  /**
   * Get trending tokens
   */
  async getTrending(chain?: ChainId): Promise<ApiResponse<TokenAnalysis['token'][]>> {
    const endpoint = chain ? `/trending/${chain}` : '/trending';
    return this.request<TokenAnalysis['token'][]>(endpoint);
  }

  // ============================================
  // Security
  // ============================================

  /**
   * Get contract analysis
   */
  async getContractAnalysis(chain: ChainId, address: string): Promise<ApiResponse<TokenAnalysis['contract']>> {
    return this.request<TokenAnalysis['contract']>(`/security/${chain}/${address}`);
  }

  /**
   * Check if token is a honeypot
   */
  async checkHoneypot(chain: ChainId, address: string): Promise<ApiResponse<{ isHoneypot: boolean; reason?: string }>> {
    return this.request<{ isHoneypot: boolean; reason?: string }>(`/security/honeypot/${chain}/${address}`);
  }

  // ============================================
  // Holders
  // ============================================

  /**
   * Get holder analysis
   */
  async getHolders(chain: ChainId, address: string): Promise<ApiResponse<TokenAnalysis['holders']>> {
    return this.request<TokenAnalysis['holders']>(`/holders/${chain}/${address}`);
  }

  /**
   * Get top holders
   */
  async getTopHolders(
    chain: ChainId, 
    address: string, 
    limit: number = 100
  ): Promise<ApiResponse<{ address: string; balance: string; percentage: number }[]>> {
    return this.request(`/holders/${chain}/${address}/top?limit=${limit}`);
  }

  // ============================================
  // Watchlist
  // ============================================

  /**
   * Add token to watchlist
   */
  async addToWatchlist(chain: ChainId, address: string): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ chain, address }),
    });
  }

  /**
   * Get watchlist
   */
  async getWatchlist(): Promise<ApiResponse<TokenAnalysis['token'][]>> {
    return this.request<TokenAnalysis['token'][]>('/watchlist');
  }

  /**
   * Remove from watchlist
   */
  async removeFromWatchlist(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/watchlist/${id}`, { method: 'DELETE' });
  }
}

export default ClawFi;
