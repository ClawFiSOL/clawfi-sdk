/**
 * Signal Utilities
 */

import { Signal, SignalSeverity, SignalType } from './types';

/**
 * Signal severity weights for risk calculation
 */
export const SEVERITY_WEIGHTS: Record<SignalSeverity, number> = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 5,
};

/**
 * Signal type risk factors
 */
export const TYPE_RISK_FACTORS: Record<SignalType, number> = {
  whale_movement: 1.2,
  liquidity_change: 1.5,
  holder_concentration: 1.3,
  contract_risk: 2.0,
  price_manipulation: 1.8,
  rugpull_risk: 3.0,
  honeypot: 3.0,
  mint_authority: 2.5,
  social_sentiment: 0.8,
};

/**
 * Calculate risk score from signals
 */
export function calculateRiskScore(signals: Signal[]): number {
  if (signals.length === 0) return 0;

  let totalScore = 0;
  let maxScore = 0;

  for (const signal of signals) {
    const severityWeight = SEVERITY_WEIGHTS[signal.severity] || 1;
    const typeFactor = TYPE_RISK_FACTORS[signal.type] || 1;
    const signalScore = severityWeight * typeFactor;
    
    totalScore += signalScore;
    maxScore = Math.max(maxScore, signalScore);
  }

  // Combine average and max for balanced score
  const avgScore = totalScore / signals.length;
  const combinedScore = (avgScore * 0.6) + (maxScore * 0.4);
  
  // Normalize to 0-100
  return Math.min(100, Math.round(combinedScore * 10));
}

/**
 * Filter signals by severity
 */
export function filterBySeverity(signals: Signal[], minSeverity: SignalSeverity): Signal[] {
  const minWeight = SEVERITY_WEIGHTS[minSeverity];
  return signals.filter(s => SEVERITY_WEIGHTS[s.severity] >= minWeight);
}

/**
 * Filter signals by type
 */
export function filterByType(signals: Signal[], types: SignalType[]): Signal[] {
  return signals.filter(s => types.includes(s.type));
}

/**
 * Get critical signals
 */
export function getCriticalSignals(signals: Signal[]): Signal[] {
  return signals.filter(s => s.severity === 'critical' || s.severity === 'high');
}

/**
 * Sort signals by severity (highest first)
 */
export function sortBySeverity(signals: Signal[]): Signal[] {
  return [...signals].sort((a, b) => 
    SEVERITY_WEIGHTS[b.severity] - SEVERITY_WEIGHTS[a.severity]
  );
}

/**
 * Group signals by type
 */
export function groupByType(signals: Signal[]): Record<SignalType, Signal[]> {
  return signals.reduce((acc, signal) => {
    if (!acc[signal.type]) {
      acc[signal.type] = [];
    }
    acc[signal.type].push(signal);
    return acc;
  }, {} as Record<SignalType, Signal[]>);
}

/**
 * Check if signals indicate high risk
 */
export function isHighRisk(signals: Signal[]): boolean {
  const riskScore = calculateRiskScore(signals);
  return riskScore >= 70 || signals.some(s => 
    s.type === 'honeypot' || 
    s.type === 'rugpull_risk' ||
    s.severity === 'critical'
  );
}

/**
 * Get risk level string
 */
export function getRiskLevel(score: number): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
  if (score < 20) return 'safe';
  if (score < 40) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
}

/**
 * Format signal for display
 */
export function formatSignal(signal: Signal): string {
  const severityEmoji: Record<SignalSeverity, string> = {
    info: 'ℹ️',
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };

  return `${severityEmoji[signal.severity]} [${signal.severity.toUpperCase()}] ${signal.title}: ${signal.summary}`;
}
