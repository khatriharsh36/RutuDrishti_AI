import {
  OverviewData,
  RegionalClimate,
  MonthlyTrend,
  RegionalVulnerabilityItem,
  PredictionResult,
  SimulationResult
} from '../types';

const API_BASE = '/api';

export const api = {
  async getOverview(): Promise<OverviewData> {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to fetch overview data');
    return res.json();
  },

  async getClimateAnalytics(): Promise<{
    regional_climate: RegionalClimate[];
    monthly_trends: MonthlyTrend[];
    correlations: any[];
    vif: any[];
  }> {
    const res = await fetch(`${API_BASE}/climate`);
    if (!res.ok) throw new Error('Failed to fetch climate analytics');
    return res.json();
  },

  async getDroughtIntelligence(): Promise<{
    percentile_thresholds: {
      "33rd_percentile_low_cutoff": number;
      "66th_percentile_high_cutoff": number;
    };
    overall_distribution: Record<string, number>;
    regional_distribution_pct: any[];
    yearly_progression: any[];
  }> {
    const res = await fetch(`${API_BASE}/drought`);
    if (!res.ok) throw new Error('Failed to fetch drought intelligence');
    return res.json();
  },

  async getModelBenchmarks(): Promise<any> {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch model benchmarks');
    return res.json();
  },

  async getRegionalVulnerability(): Promise<{
    methodology: {
      name: string;
      formula: string;
      weighting: string;
      interpretation_standard: string;
    };
    regional_rankings: RegionalVulnerabilityItem[];
  }> {
    const res = await fetch(`${API_BASE}/vulnerability`);
    if (!res.ok) throw new Error('Failed to fetch regional vulnerability');
    return res.json();
  },

  async getExplainableAI(): Promise<any> {
    const res = await fetch(`${API_BASE}/xai`);
    if (!res.ok) throw new Error('Failed to fetch explainable AI data');
    return res.json();
  },

  async predictSample(payload: {
    rainfall_mm: number;
    temperature_c: number;
    humidity_pct: number;
    soil_moisture_pct: number;
    ndvi: number;
    region?: string;
  }): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Prediction request failed');
    return res.json();
  },

  async simulateScenario(payload: {
    base_region: string;
    rainfall_change_pct: number;
    temperature_change_c: number;
    soil_moisture_change_pct: number;
    ndvi_change: number;
  }): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Simulation request failed');
    return res.json();
  },

  async getDatasetRecords(limit: number = 50, offset: number = 0, region?: string): Promise<{
    total: number;
    offset: number;
    limit: number;
    records: any[];
  }> {
    const query = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    if (region) query.append('region', region);
    
    const res = await fetch(`${API_BASE}/data/records?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch dataset records');
    return res.json();
  }
};
