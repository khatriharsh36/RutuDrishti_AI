import React from 'react';
import {
  LayoutDashboard,
  CloudRain,
  SunMedium,
  Cpu,
  MapPin,
  HelpCircle,
  SlidersHorizontal,
  TableProperties,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Activity,
  LucideIcon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { theme } from '../styles/theme';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  num: string;
  icon: LucideIcon;
  tag?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const navSections: NavSection[] = [
    {
      title: 'Observation & Monitoring',
      items: [
        { id: 'overview', label: 'Executive Studio', num: '01', icon: LayoutDashboard },
        { id: 'climate', label: 'Climate Analytics', num: '02', icon: CloudRain },
        { id: 'drought', label: 'Drought Intelligence', num: '03', icon: SunMedium, tag: '33/66%' },
      ]
    },
    {
      title: 'Inference & Simulation',
      items: [
        { id: 'models', label: 'Predictive Laboratory', num: '04', icon: Cpu, tag: 'RF/GB' },
        { id: 'simulation', label: 'Scenario Simulation', num: '05', icon: SlidersHorizontal },
        { id: 'xai', label: 'Explainable AI (XAI)', num: '06', icon: HelpCircle },
      ]
    },
    {
      title: 'Vulnerability & Evidence',
      items: [
        { id: 'vulnerability', label: 'Regional RAVI Index', num: '07', icon: MapPin, tag: 'RAVI' },
        { id: 'data', label: 'Dataset Explorer', num: '08', icon: TableProperties, tag: 'N=500' },
        { id: 'methodology', label: 'Research & Ethics', num: '09', icon: BookOpen },
      ]
    }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '68px' : '272px',
        backgroundColor: '#252E37',
        color: '#F5F2EB',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1F2730',
        zIndex: 50,
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
      aria-label="Application Navigation"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '18px 12px' : '20px 18px',
          borderBottom: '1px solid #2E3944',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '8px',
          minHeight: '68px',
        }}
      >
        {!collapsed ? (
          <BrandLogo size={32} variant="horizontal" light={true} />
        ) : (
          <div title="RutuDrishti AI">
            <BrandLogo size={28} variant="mark" light={true} />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(245, 242, 235, 0.06)',
            border: '1px solid rgba(245, 242, 235, 0.12)',
            borderRadius: theme.radii.sm,
            color: '#84917B',
            padding: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title={collapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
          aria-label={collapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Grouped Navigation Links */}
      <nav
        style={{
          flex: 1,
          padding: '14px 10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {navSections.map((section, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {!collapsed && (
              <div
                style={{
                  padding: '4px 10px 6px',
                  fontSize: '10px',
                  fontFamily: theme.typography.fontMono,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#8A95A1',
                  fontWeight: 600,
                }}
              >
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: collapsed ? '10px 0' : '8px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: theme.radii.sm,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#174F5B' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#CBD4DC',
                    borderLeft: isActive ? `3px solid ${theme.colors.terracotta}` : '3px solid transparent',
                    transition: 'all 0.12s ease',
                    position: 'relative',
                    textAlign: 'left',
                  }}
                  title={collapsed ? `${item.num} ${item.label}` : undefined}
                >
                  <Icon
                    size={16}
                    style={{
                      color: isActive ? '#FFFFFF' : '#84917B',
                      flexShrink: 0,
                    }}
                  />

                  {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: theme.typography.fontMono,
                            color: isActive ? '#C16B4C' : '#6A7885',
                            letterSpacing: '0.04em',
                            fontWeight: 600,
                          }}
                        >
                          {item.num}
                        </span>
                        <span
                          style={{
                            fontSize: '12.5px',
                            letterSpacing: '-0.01em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </span>
                      </div>

                      {item.tag && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontFamily: theme.typography.fontMono,
                            padding: '1px 5px',
                            borderRadius: '2px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? '#FFFFFF' : '#8A95A1',
                            fontWeight: 600,
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Meta & Telemetry Anchor */}
      {!collapsed ? (
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid #2E3944',
            backgroundColor: '#1E252D',
            fontSize: '11px',
            color: '#8A95A1',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: '#F5F2EB', letterSpacing: '0.02em', fontSize: '11px' }}>
              Maharashtra Pilot
            </span>
            <span
              style={{
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '3px',
                backgroundColor: 'rgba(193, 107, 76, 0.22)',
                color: '#DE8E72',
                fontWeight: 700,
                fontFamily: theme.typography.fontMono,
              }}
            >
              2015–2025
            </span>
          </div>
          <p style={{ fontSize: '10.5px', color: '#7E8B97', margin: '2px 0 8px', lineHeight: 1.35 }}>
            5 Monitored Semi-Arid Districts (N = 500)
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 8px',
              borderRadius: theme.radii.xs,
              backgroundColor: 'rgba(23, 79, 91, 0.35)',
              border: '1px solid rgba(23, 79, 91, 0.5)',
            }}
          >
            <Activity size={12} color="#95CAD4" />
            <span style={{ fontSize: '10px', color: '#D4E8EC', fontWeight: 600 }}>
              Leakage-Free ML Verified
            </span>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', borderTop: '1px solid #2E3944' }} title="Maharashtra Pilot • ML Pipeline Verified">
          <Activity size={16} color="#84917B" />
        </div>
      )}
    </aside>
  );
};
