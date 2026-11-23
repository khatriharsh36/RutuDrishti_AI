import React from 'react';
import { Database, ShieldCheck, Activity, Compass, Cpu, Layers } from 'lucide-react';
import { theme } from '../styles/theme';

interface HeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  badgeText = "Empirical Validation Active",
  activeTab
}) => {
  return (
    <header
      style={{
        padding: '16px 28px',
        borderBottom: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: theme.shadows.subtle,
      }}
    >
      <div style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: theme.colors.ink,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {title}
          </h1>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: theme.radii.pill,
              backgroundColor: theme.colors.risk.low.bg,
              color: theme.colors.risk.low.text,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: `1px solid ${theme.colors.risk.low.border}`,
              fontFamily: theme.typography.fontMono,
            }}
          >
            <ShieldCheck size={12} />
            {badgeText}
          </span>
        </div>
        <p
          style={{
            fontSize: '12px',
            color: theme.colors.inkMuted,
            marginTop: '3px',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Operational Telemetry Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '11px',
          color: theme.colors.ink,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: theme.colors.surfaceAlt,
            padding: '5px 9px',
            borderRadius: theme.radii.xs,
            border: `1px solid ${theme.colors.divider}`,
          }}
        >
          <Database size={12} color={theme.colors.terracotta} />
          <span style={{ fontWeight: 600, fontFamily: theme.typography.fontMono }}>
            N = 500 Observations
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: theme.colors.surfaceAlt,
            padding: '5px 9px',
            borderRadius: theme.radii.xs,
            border: `1px solid ${theme.colors.divider}`,
          }}
        >
          <Compass size={12} color={theme.colors.scientific} />
          <span style={{ fontWeight: 600 }}>
            5 Semi-Arid Districts
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: theme.colors.scientificSurface,
            padding: '5px 9px',
            borderRadius: theme.radii.xs,
            border: `1px solid ${theme.colors.scientificBorder}`,
          }}
        >
          <Cpu size={12} color={theme.colors.scientific} />
          <span style={{ fontWeight: 700, color: theme.colors.scientific }}>
            Dual RF / GBDT Pipelines
          </span>
        </div>
      </div>
    </header>
  );
};
