import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PredictionResult } from '../types';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Flame,
  Info,
  Sliders,
  Check,
  AlertTriangle
} from 'lucide-react';
import { theme } from '../styles/theme';

export const PredictiveLab: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'regression' | 'classification' | 'predict'>('regression');

  // Interactive Live Predictor Form State
  const [rainfall, setRainfall] = useState(250);
  const [temp, setTemp] = useState(28.5);
  const [humidity, setHumidity] = useState(60);
  const [soilMoisture, setSoilMoisture] = useState(28);
  const [ndvi, setNdvi] = useState(0.45);
  const [region, setRegion] = useState('Pune');
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    api.getModelBenchmarks()
      .then((data) => {
        setBenchmarks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await api.predictSample({
        rainfall_mm: Number(rainfall),
        temperature_c: Number(temp),
        humidity_pct: Number(humidity),
        soil_moisture_pct: Number(soilMoisture),
        ndvi: Number(ndvi),
        region
      });
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !benchmarks) {
    return (
      <div style={{ padding: '80px 32px', textAlign: 'center', color: theme.colors.inkMuted }}>
        <p style={{ fontSize: '14px', fontWeight: 600 }}>
          Loading Model Benchmarks & Calibrating Inference Engine...
        </p>
      </div>
    );
  }

  const regModels = benchmarks.predictive_modeling?.regression || [];
  const clfModels = benchmarks.predictive_modeling?.classification || [];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#222C36',
          color: '#FFFFFF',
          borderRadius: theme.radii.lg,
          padding: '24px 28px',
          border: '1px solid #323E4C',
          boxShadow: theme.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              backgroundColor: theme.colors.scientific,
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: theme.typography.fontMono,
            }}
          >
            Module 04 • Machine Learning Laboratory
          </span>
          <span style={{ fontSize: '11px', color: '#D4DDD8', fontFamily: theme.typography.fontMono }}>
            Dual-Target Architecture Benchmarks & Real-Time Inference
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 6px', color: '#FFFFFF' }}>
          Predictive Modeling Laboratory & Architecture Benchmarking
        </h2>
        <p style={{ fontSize: '13px', color: '#E5EDE8', lineHeight: 1.55, maxWidth: '820px' }}>
          Rigorous benchmarking of parametric ordinary least squares regression against non-linear tree ensembles for crop yield forecasting and leakage-free drought category classification.
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid ${theme.colors.divider}`, paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('regression')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeTab === 'regression' ? `1px solid ${theme.colors.scientific}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'regression' ? theme.colors.scientific : '#FFFFFF',
            color: activeTab === 'regression' ? '#FFFFFF' : theme.colors.ink,
            transition: 'all 0.12s ease',
          }}
        >
          Regression Benchmarks (Crop Yield t/ha)
        </button>
        <button
          onClick={() => setActiveTab('classification')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeTab === 'classification' ? `1px solid ${theme.colors.scientific}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'classification' ? theme.colors.scientific : '#FFFFFF',
            color: activeTab === 'classification' ? '#FFFFFF' : theme.colors.ink,
            transition: 'all 0.12s ease',
          }}
        >
          Classification Benchmarks (Drought Category)
        </button>
        <button
          onClick={() => setActiveTab('predict')}
          style={{
            padding: '8px 16px',
            borderRadius: theme.radii.sm,
            border: activeTab === 'predict' ? `1px solid ${theme.colors.terracotta}` : `1px solid ${theme.colors.divider}`,
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'predict' ? theme.colors.terracotta : '#FFFFFF',
            color: activeTab === 'predict' ? '#FFFFFF' : theme.colors.ink,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
          }}
        >
          <Cpu size={14} />
          <span>Interactive Dual-Inference Tool</span>
        </button>
      </div>

      {/* REGRESSION TAB */}
      {activeTab === 'regression' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="rd-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                  Crop Yield Predictive Performance (ton/ha)
                </h3>
                <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                  Evaluated on 80/20 train/test split with 5-Fold Cross-Validation
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: theme.radii.xs,
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.ink,
                  border: `1px solid ${theme.colors.divider}`,
                  fontFamily: theme.typography.fontMono,
                  fontWeight: 600,
                }}
              >
                Target: <code>Crop_Yield_ton_ha</code>
              </span>
            </div>

            <div className="rd-table-container">
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Test $R^2$</th>
                    <th>Adjusted $R^2$</th>
                    <th>RMSE (t/ha)</th>
                    <th>MAE (t/ha)</th>
                    <th>5-Fold CV $R^2$</th>
                  </tr>
                </thead>
                <tbody>
                  {regModels.map((m: any) => {
                    const isBest = m.R2_Score > 0.975;
                    return (
                      <tr key={m.Model} style={{ backgroundColor: isBest ? '#FAF8F4' : undefined }}>
                        <td style={{ fontWeight: 700, color: theme.colors.ink }}>
                          {m.Model}
                          {isBest && (
                            <span style={{ marginLeft: '8px', fontSize: '10px', padding: '1px 6px', borderRadius: '2px', backgroundColor: theme.colors.risk.low.bg, color: theme.colors.risk.low.text, fontWeight: 700, fontFamily: theme.typography.fontMono }}>
                              Selected Production Model
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            fontFamily: theme.typography.fontMono,
                            fontWeight: 700,
                            color: isBest ? theme.colors.risk.low.text : theme.colors.ink,
                          }}
                        >
                          {m.R2_Score}
                        </td>
                        <td style={{ fontFamily: theme.typography.fontMono }}>{m.Adjusted_R2}</td>
                        <td
                          style={{
                            fontFamily: theme.typography.fontMono,
                            fontWeight: 600,
                            color: m.RMSE < 0.5 ? theme.colors.risk.low.text : theme.colors.risk.severe.text,
                          }}
                        >
                          {m.RMSE}
                        </td>
                        <td style={{ fontFamily: theme.typography.fontMono }}>{m.MAE}</td>
                        <td style={{ fontFamily: theme.typography.fontMono, fontWeight: 600 }}>
                          {m.CV_R2_Mean} ± {m.CV_R2_Std}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Research Insight on Ceiling & Residuals */}
          <div
            className="rd-card"
            style={{
              padding: '20px 24px',
              backgroundColor: theme.colors.surfaceAlt,
              borderLeft: `4px solid ${theme.colors.terracotta}`,
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: theme.colors.ink, marginBottom: '4px' }}>
              Resolution of the 8.5 t/ha Yield Plateau & Linear Error Elimination
            </h4>
            <p style={{ fontSize: '12.5px', color: theme.colors.inkMuted, lineHeight: 1.6 }}>
              In the baseline Multiple Linear Regression model ($R^2 = 0.875, RMSE = 0.843$), residuals exhibit severe heteroscedasticity due to the <strong>8.5 ton/ha physiological plateau</strong> (153 capped observations). Linear regression continuously projects upward during heavy monsoon spikes, producing over-prediction artifacts up to 10.5 t/ha. In contrast, Random Forest and Gradient Boosting partition the multi-dimensional feature space into piecewise constant steps, capturing the natural plateau and slashing RMSE by <strong>55.2%</strong> ($RMSE = 0.378$ t/ha).
            </p>
          </div>
        </div>
      )}

      {/* CLASSIFICATION TAB */}
      {activeTab === 'classification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="rd-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                  Drought Category Classification Benchmarks
                </h3>
                <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                  Evaluated on 80/20 Stratified Split with 5-Fold Stratified CV (Drought_Index strictly excluded)
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: theme.radii.xs,
                  backgroundColor: theme.colors.risk.low.bg,
                  color: theme.colors.risk.low.text,
                  border: `1px solid ${theme.colors.risk.low.border}`,
                  fontWeight: 700,
                  fontFamily: theme.typography.fontMono,
                }}
              >
                100% Target Leakage-Free
              </span>
            </div>

            <div className="rd-table-container">
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>Classification Algorithm</th>
                    <th>Test Accuracy</th>
                    <th>Macro Precision</th>
                    <th>Macro Recall</th>
                    <th>Macro F1 Score</th>
                    <th>5-Fold Stratified CV</th>
                  </tr>
                </thead>
                <tbody>
                  {clfModels.map((m: any) => {
                    const isBest = m.Macro_F1 >= 0.78;
                    return (
                      <tr key={m.Model} style={{ backgroundColor: isBest ? '#FAF8F4' : undefined }}>
                        <td style={{ fontWeight: 700, color: theme.colors.ink }}>
                          {m.Model}
                          {isBest && (
                            <span style={{ marginLeft: '8px', fontSize: '10px', padding: '1px 6px', borderRadius: '2px', backgroundColor: theme.colors.risk.low.bg, color: theme.colors.risk.low.text, fontWeight: 700, fontFamily: theme.typography.fontMono }}>
                              Superior Architecture
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            fontFamily: theme.typography.fontMono,
                            fontWeight: 700,
                            color: m.Accuracy >= 0.77 ? theme.colors.risk.low.text : theme.colors.ink,
                          }}
                        >
                          {(m.Accuracy * 100).toFixed(1)}%
                        </td>
                        <td style={{ fontFamily: theme.typography.fontMono }}>{(m.Macro_Precision * 100).toFixed(1)}%</td>
                        <td style={{ fontFamily: theme.typography.fontMono }}>{(m.Macro_Recall * 100).toFixed(1)}%</td>
                        <td style={{ fontFamily: theme.typography.fontMono, fontWeight: 700, color: theme.colors.ink }}>
                          {m.Macro_F1}
                        </td>
                        <td style={{ fontFamily: theme.typography.fontMono }}>
                          {(m.CV_Accuracy_Mean * 100).toFixed(1)}% ± {(m.CV_Accuracy_Std * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confusion Matrices Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
            {clfModels.map((m: any) => (
              <div key={m.Model} className="rd-card" style={{ padding: '18px 20px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: theme.colors.ink, marginBottom: '12px' }}>
                  {m.Model} Confusion Matrix
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '6px', fontSize: '11px', textAlign: 'center' }}>
                  <div />
                  <div style={{ fontWeight: 700, color: theme.colors.risk.low.text, padding: '4px', fontFamily: theme.typography.fontMono }}>Pred Low</div>
                  <div style={{ fontWeight: 700, color: theme.colors.risk.moderate.text, padding: '4px', fontFamily: theme.typography.fontMono }}>Pred Mod</div>
                  <div style={{ fontWeight: 700, color: theme.colors.risk.high.text, padding: '4px', fontFamily: theme.typography.fontMono }}>Pred High</div>

                  <div style={{ fontWeight: 700, textAlign: 'right', padding: '6px 8px 6px 0', color: theme.colors.inkMuted }}>Act Low</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.risk.low.bg, fontWeight: 700, color: theme.colors.risk.low.text, borderRadius: '3px', fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[0][0]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[0][1]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[0][2]}</div>

                  <div style={{ fontWeight: 700, textAlign: 'right', padding: '6px 8px 6px 0', color: theme.colors.inkMuted }}>Act Mod</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[1][0]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.risk.moderate.bg, fontWeight: 700, color: theme.colors.risk.moderate.text, borderRadius: '3px', fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[1][1]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[1][2]}</div>

                  <div style={{ fontWeight: 700, textAlign: 'right', padding: '6px 8px 6px 0', color: theme.colors.inkMuted }}>Act High</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[2][0]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.surfaceAlt, borderRadius: '3px', color: theme.colors.inkLight, fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[2][1]}</div>
                  <div style={{ padding: '8px 4px', backgroundColor: theme.colors.risk.high.bg, fontWeight: 700, color: theme.colors.risk.high.text, borderRadius: '3px', fontFamily: theme.typography.fontMono }}>{m.Confusion_Matrix[2][2]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE INFERENCE TOOL TAB */}
      {activeTab === 'predict' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '24px' }} className="rd-grid-responsive">
          {/* Input Form Console */}
          <div className="rd-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: theme.colors.terracotta, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: theme.typography.fontMono }}>
                Operational Simulator
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                Biophysical Observation Inputs
              </h3>
              <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                Calibrate environmental factors to trigger dual model inference and local feature attribution
              </p>
            </div>

            <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                  <span>Monthly Precipitation</span>
                  <span style={{ fontFamily: theme.typography.fontMono, color: theme.colors.terracotta, fontWeight: 700 }}>{rainfall} mm</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="800"
                  step="5"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.terracotta }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                  <span>Ambient Temperature</span>
                  <span style={{ fontFamily: theme.typography.fontMono, color: theme.colors.terracotta, fontWeight: 700 }}>{temp} °C</span>
                </label>
                <input
                  type="range"
                  min="18"
                  max="44"
                  step="0.5"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.terracotta }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                  <span>Atmospheric Relative Humidity</span>
                  <span style={{ fontFamily: theme.typography.fontMono, color: theme.colors.terracotta, fontWeight: 700 }}>{humidity} %</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.terracotta }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                  <span>Root-Zone Soil Moisture</span>
                  <span style={{ fontFamily: theme.typography.fontMono, color: theme.colors.terracotta, fontWeight: 700 }}>{soilMoisture} %</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="65"
                  step="1"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.terracotta }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                  <span>NDVI Canopy Vigor Index</span>
                  <span style={{ fontFamily: theme.typography.fontMono, color: theme.colors.terracotta, fontWeight: 700 }}>{ndvi}</span>
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.88"
                  step="0.01"
                  value={ndvi}
                  onChange={(e) => setNdvi(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.terracotta }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.ink, display: 'block', marginBottom: '4px' }}>
                  Target Agro-Ecological District
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="rd-select"
                >
                  <option value="Pune">Pune District</option>
                  <option value="Solapur">Solapur District</option>
                  <option value="Ahmednagar">Ahmednagar District</option>
                  <option value="Nashik">Nashik District</option>
                  <option value="Satara">Satara District</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={predicting}
                className="rd-btn-terracotta"
                style={{ padding: '10px 16px', width: '100%', marginTop: '6px' }}
              >
                {predicting ? 'Executing Model Inference...' : 'Run Dual-Target Inference & Attribution'}
              </button>
            </form>
          </div>

          {/* Prediction Output & Attribution Panel */}
          <div className="rd-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: theme.colors.scientific, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: theme.typography.fontMono }}>
                Diagnostic Telemetry
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
                Model Inference & Biophysical Attribution
              </h3>
              <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
                Multi-model prediction outputs with localized feature attribution
              </p>
            </div>

            {prediction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Results Header Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: theme.colors.surfaceAlt,
                      borderRadius: theme.radii.sm,
                      border: `1px solid ${theme.colors.divider}`,
                    }}
                  >
                    <span style={{ fontSize: '10px', color: theme.colors.inkMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Predicted Drought Severity
                    </span>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: prediction.predicted_drought_category === 'High' ? theme.colors.risk.high.text : (prediction.predicted_drought_category === 'Moderate' ? theme.colors.risk.moderate.text : theme.colors.risk.low.text),
                        margin: '4px 0',
                      }}
                    >
                      {prediction.predicted_drought_category} Risk
                    </div>
                    <div style={{ display: 'flex', gap: '4px', fontSize: '10px', fontFamily: theme.typography.fontMono, color: theme.colors.inkMuted }}>
                      <span>L: {(prediction.drought_probabilities.Low * 100).toFixed(0)}%</span> •
                      <span>M: {(prediction.drought_probabilities.Moderate * 100).toFixed(0)}%</span> •
                      <span>H: {(prediction.drought_probabilities.High * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: theme.colors.surfaceAlt,
                      borderRadius: theme.radii.sm,
                      border: `1px solid ${theme.colors.divider}`,
                    }}
                  >
                    <span style={{ fontSize: '10px', color: theme.colors.inkMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Ensemble Crop Yield
                    </span>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: theme.colors.ink,
                        margin: '4px 0',
                        fontFamily: theme.typography.fontMono,
                      }}
                    >
                      {prediction.predicted_crop_yield_ton_ha} t/ha
                    </div>
                    <span style={{ fontSize: '11px', color: theme.colors.inkMuted }}>
                      OLS Linear: {prediction.linear_regression_yield_ton_ha} t/ha
                    </span>
                  </div>
                </div>

                {/* Local Explanation & Feature Contributions Ledger */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: theme.radii.sm,
                    border: `1px solid ${theme.colors.divider}`,
                  }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: theme.colors.ink, marginBottom: '6px' }}>
                    Localized Biophysical Feature Attribution
                  </h4>
                  <p style={{ fontSize: '12px', color: theme.colors.inkMuted, lineHeight: 1.5 }}>
                    <strong>Primary Driver:</strong> {prediction.explanation.primary_driver} represents the primary variable governing this scenario ({prediction.explanation.driver_effect}).
                  </p>

                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {Object.entries(prediction.explanation.feature_contributions).map(([feat, delta]) => (
                      <div
                        key={feat}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                          borderBottom: '1px dashed #E8E4DB',
                          paddingBottom: '3px',
                        }}
                      >
                        <span style={{ color: theme.colors.inkMuted }}>{feat}:</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: delta > 0 ? theme.colors.risk.low.text : (delta < 0 ? theme.colors.risk.high.text : theme.colors.ink),
                            fontFamily: theme.typography.fontMono,
                          }}
                        >
                          {delta > 0 ? `+${delta}` : delta} t/ha
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {prediction.input_warnings.length > 0 && (
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: theme.colors.risk.moderate.bg,
                      borderRadius: theme.radii.xs,
                      border: `1px solid ${theme.colors.risk.moderate.border}`,
                      fontSize: '11px',
                      color: theme.colors.risk.moderate.text,
                    }}
                  >
                    <strong>Input Range Notice:</strong> {prediction.input_warnings[0]}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: theme.colors.surfaceAlt,
                  borderRadius: theme.radii.sm,
                  border: `1px dashed ${theme.colors.divider}`,
                  color: theme.colors.inkLight,
                }}
              >
                <Cpu size={28} color={theme.colors.terracotta} style={{ marginBottom: '10px', opacity: 0.8 }} />
                <p style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.ink }}>
                  Awaiting Input Calibration
                </p>
                <p style={{ fontSize: '11.5px', color: theme.colors.inkMuted, maxWidth: '280px', marginTop: '4px' }}>
                  Adjust environmental sliders on the left and trigger inference to view dual predictions and attribution.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
