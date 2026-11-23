import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { ClimateAnalytics } from './pages/ClimateAnalytics';
import { DroughtIntelligence } from './pages/DroughtIntelligence';
import { PredictiveLab } from './pages/PredictiveLab';
import { RegionalVulnerability } from './pages/RegionalVulnerability';
import { ExplainableAI } from './pages/ExplainableAI';
import { ScenarioSimulation } from './pages/ScenarioSimulation';
import { DataExplorer } from './pages/DataExplorer';
import { ResearchMethodology } from './pages/ResearchMethodology';
import { theme } from './styles/theme';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Executive Climate Intelligence Studio',
          subtitle: 'Multi-scale agro-climatic assessment, algorithmic baseline advancements & district vulnerability across Maharashtra (2015–2025)'
        };
      case 'climate':
        return {
          title: 'Agro-Climatic Indicators & Statistical Diagnostics',
          subtitle: 'Precipitation regimes, soil moisture dynamics, NDVI canopy vigor & multicollinearity analysis'
        };
      case 'drought':
        return {
          title: 'Drought Severity & Spatial Recurrence Intelligence',
          subtitle: 'Empirical percentile classification, recurrence frequency & historical drought progression'
        };
      case 'models':
        return {
          title: 'Predictive Laboratory & Multi-Target Evaluation',
          subtitle: 'Comparative regression, leakage-free drought classification & live multi-factor inference engine'
        };
      case 'vulnerability':
        return {
          title: 'Regional Agricultural Vulnerability Index (RAVI)',
          subtitle: 'Signature multi-criteria agricultural risk ranking and spatial decision intelligence'
        };
      case 'xai':
        return {
          title: 'Explainable AI (XAI) & Interpretability Suite',
          subtitle: 'Gini feature importance, permutation testing, extracted tree decision rules & parametric sensitivities'
        };
      case 'simulation':
        return {
          title: 'Counterfactual Climate Shock Scenario Laboratory',
          subtitle: 'What-if climate shock stress-testing and compound anomaly evaluation for agricultural foresight'
        };
      case 'data':
        return {
          title: 'Empirical Dataset Explorer & Verification',
          subtitle: 'Granular inspection and filtering of 500 validated agro-climatic district records (2015–2025)'
        };
      case 'methodology':
        return {
          title: 'Research Methodology, Academic Ethics & Rubric',
          subtitle: 'Scientific framework, boundary hypotheses, data limitations, and academic rubric compliance'
        };
      default:
        return {
          title: 'RutuDrishti AI',
          subtitle: 'Climate Intelligence Studio — Explainable Climate Risk Intelligence'
        };
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        color: theme.colors.ink,
      }}
    >
      {/* Grouped Scientific Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Analytical Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
          activeTab={activeTab}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'overview' && <ExecutiveOverview onNavigate={setActiveTab} />}
          {activeTab === 'climate' && <ClimateAnalytics />}
          {activeTab === 'drought' && <DroughtIntelligence />}
          {activeTab === 'models' && <PredictiveLab />}
          {activeTab === 'vulnerability' && <RegionalVulnerability />}
          {activeTab === 'xai' && <ExplainableAI />}
          {activeTab === 'simulation' && <ScenarioSimulation />}
          {activeTab === 'data' && <DataExplorer />}
          {activeTab === 'methodology' && <ResearchMethodology />}
        </main>
      </div>
    </div>
  );
};

export default App;
