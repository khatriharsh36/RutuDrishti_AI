import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  TableProperties,
  Filter,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Search,
  Check,
  Eye,
  X
} from 'lucide-react';
import { theme } from '../styles/theme';

export const DataExplorer: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(25);
  const [offset, setOffset] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [onlyCapped, setOnlyCapped] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    setLoading(true);
    api.getDatasetRecords(limit, offset, selectedRegion === 'All' ? undefined : selectedRegion)
      .then((res) => {
        let recs = res.records;
        if (onlyCapped) {
          recs = recs.filter((r: any) => r.Crop_Yield_ton_ha === 8.5);
        }
        setRecords(recs);
        setTotal(res.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [limit, offset, selectedRegion, onlyCapped]);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#222930',
          color: '#FFFFFF',
          borderRadius: theme.radii.lg,
          padding: '24px 28px',
          border: '1px solid #323B44',
          boxShadow: theme.shadows.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              backgroundColor: '#84917B',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: theme.typography.fontMono,
            }}
          >
            Module 08 • Empirical Inspection
          </span>
          <span style={{ fontSize: '11px', color: '#DCE5E2', fontFamily: theme.typography.fontMono }}>
            500 Verified District Observations • 2015–2025
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 6px', color: '#FFFFFF' }}>
          Empirical Dataset Explorer & Verification Suite
        </h2>
        <p style={{ fontSize: '13px', color: '#E4EDE9', lineHeight: 1.55, maxWidth: '820px' }}>
          Interactive tabular inspection, row-level parameter auditing, and spatial filtering of the 500 validated agro-climatic records spanning 2015–2025 across Pune, Solapur, Ahmednagar, Nashik, and Satara.
        </p>
      </div>

      {/* Filter, Search & Controls Bar */}
      <div
        className="rd-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color={theme.colors.terracotta} />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.colors.ink }}>
              District Filter:
            </span>
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setOffset(0);
            }}
            className="rd-select"
            style={{ width: 'auto', minWidth: '190px', padding: '6px 10px', fontSize: '12px' }}
          >
            <option value="All">All Districts (500 records)</option>
            <option value="Pune">Pune District (128 records)</option>
            <option value="Solapur">Solapur District (114 records)</option>
            <option value="Ahmednagar">Ahmednagar District (102 records)</option>
            <option value="Nashik">Nashik District (90 records)</option>
            <option value="Satara">Satara District (66 records)</option>
          </select>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: theme.colors.ink, fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={onlyCapped}
              onChange={(e) => setOnlyCapped(e.target.checked)}
              style={{ accentColor: theme.colors.terracotta }}
            />
            <span>Highlight 8.5 t/ha Cap Only</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: theme.colors.inkMuted, flexWrap: 'wrap' }}>
          <span>
            Showing <strong style={{ color: theme.colors.ink, fontFamily: theme.typography.fontMono }}>{offset + 1}–{Math.min(offset + limit, total)}</strong> of <strong style={{ color: theme.colors.ink, fontFamily: theme.typography.fontMono }}>{total}</strong> verified records
          </span>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="rd-btn-secondary"
              style={{ padding: '5px 10px', fontSize: '11.5px' }}
            >
              <ChevronLeft size={13} />
              <span>Prev</span>
            </button>
            <button
              disabled={offset + limit >= total}
              onClick={() => setOffset(offset + limit)}
              className="rd-btn-secondary"
              style={{ padding: '5px 10px', fontSize: '11.5px' }}
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table & Selected Record Inspector */}
      <div style={{ display: selectedRow ? 'grid' : 'block', gridTemplateColumns: selectedRow ? '1fr 320px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div className="rd-table-container">
          <table className="rd-table" style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>District</th>
                <th>Year</th>
                <th>Month</th>
                <th>Rain (mm)</th>
                <th>Temp (°C)</th>
                <th>Humidity (%)</th>
                <th>Soil (%)</th>
                <th>NDVI</th>
                <th>Drought Index</th>
                <th>Crop Yield</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const isCapped = r.Crop_Yield_ton_ha === 8.5;
                const isSelected = selectedRow === r;
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedRow(r)}
                    style={{
                      backgroundColor: isSelected ? '#FAF8F4' : (isCapped ? '#FCFBF8' : undefined),
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ color: theme.colors.inkLight, fontFamily: theme.typography.fontMono, fontSize: '11px' }}>
                      {offset + i + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: theme.colors.ink }}>
                      {r.Region}
                    </td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Year}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Month}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Rainfall_mm}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Temperature_C}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Humidity_pct}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.Soil_Moisture_pct}</td>
                    <td style={{ fontFamily: theme.typography.fontMono }}>{r.NDVI}</td>
                    <td
                      style={{
                        fontFamily: theme.typography.fontMono,
                        fontWeight: 600,
                        color: r.Drought_Index > 3.34 ? theme.colors.risk.high.text : theme.colors.ink,
                      }}
                    >
                      {r.Drought_Index}
                    </td>
                    <td
                      style={{
                        fontFamily: theme.typography.fontMono,
                        fontWeight: 700,
                        color: isCapped ? theme.colors.terracotta : theme.colors.ink,
                      }}
                    >
                      {r.Crop_Yield_ton_ha}{' '}
                      {isCapped && (
                        <span
                          style={{
                            fontSize: '9px',
                            padding: '1px 4px',
                            borderRadius: '2px',
                            backgroundColor: theme.colors.risk.moderate.bg,
                            color: theme.colors.risk.moderate.text,
                            border: `1px solid ${theme.colors.risk.moderate.border}`,
                            marginLeft: '4px',
                            fontFamily: theme.typography.fontMono,
                          }}
                        >
                          8.5 CAP
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRow(r);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: theme.colors.scientific,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Row Detail Inspector Drawer */}
        {selectedRow && (
          <div className="rd-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '90px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.colors.divider}`, paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', color: theme.colors.terracotta, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: theme.typography.fontMono }}>
                  Observation Telemetry
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: theme.colors.ink }}>
                  {selectedRow.Region} • {selectedRow.Month}/{selectedRow.Year}
                </h4>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                style={{ background: 'transparent', border: 'none', color: theme.colors.inkLight, cursor: 'pointer' }}
                title="Close Record Inspector"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Monthly Rainfall:</span>
                <strong style={{ fontFamily: theme.typography.fontMono }}>{selectedRow.Rainfall_mm} mm</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Ambient Temperature:</span>
                <strong style={{ fontFamily: theme.typography.fontMono }}>{selectedRow.Temperature_C} °C</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Relative Humidity:</span>
                <strong style={{ fontFamily: theme.typography.fontMono }}>{selectedRow.Humidity_pct}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Root Soil Moisture:</span>
                <strong style={{ fontFamily: theme.typography.fontMono, color: theme.colors.scientific }}>{selectedRow.Soil_Moisture_pct}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Vegetation NDVI:</span>
                <strong style={{ fontFamily: theme.typography.fontMono, color: theme.colors.sage }}>{selectedRow.NDVI}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DE', paddingBottom: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Drought Index:</span>
                <strong style={{ fontFamily: theme.typography.fontMono, color: selectedRow.Drought_Index > 3.34 ? theme.colors.risk.high.text : theme.colors.ink }}>
                  {selectedRow.Drought_Index}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                <span style={{ color: theme.colors.inkMuted }}>Crop Yield:</span>
                <strong style={{ fontFamily: theme.typography.fontMono, color: selectedRow.Crop_Yield_ton_ha === 8.5 ? theme.colors.terracotta : theme.colors.ink, fontWeight: 800 }}>
                  {selectedRow.Crop_Yield_ton_ha} t/ha
                </strong>
              </div>
            </div>

            {selectedRow.Crop_Yield_ton_ha === 8.5 && (
              <div style={{ padding: '8px 10px', backgroundColor: theme.colors.risk.moderate.bg, border: `1px solid ${theme.colors.risk.moderate.border}`, borderRadius: '4px', fontSize: '11px', color: theme.colors.risk.moderate.text }}>
                <strong>8.5 Cap Recorded:</strong> Demonstrates physiological saturation where further rainfall does not increase measurable yield.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dataset Verification Notice */}
      <div
        style={{
          fontSize: '11.5px',
          color: theme.colors.inkMuted,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radii.sm,
          border: `1px solid ${theme.colors.divider}`,
        }}
      >
        <AlertCircle size={15} color={theme.colors.terracotta} style={{ flexShrink: 0 }} />
        <span>
          Rows highlighted with the <strong style={{ color: theme.colors.terracotta }}>8.5 CAP</strong> badge indicate observations recorded at the 8.5 ton/ha measurement ceiling (153 records, exactly 30.6% of the 500 validated samples).
        </span>
      </div>
    </div>
  );
};
