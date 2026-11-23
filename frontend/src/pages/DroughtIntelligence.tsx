import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Flame, ShieldAlert, BarChart3, TrendingDown, Info, ShieldCheck, MapPin, AlertTriangle, Layers, Compass } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { theme } from '../styles/theme';

export const DroughtIntelligence: React.FC = () => {
  const [droughtData, setDroughtData] = useState<{
    percentile_thresholds: {
      "33rd_percentile_low_cutoff": number;
      "66th_percentile_high_cutoff": number;
    };
    overall_distribution: Record<string, number>;
    regional_distribution_pct: any[];
    yearly_progression: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  useEffect(() => {
    api.getDroughtIntelligence()
      .then((data) => {
        setDroughtData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !droughtData) {
    return (
      <div style={{ padding: '80px 32px', textAlign: 'center', color: theme.colors.inkMuted }}>
        <p style={{ fontSize: '14px', fontWeight: 600 }}>
          Calculating Empirical Drought Severity Distribution & Quantile Thresholds...
        </p>
      </div>
    );
  }

  const pieData = Object.entries(droughtData.overall_distribution).map(([category, count]) => ({
    name: `${category} Risk`,
    value: count,
    category
  }));

  const pieColors: Record<string, string> = {
    'Low Risk': theme.colors.risk.low.base,
    'Moderate Risk': theme.colors.risk.moderate.base,
    'High Risk': theme.colors.risk.high.base
  };

  const lowCutoff = droughtData.percentile_thresholds['33rd_percentile_low_cutoff'];
  const highCutoff = droughtData.percentile_thresholds['66th_percentile_high_cutoff'];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#2A2926',
          color: '#FFFFFF',
          borderRadius: theme.radii.lg,
          padding: '24px 28px',
          border: '1px solid #3E3B37',
          boxShadow: theme.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              backgroundColor: theme.colors.terracotta,
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: theme.typography.fontMono,
            }}
          >
            Module 03 • Empirical Partitioning
          </span>
          <span style={{ fontSize: '11px', color: '#DBD5CC', fontFamily: theme.typography.fontMono }}>
            Unbiased 33rd & 66th Percentile Thresholds
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 6px', color: '#FFFFFF' }}>
          Drought Severity Categorization & Spatial Recurrence
        </h2>
        <p style={{ fontSize: '13px', color: '#ECE5DE', lineHeight: 1.55, maxWidth: '820px' }}>
          Unbiased classification of agro-climatic stress levels using empirical percentile thresholds (33rd & 66th quantiles), revealing persistent drought clusters across east-central Maharashtra.
        </p>
      </div>

      {/* Prominent Severity Threshold & Indicator Architecture */}
      <div className="rd-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
              Standardized Cumulative Percentile Thresholds
            </h3>
            <p style={{ fontSize: '12px', color: theme.colors.inkMuted }}>
              Derived directly from the empirical cumulative distribution of <code>Drought_Index</code> across 500 validated samples
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: theme.radii.xs,
              backgroundColor: theme.colors.surfaceAlt,
              color: theme.colors.inkMuted,
              border: `1px solid ${theme.colors.divider}`,
              fontFamily: theme.typography.fontMono,
              fontWeight: 600,
            }}
          >
            Zero Subjective Boundary Bias
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Low Risk */}
          <div
            style={{
              padding: '16px 18px',
              backgroundColor: theme.colors.risk.low.bg,
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.risk.low.border}`,
              borderTop: `3px solid ${theme.colors.risk.low.base}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.risk.low.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Low Risk (&lt; 33rd Pct)
              </span>
              <span style={{ fontSize: '10px', fontFamily: theme.typography.fontMono, color: theme.colors.risk.low.text, fontWeight: 700 }}>
                167 Months (33.4%)
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.risk.low.text, margin: '6px 0', fontFamily: theme.typography.fontMono }}>
              &lt; {lowCutoff}
            </div>
            <p style={{ fontSize: '12px', color: theme.colors.risk.low.text, lineHeight: 1.45 }}>
              Adequate sub-surface moisture and healthy vegetative canopy vigor. Minimal agricultural yield depression.
            </p>
          </div>

          {/* Moderate Risk */}
          <div
            style={{
              padding: '16px 18px',
              backgroundColor: theme.colors.risk.moderate.bg,
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.risk.moderate.border}`,
              borderTop: `3px solid ${theme.colors.risk.moderate.base}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.risk.moderate.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Moderate Risk (33–66th Pct)
              </span>
              <span style={{ fontSize: '10px', fontFamily: theme.typography.fontMono, color: theme.colors.risk.moderate.text, fontWeight: 700 }}>
                167 Months (33.4%)
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.risk.moderate.text, margin: '6px 0', fontFamily: theme.typography.fontMono }}>
              {lowCutoff} – {highCutoff}
            </div>
            <p style={{ fontSize: '12px', color: theme.colors.risk.moderate.text, lineHeight: 1.45 }}>
              Intra-seasonal monsoon break or high vapor pressure deficit. Root-zone soil hydration drops to 20–32%.
            </p>
          </div>

          {/* High Risk */}
          <div
            style={{
              padding: '16px 18px',
              backgroundColor: theme.colors.risk.high.bg,
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.risk.high.border}`,
              borderTop: `3px solid ${theme.colors.risk.high.base}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.risk.high.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                High Risk (&gt; 66th Pct)
              </span>
              <span style={{ fontSize: '10px', fontFamily: theme.typography.fontMono, color: theme.colors.risk.high.text, fontWeight: 700 }}>
                166 Months (33.2%)
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.risk.high.text, margin: '6px 0', fontFamily: theme.typography.fontMono }}>
              &gt; {highCutoff}
            </div>
            <p style={{ fontSize: '12px', color: theme.colors.risk.high.text, lineHeight: 1.45 }}>
              Acute meteorological desiccation and root-zone water starvation. Drastic crop harvest suppression below 4.5 t/ha.
            </p>
          </div>
        </div>
      </div>

      {/* Dominant Visualizers: Regional Composition Stacked Bar & Donut Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.9fr', gap: '22px' }} className="rd-grid-responsive">
        {/* Regional Composition Stacked Bar Chart */}
        <div className="rd-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                District Drought Exposure Profile (% Months)
              </h3>
              <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                Proportion of observation months spent in Low, Moderate, vs High drought severity
              </p>
            </div>
          </div>

          <div style={{ height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={droughtData.regional_distribution_pct}
                margin={{ top: 10, right: 25, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DB" />
                <XAxis dataKey="Region" tick={{ fill: theme.colors.ink, fontSize: 12, fontWeight: 700 }} />
                <YAxis unit="%" tick={{ fill: theme.colors.inkMuted, fontSize: 11, fontFamily: theme.typography.fontMono }} />
                <Tooltip
                  formatter={(val: number) => [`${val}% of observation months`, 'Severity Ratio']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${theme.colors.divider}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    boxShadow: theme.shadows.card
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Low" name="Low Risk (<2.16)" stackId="a" fill={theme.colors.risk.low.base} />
                <Bar dataKey="Moderate" name="Moderate Risk (2.16–3.34)" stackId="a" fill={theme.colors.risk.moderate.base} />
                <Bar dataKey="High" name="High Risk (>3.34)" stackId="a" fill={theme.colors.risk.high.base} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-Wide Distribution Donut Chart */}
        <div className="rd-card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em', marginBottom: '2px' }}>
            State-Wide Empirical Terciles (N = 500)
          </h3>
          <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginBottom: '14px' }}>
            Balanced 3-tier statistical categorization across all observation records
          </p>

          <div style={{ flex: 1, minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={pieColors[entry.name] || theme.colors.scientific} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Months (${((val / 500) * 100).toFixed(1)}%)`, 'Frequency']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${theme.colors.divider}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    boxShadow: theme.shadows.card
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: theme.colors.surfaceAlt,
              borderRadius: theme.radii.sm,
              border: `1px solid ${theme.colors.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: theme.typography.fontMono,
            }}
          >
            <span>Low: <strong>167</strong></span>
            <span>Moderate: <strong>167</strong></span>
            <span>High: <strong>166</strong></span>
          </div>
        </div>
      </div>

      {/* Spatial Recurrence & Regional Deep-Dive Diagnosis */}
      <div
        className="rd-card"
        style={{
          padding: '20px 24px',
          borderLeft: `4px solid ${theme.colors.terracotta}`,
          backgroundColor: theme.colors.surfaceAlt,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <AlertTriangle size={17} color={theme.colors.terracotta} />
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: theme.colors.ink }}>
            Spatial Recurrence Diagnosis across the Agro-Ecological Corridor
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: theme.colors.inkMuted, lineHeight: 1.6 }}>
          <strong>Solapur</strong> and <strong>Ahmednagar</strong> exhibit chronic drought exposure, with <strong>59.6%</strong> and <strong>49.0%</strong> of their recorded months in the High Severity bracket respectively. In stark contrast, <strong>Satara</strong> (only 7.6% High) and <strong>Nashik</strong> (11.1% High) demonstrate sustained natural buffering capacity, sustained by Western Ghats orographic precipitation.
        </p>
      </div>
    </div>
  );
};
