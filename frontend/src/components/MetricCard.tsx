import React from 'react';
import { LucideIcon } from 'lucide-react';
import { theme } from '../styles/theme';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeType?: 'primary' | 'warning' | 'alert' | 'sage' | 'copper' | 'teal';
  tooltip?: string;
  accentBorder?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  badge,
  badgeType = 'primary',
  tooltip,
  accentBorder = false
}) => {
  const getBadgeStyles = () => {
    switch (badgeType) {
      case 'warning':
        return {
          bg: theme.colors.risk.moderate.bg,
          text: theme.colors.risk.moderate.text,
          border: theme.colors.risk.moderate.border
        };
      case 'alert':
        return {
          bg: theme.colors.risk.severe.bg,
          text: theme.colors.risk.severe.text,
          border: theme.colors.risk.severe.border
        };
      case 'sage':
        return {
          bg: theme.colors.risk.low.bg,
          text: theme.colors.risk.low.text,
          border: theme.colors.risk.low.border
        };
      case 'copper':
        return {
          bg: theme.colors.risk.high.bg,
          text: theme.colors.risk.high.text,
          border: theme.colors.risk.high.border
        };
      case 'teal':
        return {
          bg: theme.colors.scientificSurface,
          text: theme.colors.scientific,
          border: theme.colors.scientificBorder
        };
      default:
        return {
          bg: '#F3F6F8',
          text: theme.colors.ink,
          border: theme.colors.divider
        };
    }
  };

  const badgeStyles = getBadgeStyles();

  return (
    <div
      className="rd-card"
      style={{
        padding: '16px 18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: accentBorder ? `3px solid ${theme.colors.terracotta}` : undefined,
      }}
      title={tooltip}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: theme.colors.inkMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: theme.typography.fontSans,
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              padding: '5px',
              backgroundColor: theme.colors.surfaceAlt,
              borderRadius: theme.radii.sm,
              border: `1px solid ${theme.colors.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={14} color={theme.colors.scientific} />
          </div>
        )}
      </div>

      <div style={{ margin: '4px 0' }}>
        <div
          style={{
            fontSize: typeof value === 'number' || (typeof value === 'string' && value.match(/\d/)) ? '22px' : '17px',
            fontWeight: 700,
            color: theme.colors.ink,
            fontFamily: typeof value === 'number' || (typeof value === 'string' && value.match(/^\d+(\.\d+)?/))
              ? theme.typography.fontMono
              : theme.typography.fontSans,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', minHeight: '18px' }}>
        {subValue && (
          <span
            style={{
              fontSize: '11px',
              color: theme.colors.inkLight,
              fontFamily: theme.typography.fontSans,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: badge ? '60%' : '100%',
            }}
            title={subValue}
          >
            {subValue}
          </span>
        )}
        {badge && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: theme.radii.xs,
              backgroundColor: badgeStyles.bg,
              color: badgeStyles.text,
              border: `1px solid ${badgeStyles.border}`,
              letterSpacing: '0.03em',
              fontFamily: theme.typography.fontMono,
              marginLeft: 'auto',
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
