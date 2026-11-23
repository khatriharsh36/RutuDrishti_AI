import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HelpCircle, Code, ShieldCheck, GitFork, BarChart3, AlertCircle, Compass, Terminal, Search, BookOpen } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { theme } from '../styles/theme';

export const ExplainableAI: React.FC = () => {
  const [xaiData, setXaiData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeXaiTab, setActiveXaiTab] = useState<'importance' | 'tree' | 'coefficients'>('importance');
  const [ruleFilter, setRuleFilter] = useState('');

  useEffect(() => {
    api.getExplainableAI()
      .then((data) => {
        setXaiData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !xaiData) {
    return (
      <div style={{ padding: '80px 32px', textAlign: 'center', color: theme.colors.inkMuted }}>
        <p style={{ fontSize: '14px', fontWeight: 600 }}>
          Extracting Explainable AI Decision Boundaries & Permutation Attributions...
        </p>
      </div>
    );
  }

  const fiData = xaiData.feature_importance || [];
  const permData = (xaiData.permutation_importance || []).map((item: any) => ({
    feature: item.Feature,
    importance: item.Mean_Importance
  }));
  const linearCoeffs = xaiData.linear_coefficients || [];

  const filteredTreeRules = (xaiData.tree_rules || '')
    .split('\n')
    .filter((line: string) => line.toLowerCase().includes(ruleFilter.toLowerCase()))
    .join('\n');

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#202E33',
          color: '#FFFFFF',
          borderRadius: theme.radii.lg,
          padding: '24px 28px',
          border: '1px solid #30424A',
          boxShadow: theme.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              backgroundColor: '#5E8B94',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: theme.typography.fontMono,
            }}
          >
            Module 06 • Transparency Suite
          </span>
          <span style={{ fontSize: '11px', color: '#DCE8E5', fontFamily: theme.typography.fontMono }}>
            Multi-Tier Explainability & Epistemological Boundaries
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 6px', color: '#FFFFFF' }}>
          Explainable AI (XAI) & Interpretability Suite
        </h2>
        <p style={{ fontSize: '13px', color: '#E4F0EC', lineHeight: 1.55, maxWidth: '820px' }}>
          Demystifying complex machine learning models through global Gini importance, held-out permutation feature ablation, explicit tree decision logic, and parametric linear sensitivity coefficients.
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid ${theme.colors.divider}`, paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveXaiTab('importance')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeXaiTab === 'importance' ? `1px solid ${theme.colors.scientific}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeXaiTab === 'importance' ? theme.colors.scientific : '#FFFFFF',
            color: activeXaiTab === 'importance' ? '#FFFFFF' : theme.colors.ink,
            transition: 'all 0.12s ease',
          }}
        >
          Feature Importance Benchmarks
        </button>
        <button
          onClick={() => setActiveXaiTab('tree')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeXaiTab === 'tree' ? `1px solid ${theme.colors.scientific}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeXaiTab === 'tree' ? theme.colors.scientific : '#FFFFFF',
            color: activeXaiTab === 'tree' ? '#FFFFFF' : theme.colors.ink,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
          }}
        >
          <GitFork size={14} />
          <span>Decision Tree Structural Rules</span>
        </button>
        <button
          onClick={() => setActiveXaiTab('coefficients')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeXaiTab === 'coefficients' ? `1px solid ${theme.colors.scientific}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeXaiTab === 'coefficients' ? theme.colors.scientific : '#FFFFFF',
            color: activeXaiTab === 'coefficients' ? '#FFFFFF' : theme.colors.ink,
            transition: 'all 0.12s ease',
          }}
        >
          Linear Regression Coefficients
        </button>
      </div>

      {/* TAB 1: FEATURE IMPORTANCE */}
      {activeXaiTab === 'importance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '22px' }} className="rd-grid-responsive">
            <div className="rd-card" style={{ padding: '22px 24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                Normalized Gini Feature Importance
              </h3>
              <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginBottom: '14px' }}>
                Comparison of impurity-based attribution across Decision Tree, Random Forest, and Gradient Boosting
              </p>

              <div style={{ height: '290px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fiData} margin={{ top: 10, right: 25, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DB" />
                    <XAxis dataKey="Feature" tick={{ fill: theme.colors.ink, fontSize: 11, fontWeight: 700 }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fill: theme.colors.inkMuted, fontSize: 11, fontFamily: theme.typography.fontMono }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${theme.colors.divider}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        boxShadow: theme.shadows.card
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} />
                    <Bar dataKey="Random_Forest" name="Random Forest" fill={theme.colors.scientific} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Gradient_Boosting" name="Gradient Boosting" fill="#2E707E" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Decision_Tree" name="Decision Tree" fill="#5E8B94" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Permutation Importance */}
            <div className="rd-card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                Test Set Permutation Importance
              </h3>
              <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginBottom: '14px' }}>
                Mean classification accuracy drop when test feature values are randomly permuted
              </p>

              <div style={{ flex: 1, minHeight: '290px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={permData} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E4DB" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: theme.colors.inkLight, fontFamily: theme.typography.fontMono }} />
                    <YAxis dataKey="feature" type="category" tick={{ fill: theme.colors.ink, fontSize: 11, fontWeight: 700 }} />
                    <Tooltip
                      formatter={(val: number) => [`-${(val * 100).toFixed(1)}% Accuracy Drop`, 'Permutation Impact']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${theme.colors.divider}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        boxShadow: theme.shadows.card
                      }}
                    />
                    <Bar dataKey="importance" name="Accuracy Drop" fill={theme.colors.terracotta} radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Epistemic Distinction Callout */}
          <div
            className="rd-card"
            style={{
              padding: '20px 24px',
              backgroundColor: theme.colors.surfaceAlt,
              borderLeft: `4px solid ${theme.colors.terracotta}`,
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: theme.colors.ink, marginBottom: '4px' }}>
              Epistemic Distinction: Feature Importance vs. Physical Causality
            </h4>
            <p style={{ fontSize: '12.5px', color: theme.colors.inkMuted, lineHeight: 1.6 }}>
              A high feature importance score represents strong predictive utility and shared covariance within this dataset; it does <strong>not constitute empirical proof of unilateral physical causality</strong>. Due to biophysical feedback loops (e.g., precipitation directly recharges sub-surface soil moisture, which subsequently sustains canopy transpiration and NDVI greenness), these agro-climatic variables operate as an interconnected ecological system rather than isolated causal levers.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: TREE RULES */}
      {activeXaiTab === 'tree' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="rd-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} color={theme.colors.scientific} />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                    Extracted Decision Tree Splitting Rules (Depth = 4)
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                  Complete hierarchical if-then decision boundaries executed by the model to classify agricultural drought risk
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
                <Search size={14} color={theme.colors.inkMuted} />
                <input
                  type="text"
                  placeholder="Filter rules (e.g. Soil, NDVI)..."
                  value={ruleFilter}
                  onChange={(e) => setRuleFilter(e.target.value)}
                  className="rd-input"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                />
              </div>
            </div>

            <pre
              style={{
                backgroundColor: '#1E252D',
                color: '#E4EDE8',
                padding: '20px',
                borderRadius: theme.radii.sm,
                border: '1px solid #2E3944',
                fontFamily: theme.typography.fontMono,
                fontSize: '12px',
                lineHeight: 1.65,
                maxHeight: '480px',
                overflowY: 'auto'
              }}
            >
              {filteredTreeRules || 'No matching tree rules found for query.'}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: COEFFICIENTS */}
      {activeXaiTab === 'coefficients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="rd-card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em', marginBottom: '2px' }}>
              Multiple Linear Regression Parametric Coefficients
            </h3>
            <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginBottom: '14px' }}>
              Estimated slope parameters (β_i) representing marginal crop harvest changes per unit increase, ceteris paribus
            </p>

            <div className="rd-table-container">
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Feature Parameter</th>
                    <th>Coefficient (β)</th>
                    <th>Biophysical Direction</th>
                    <th>Analytical Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {linearCoeffs.map((row: any) => {
                    const isPositive = row.Coefficient > 0;
                    return (
                      <tr key={row.Feature}>
                        <td style={{ fontWeight: 700, color: theme.colors.ink }}>
                          {row.Feature}
                        </td>
                        <td
                          style={{
                            fontFamily: theme.typography.fontMono,
                            fontWeight: 700,
                            color: isPositive ? theme.colors.risk.low.text : theme.colors.risk.high.text,
                          }}
                        >
                          {isPositive ? `+${row.Coefficient.toFixed(4)}` : row.Coefficient.toFixed(4)}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '10.5px',
                              padding: '2px 7px',
                              borderRadius: '3px',
                              fontWeight: 700,
                              backgroundColor: isPositive ? theme.colors.risk.low.bg : theme.colors.risk.high.bg,
                              color: isPositive ? theme.colors.risk.low.text : theme.colors.risk.high.text,
                              border: `1px solid ${isPositive ? theme.colors.risk.low.border : theme.colors.risk.high.border}`,
                              fontFamily: theme.typography.fontMono,
                            }}
                          >
                            {isPositive ? 'Positive Yield Stimulator' : 'Yield Depressant'}
                          </span>
                        </td>
                        <td style={{ color: theme.colors.inkMuted, fontSize: '12px' }}>
                          {row.Feature === 'NDVI' ? 'High vegetative canopy greenness correlates with denser photosynthetic capacity.' : (
                            row.Feature === 'Drought_Index' ? 'Direct composite climatic desiccation depressing grain filling.' : (
                              row.Feature === 'Soil_Moisture_pct' ? 'Root-zone moisture critical for crop development in semi-arid zones.' : (
                                row.Feature === 'Rainfall_mm' ? 'Primary seasonal precipitation driver.' : 'Ambient heat stress accelerates evapotranspiration.'
                              )
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
