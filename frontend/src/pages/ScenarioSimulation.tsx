import React, { useState } from 'react';
import { api } from '../services/api';
import { SimulationResult } from '../types';
import {
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { theme } from '../styles/theme';

export const ScenarioSimulation: React.FC = () => {
  const [baseRegion, setBaseRegion] = useState('Pune');
  const [rainPct, setRainPct] = useState(-25);
  const [tempChange, setTempChange] = useState(2.0);
  const [smChange, setSmChange] = useState(-6);
  const [ndviChange, setNdviChange] = useState(-0.08);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSimulating(true);
    try {
      const res = await api.simulateScenario({
        base_region: baseRegion,
        rainfall_change_pct: rainPct,
        temperature_change_c: tempChange,
        soil_moisture_change_pct: smChange,
        ndvi_change: ndviChange
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const applyPreset = (preset: 'severeDrought' | 'heatwave' | 'compoundAridity' | 'recharge') => {
    switch (preset) {
      case 'severeDrought':
        setRainPct(-40);
        setTempChange(2.5);
        setSmChange(-10);
        setNdviChange(-0.12);
        break;
      case 'heatwave':
        setRainPct(-15);
        setTempChange(4.5);
        setSmChange(-8);
        setNdviChange(-0.06);
        break;
      case 'compoundAridity':
        setRainPct(-50);
        setTempChange(3.5);
        setSmChange(-14);
        setNdviChange(-0.16);
        break;
      case 'recharge':
        setRainPct(35);
        setTempChange(-1.5);
        setSmChange(10);
        setNdviChange(0.12);
        break;
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#2B2A2E',
          color: '#FFFFFF',
          borderRadius: theme.radii.lg,
          padding: '24px 28px',
          border: '1px solid #3E3C42',
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
            Module 07 • Stress Testing Laboratory
          </span>
          <span style={{ fontSize: '11px', color: '#DCE8E5', fontFamily: theme.typography.fontMono }}>
            Counterfactual Biophysical Anomaly Evaluation
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 6px', color: '#FFFFFF' }}>
          Climate Shock Scenario Simulation Laboratory
        </h2>
        <p style={{ fontSize: '13px', color: '#ECE4DC', lineHeight: 1.55, maxWidth: '820px' }}>
          Test district-level agricultural resilience under hypothetical climate shocks: evaluate how compound heatwaves, delayed monsoon onsets, and soil desiccation shift drought severity and harvest yields.
        </p>
      </div>

      {/* Mandatory Prominent Scientific Protocol Disclaimer */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.colors.risk.moderate.bg,
          border: `1px solid ${theme.colors.risk.moderate.border}`,
          borderLeft: `4px solid ${theme.colors.risk.moderate.base}`,
          borderRadius: theme.radii.sm,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <AlertTriangle size={18} color={theme.colors.risk.moderate.text} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: theme.colors.risk.moderate.text }}>
            Academic Research Protocol — Counterfactual Simulation Sandbox
          </h4>
          <p style={{ fontSize: '12px', color: theme.colors.inkMuted, lineHeight: 1.5, marginTop: '2px' }}>
            All scenario outputs generated in this laboratory are synthetic counterfactual projections computed by RutuDrishti AI's machine learning models. They are <strong>hypothetical what-if simulations</strong> designed for vulnerability stress-testing and <strong>must not be cited as real-world meteorological forecasts</strong> or official disaster declarations.
          </p>
        </div>
      </div>

      {/* Interactive Quick Shock Presets */}
      <div className="rd-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color={theme.colors.terracotta} />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.colors.ink }}>
              Standardized Counterfactual Shock Presets:
            </span>
          </div>
          <span style={{ fontSize: '11px', color: theme.colors.inkLight }}>
            One-click calibration of calibrated climate anomalies
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => applyPreset('severeDrought')}
            className="rd-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Severe Monsoon Drought (-40%)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('heatwave')}
            className="rd-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Extreme Thermal Heatwave (+4.5°C)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('compoundAridity')}
            className="rd-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Compound Aridity Shock (-50% Rain, -14% Soil)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('recharge')}
            className="rd-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Monsoon Surplus Recharge (+35%)
          </button>
        </div>
      </div>

      {/* Split-Screen: Controls & Comparative Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '24px' }} className="rd-grid-responsive">
        {/* Controls Console */}
        <div className="rd-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: theme.colors.terracotta, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: theme.typography.fontMono }}>
              Anomaly Injector
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
              Scenario Shock Parameters
            </h3>
            <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
              Inject compound climatic anomalies against district historical baselines
            </p>
          </div>

          <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.ink, display: 'block', marginBottom: '4px' }}>
                Select Reference District
              </label>
              <select
                value={baseRegion}
                onChange={(e) => setBaseRegion(e.target.value)}
                className="rd-select"
              >
                <option value="Pune">Pune (Central Intermediate Zone)</option>
                <option value="Solapur">Solapur (High-Vulnerability Dryland)</option>
                <option value="Ahmednagar">Ahmednagar (Rainshadow Valley)</option>
                <option value="Nashik">Nashik (Horticultural Sub-Humid)</option>
                <option value="Satara">Satara (Western Ghats Buffer Zone)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                <span>Monsoon Rainfall Deviation (%)</span>
                <span style={{ color: rainPct < 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text, fontFamily: theme.typography.fontMono, fontWeight: 700 }}>
                  {rainPct > 0 ? `+${rainPct}%` : `${rainPct}%`}
                </span>
              </label>
              <input
                type="range"
                min="-60"
                max="60"
                step="5"
                value={rainPct}
                onChange={(e) => setRainPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: rainPct < 0 ? theme.colors.terracotta : theme.colors.risk.low.base }}
              />
              <span style={{ fontSize: '11px', color: theme.colors.inkLight, display: 'block', marginTop: '2px' }}>
                Simulates seasonal deficit (-60%) or torrential excess (+60%)
              </span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                <span>Thermal Anomaly (°C)</span>
                <span style={{ color: tempChange > 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text, fontFamily: theme.typography.fontMono, fontWeight: 700 }}>
                  {tempChange > 0 ? `+${tempChange}°C` : `${tempChange}°C`}
                </span>
              </label>
              <input
                type="range"
                min="-5"
                max="6"
                step="0.5"
                value={tempChange}
                onChange={(e) => setTempChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: theme.colors.terracotta }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                <span>Root-Zone Soil Moisture Shift (%)</span>
                <span style={{ color: smChange < 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text, fontFamily: theme.typography.fontMono, fontWeight: 700 }}>
                  {smChange > 0 ? `+${smChange}%` : `${smChange}%`}
                </span>
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={smChange}
                onChange={(e) => setSmChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: theme.colors.terracotta }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: theme.colors.ink, marginBottom: '4px' }}>
                <span>Vegetation Canopy (NDVI) Shift</span>
                <span style={{ color: ndviChange < 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text, fontFamily: theme.typography.fontMono, fontWeight: 700 }}>
                  {ndviChange > 0 ? `+${ndviChange}` : ndviChange}
                </span>
              </label>
              <input
                type="range"
                min="-0.25"
                max="0.25"
                step="0.01"
                value={ndviChange}
                onChange={(e) => setNdviChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: theme.colors.terracotta }}
              />
            </div>

            <button
              type="submit"
              disabled={simulating}
              className="rd-btn-terracotta"
              style={{ padding: '10px 16px', width: '100%', marginTop: '6px' }}
            >
              <Sparkles size={15} />
              <span>{simulating ? 'Computing Stress Response...' : 'Execute Counterfactual Scenario'}</span>
            </button>
          </form>
        </div>

        {/* Results Deck */}
        <div className="rd-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: theme.colors.scientific, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: theme.typography.fontMono }}>
              Impact Synthesis
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.colors.ink, letterSpacing: '-0.01em' }}>
              Comparative Agro-Climatic Assessment
            </h3>
            <p style={{ fontSize: '12px', color: theme.colors.inkMuted, marginTop: '2px' }}>
              District baseline average vs. Simulated shock response
            </p>
          </div>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Transition Banner */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: result.impact_analysis.severity_escalated ? theme.colors.risk.severe.bg : theme.colors.risk.low.bg,
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${result.impact_analysis.severity_escalated ? theme.colors.risk.severe.border : theme.colors.risk.low.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: result.impact_analysis.severity_escalated ? theme.colors.risk.severe.text : theme.colors.risk.low.text, letterSpacing: '0.05em' }}>
                    Drought Category Shift
                  </span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: theme.colors.ink, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{result.baseline_prediction.predicted_drought_category}</span>
                    <ArrowRight size={15} color={theme.colors.inkMuted} />
                    <span style={{ color: result.impact_analysis.severity_escalated ? theme.colors.risk.severe.text : theme.colors.risk.low.text }}>
                      {result.simulated_prediction.predicted_drought_category} Risk
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: theme.colors.inkMuted, letterSpacing: '0.05em' }}>
                    Yield Impact
                  </span>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: result.impact_analysis.yield_change_ton_ha < 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text,
                      marginTop: '2px',
                      fontFamily: theme.typography.fontMono,
                    }}
                  >
                    {result.impact_analysis.yield_change_ton_ha > 0 ? `+${result.impact_analysis.yield_change_ton_ha}` : result.impact_analysis.yield_change_ton_ha} t/ha
                  </div>
                  <span style={{ fontSize: '11px', color: theme.colors.inkMuted, fontFamily: theme.typography.fontMono }}>
                    ({result.impact_analysis.yield_change_pct > 0 ? `+${result.impact_analysis.yield_change_pct}` : result.impact_analysis.yield_change_pct}%)
                  </span>
                </div>
              </div>

              {/* Side-by-Side Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '16px', backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.sm, border: `1px solid ${theme.colors.divider}` }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.inkMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Historical Baseline
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: theme.colors.ink, margin: '4px 0', fontFamily: theme.typography.fontMono }}>
                    {result.baseline_prediction.predicted_crop_yield_ton_ha} t/ha
                  </div>
                  <div style={{ fontSize: '11px', color: theme.colors.inkMuted, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>Category: <strong style={{ color: theme.colors.ink }}>{result.baseline_prediction.predicted_drought_category}</strong></div>
                    <div>High Probability: <strong style={{ color: theme.colors.ink }}>{(result.baseline_prediction.drought_probabilities.High * 100).toFixed(0)}%</strong></div>
                    <div>Drought Index: <strong style={{ color: theme.colors.ink, fontFamily: theme.typography.fontMono }}>{result.baseline_prediction.estimated_drought_index}</strong></div>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: theme.radii.sm, border: `2px solid ${theme.colors.ink}` }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Simulated Scenario
                  </span>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: result.impact_analysis.yield_change_ton_ha < 0 ? theme.colors.risk.high.text : theme.colors.risk.low.text,
                      margin: '4px 0',
                      fontFamily: theme.typography.fontMono,
                    }}
                  >
                    {result.simulated_prediction.predicted_crop_yield_ton_ha} t/ha
                  </div>
                  <div style={{ fontSize: '11px', color: theme.colors.inkMuted, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>Category: <strong style={{ color: theme.colors.ink }}>{result.simulated_prediction.predicted_drought_category}</strong></div>
                    <div>High Probability: <strong style={{ color: theme.colors.risk.high.text }}>{(result.simulated_prediction.drought_probabilities.High * 100).toFixed(0)}%</strong></div>
                    <div>Drought Index: <strong style={{ color: theme.colors.ink, fontFamily: theme.typography.fontMono }}>{result.simulated_prediction.estimated_drought_index}</strong></div>
                  </div>
                </div>
              </div>

              {/* Simulated Feature Inputs Vector Overview */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: theme.colors.surfaceAlt,
                  border: `1px solid ${theme.colors.divider}`,
                  borderRadius: theme.radii.sm,
                  fontSize: '11px',
                  color: theme.colors.inkMuted,
                  lineHeight: 1.5,
                  fontFamily: theme.typography.fontMono,
                }}
              >
                <span style={{ fontWeight: 700, color: theme.colors.ink, display: 'block', marginBottom: '2px', fontFamily: theme.typography.fontSans }}>
                  Simulated Biophysical State Vector:
                </span>
                Rain: <strong style={{ color: theme.colors.ink }}>{result.simulated_inputs.rainfall_mm} mm</strong> | Temp: <strong style={{ color: theme.colors.ink }}>{result.simulated_inputs.temperature_c} °C</strong> | Humidity: <strong style={{ color: theme.colors.ink }}>{result.simulated_inputs.humidity_pct}%</strong> | Soil Moisture: <strong style={{ color: theme.colors.ink }}>{result.simulated_inputs.soil_moisture_pct}%</strong> | NDVI: <strong style={{ color: theme.colors.ink }}>{result.simulated_inputs.ndvi}</strong>
              </div>
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
              <SlidersHorizontal size={28} color={theme.colors.terracotta} style={{ marginBottom: '10px', opacity: 0.8 }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.ink }}>
                Awaiting Climate Shock Calibration
              </p>
              <p style={{ fontSize: '11.5px', color: theme.colors.inkMuted, maxWidth: '280px', marginTop: '4px' }}>
                Select a shock preset or calibrate anomaly sliders on the left and execute the simulation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
