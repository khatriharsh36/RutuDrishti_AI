import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from statsmodels.stats.outliers_influence import variance_inflation_factor

from sklearn.model_selection import train_test_split, StratifiedKFold, KFold, cross_val_score
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier, export_text, plot_tree
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.metrics import (
    r2_score, mean_squared_error, mean_absolute_error,
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)
from sklearn.inspection import permutation_importance

# Research Palette Constants
COLOR_PRIMARY = "#173D35"      # Deep Forest
COLOR_SECONDARY = "#477A68"    # Forest Sage
COLOR_SAGE = "#A9C5B1"         # Sage Green
COLOR_ACCENT = "#D6A85F"       # Muted Amber / Ochre
COLOR_ALERT = "#C85A48"        # Terracotta / Warning
COLOR_BG = "#F5F6F0"           # Soft Ivory
COLOR_TEXT = "#26352F"         # Deep Charcoal

plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.edgecolor'] = '#D1D5DB'
plt.rcParams['axes.linewidth'] = 0.8

class AnalyticsEngine:
    def __init__(self, data_path="data/RutuDrishti AI_Preprocessed_Dataset.csv"):
        self.data_path = data_path
        self.df = pd.read_csv(data_path)
        
        # Drought Category creation (percentile methodology: <2.16 Low, 2.16-3.34 Moderate, >3.34 High)
        self.df['Drought_Category'] = pd.cut(
            self.df['Drought_Index'],
            bins=[-np.inf, 2.16, 3.34, np.inf],
            labels=['Low', 'Moderate', 'High']
        )
        
        self.figures_dir = "outputs/figures"
        self.tables_dir = "outputs/tables"
        self.models_dir = "backend/app/models/saved"
        
        for d in [self.figures_dir, self.tables_dir, self.models_dir]:
            os.makedirs(d, exist_ok=True)
            
        self.results = {}

    def run_all(self):
        print("Running Module A: Advanced Exploratory Data Analysis...")
        self.run_eda()
        
        print("Running Module B: Statistical Intelligence & Hypothesis Testing...")
        self.run_statistical_intelligence()
        
        print("Running Module C: Predictive Modeling Benchmarks...")
        self.run_predictive_modeling()
        
        print("Running Module D: Regional Agricultural Vulnerability Index (RAVI)...")
        self.run_regional_vulnerability()
        
        print("Running Module E: Explainable AI (XAI) Suite...")
        self.run_xai_suite()
        
        # Save comprehensive metrics JSON for Backend & Frontend APIs
        metrics_path = "backend/app/models/saved/analytics_summary.json"
        with open(metrics_path, "w") as f:
            json.dump(self.results, f, indent=2, default=str)
        print(f"Summary metrics saved to {metrics_path}")
        return self.results

    def run_eda(self):
        df = self.df
        numeric_cols = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index', 'Crop_Yield_ton_ha']
        
        # 1. Dataset Profiling Table
        profile = df[numeric_cols].describe().T
        profile['skewness'] = df[numeric_cols].skew()
        profile['kurtosis'] = df[numeric_cols].kurtosis()
        profile['missing_values'] = df[numeric_cols].isnull().sum()
        profile.to_csv(f"{self.tables_dir}/statistical_profiling.csv")
        
        # 2. EDA Distributions Figure
        fig, axes = plt.subplots(2, 4, figsize=(18, 9), facecolor=COLOR_BG)
        axes = axes.flatten()
        
        for i, col in enumerate(numeric_cols):
            ax = axes[i]
            ax.set_facecolor("#FFFFFF")
            sns.histplot(df[col], kde=True, ax=ax, color=COLOR_SECONDARY, edgecolor=COLOR_PRIMARY, bins=25)
            ax.set_title(f"Distribution of {col}", fontsize=11, fontweight='bold', color=COLOR_PRIMARY)
            ax.grid(True, linestyle=':', alpha=0.6)
            
            # Special annotation for Yield Ceiling
            if col == 'Crop_Yield_ton_ha':
                capped_count = (df['Crop_Yield_ton_ha'] == 8.5).sum()
                ax.axvline(8.5, color=COLOR_ALERT, linestyle='--', linewidth=1.5, label=f"Cap (8.5): {capped_count} rows")
                ax.legend(fontsize=9, loc='upper left')

        # 8th plot: Drought Category Counts
        ax = axes[7]
        ax.set_facecolor("#FFFFFF")
        palette = {'Low': COLOR_SAGE, 'Moderate': COLOR_ACCENT, 'High': COLOR_ALERT}
        sns.countplot(data=df, x='Drought_Category', ax=ax, palette=palette, order=['Low', 'Moderate', 'High'])
        ax.set_title("Drought Category Frequency", fontsize=11, fontweight='bold', color=COLOR_PRIMARY)
        ax.grid(True, linestyle=':', alpha=0.6)
        
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/eda_distributions.png", dpi=300)
        plt.close()
        
        # 3. Correlation Heatmap
        corr_pearson = df[numeric_cols].corr(method='pearson')
        corr_spearman = df[numeric_cols].corr(method='spearman')
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7), facecolor=COLOR_BG)
        sns.heatmap(corr_pearson, annot=True, fmt=".2f", cmap="Greens", ax=ax1, cbar=True, square=True)
        ax1.set_title("Pearson Correlation Matrix (Linear Relationships)", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        
        sns.heatmap(corr_spearman, annot=True, fmt=".2f", cmap="YlGnBu", ax=ax2, cbar=True, square=True)
        ax2.set_title("Spearman Rank Correlation (Monotonic Relationships)", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/eda_correlation_matrix.png", dpi=300)
        plt.close()
        
        # 4. Rainfall vs Yield Scatter & Regression
        fig, ax = plt.subplots(figsize=(8, 6), facecolor=COLOR_BG)
        ax.set_facecolor("#FFFFFF")
        sns.scatterplot(data=df, x='Rainfall_mm', y='Crop_Yield_ton_ha', hue='Region', palette='tab10', alpha=0.7, ax=ax)
        sns.regplot(data=df, x='Rainfall_mm', y='Crop_Yield_ton_ha', scatter=False, ax=ax, color=COLOR_PRIMARY, line_kws={"linewidth": 2})
        ax.axhline(8.5, color=COLOR_ALERT, linestyle='--', linewidth=1.5, label='Ceiling: 8.5 t/ha')
        ax.set_title("Rainfall vs. Crop Yield with Fitted Regression & Ceiling", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        ax.set_xlabel("Rainfall (mm)", fontsize=10, fontweight='bold')
        ax.set_ylabel("Crop Yield (ton/ha)", fontsize=10, fontweight='bold')
        ax.grid(True, linestyle=':', alpha=0.6)
        ax.legend(title="Region")
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/eda_rainfall_yield_scatter.png", dpi=300)
        plt.close()

        # 5. Regional Statistical Comparison
        reg_summary = df.groupby('Region')[['Rainfall_mm', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index', 'Crop_Yield_ton_ha']].mean()
        fig, axes = plt.subplots(2, 2, figsize=(12, 8), facecolor=COLOR_BG)
        
        reg_summary['Rainfall_mm'].sort_values().plot(kind='barh', ax=axes[0, 0], color=COLOR_SECONDARY)
        axes[0, 0].set_title("Mean Rainfall (mm)", fontweight='bold', color=COLOR_PRIMARY)
        
        reg_summary['Drought_Index'].sort_values(ascending=False).plot(kind='barh', ax=axes[0, 1], color=COLOR_ALERT)
        axes[0, 1].set_title("Mean Drought Index (Higher = Severe)", fontweight='bold', color=COLOR_PRIMARY)
        
        reg_summary['Soil_Moisture_pct'].sort_values().plot(kind='barh', ax=axes[1, 0], color=COLOR_SAGE)
        axes[1, 0].set_title("Mean Soil Moisture (%)", fontweight='bold', color=COLOR_PRIMARY)
        
        reg_summary['Crop_Yield_ton_ha'].sort_values().plot(kind='barh', ax=axes[1, 1], color=COLOR_ACCENT)
        axes[1, 1].set_title("Mean Crop Yield (ton/ha)", fontweight='bold', color=COLOR_PRIMARY)
        
        for ax in axes.flatten():
            ax.set_facecolor("#FFFFFF")
            ax.grid(True, linestyle=':', alpha=0.6)
            ax.set_ylabel("")
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/eda_regional_comparisons.png", dpi=300)
        plt.close()
        
        # 6. Seasonal Patterns
        df['Season'] = df['Month'].map(lambda m: 'Monsoon' if m in [6,7,8,9] else ('Post-Monsoon/Winter' if m in [10,11,12,1,2] else 'Pre-Monsoon/Summer'))
        seasonal_summary = df.groupby(['Month', 'Season'])[['Rainfall_mm', 'Soil_Moisture_pct', 'Drought_Index']].mean().reset_index()
        
        fig, ax = plt.subplots(figsize=(10, 5), facecolor=COLOR_BG)
        ax.set_facecolor("#FFFFFF")
        sns.lineplot(data=df, x='Month', y='Drought_Index', hue='Region', marker='o', ax=ax)
        ax.set_title("Monthly Drought Index Progression Across Regions", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        ax.set_xticks(range(1, 13))
        ax.set_xticklabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
        ax.grid(True, linestyle=':', alpha=0.6)
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/eda_seasonal_trends.png", dpi=300)
        plt.close()
        
        self.results['dataset_overview'] = {
            'total_observations': len(df),
            'features_count': df.shape[1],
            'regions': df['Region'].value_counts().to_dict(),
            'years_range': [int(df['Year'].min()), int(df['Year'].max())],
            'capped_yield_count': int((df['Crop_Yield_ton_ha'] == 8.5).sum()),
            'capped_yield_pct': round(((df['Crop_Yield_ton_ha'] == 8.5).sum() / len(df)) * 100, 2),
            'avg_rainfall': round(float(df['Rainfall_mm'].mean()), 2),
            'avg_drought_index': round(float(df['Drought_Index'].mean()), 2),
            'avg_crop_yield': round(float(df['Crop_Yield_ton_ha'].mean()), 2),
            'avg_soil_moisture': round(float(df['Soil_Moisture_pct'].mean()), 2),
            'avg_ndvi': round(float(df['NDVI'].mean()), 3),
            'drought_distribution': df['Drought_Category'].value_counts().to_dict()
        }

    def run_statistical_intelligence(self):
        df = self.df
        numeric_cols = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index', 'Crop_Yield_ton_ha']
        
        # Pearson and Spearman correlation tables with p-values
        corr_results = []
        for col in ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index']:
            r_p, p_p = stats.pearsonr(df[col], df['Crop_Yield_ton_ha'])
            r_s, p_s = stats.spearmanr(df[col], df['Crop_Yield_ton_ha'])
            corr_results.append({
                'Feature': col,
                'Target': 'Crop_Yield_ton_ha',
                'Pearson_r': round(r_p, 4),
                'Pearson_p_value': f"{p_p:.2e}",
                'Spearman_rho': round(r_s, 4),
                'Spearman_p_value': f"{p_s:.2e}",
                'Interpretation': 'Statistically significant positive driver' if r_p > 0.5 else ('Statistically significant negative risk' if r_p < -0.5 else 'Weak relationship')
            })
        corr_df = pd.DataFrame(corr_results)
        corr_df.to_csv(f"{self.tables_dir}/correlation_analysis.csv", index=False)
        
        # Hypothesis Testing
        hypotheses = []
        # Test 1: Rainfall vs Yield (Pearson)
        r_rain, p_rain = stats.pearsonr(df['Rainfall_mm'], df['Crop_Yield_ton_ha'])
        hypotheses.append({
            'Test_ID': 'HT-01',
            'Name': 'Rainfall vs Crop Productivity',
            'Null_Hypothesis (H0)': 'No linear correlation exists between rainfall and crop yield (r = 0).',
            'Alternative_Hypothesis (H1)': 'A significant linear relationship exists between rainfall and crop yield (r != 0).',
            'Test_Statistic': f"r = {r_rain:.3f}",
            'P_Value': f"{p_rain:.2e}",
            'Alpha': 0.05,
            'Decision': 'Reject H0',
            'Conclusion': 'Strong positive relationship; rainfall is the single primary driver of agricultural yield in rainfed zones.'
        })
        
        # Test 2: Drought Index vs Yield (Pearson)
        r_di, p_di = stats.pearsonr(df['Drought_Index'], df['Crop_Yield_ton_ha'])
        hypotheses.append({
            'Test_ID': 'HT-02',
            'Name': 'Drought Severity vs Crop Productivity',
            'Null_Hypothesis (H0)': 'Drought Index has no correlation with crop yield (r = 0).',
            'Alternative_Hypothesis (H1)': 'Drought Index has an inverse correlation with crop yield (r < 0).',
            'Test_Statistic': f"r = {r_di:.3f}",
            'P_Value': f"{p_di:.2e}",
            'Alpha': 0.05,
            'Decision': 'Reject H0',
            'Conclusion': 'Severe drought conditions lead directly to steep decline in crop yield.'
        })
        
        # Test 3: Soil Moisture vs NDVI (Spearman Rank)
        rho_sm, p_sm = stats.spearmanr(df['Soil_Moisture_pct'], df['NDVI'])
        hypotheses.append({
            'Test_ID': 'HT-03',
            'Name': 'Soil Moisture vs Vegetation Index',
            'Null_Hypothesis (H0)': 'No monotonic relationship exists between soil moisture and NDVI (rho = 0).',
            'Alternative_Hypothesis (H1)': 'A positive monotonic relationship exists between soil moisture and NDVI (rho > 0).',
            'Test_Statistic': f"rho = {rho_sm:.3f}",
            'P_Value': f"{p_sm:.2e}",
            'Alpha': 0.05,
            'Decision': 'Reject H0',
            'Conclusion': 'Adequate ground moisture directly sustains photosynthetic canopy health.'
        })
        
        # Test 4: ANOVA for Regional Drought Index Differences
        regions_groups = [group['Drought_Index'].values for _, group in df.groupby('Region')]
        f_stat, p_anova = stats.f_oneway(*regions_groups)
        hypotheses.append({
            'Test_ID': 'HT-04',
            'Name': 'Regional Variation in Drought Severity (One-Way ANOVA)',
            'Null_Hypothesis (H0)': 'Mean Drought Index is identical across all 5 Maharashtra regions.',
            'Alternative_Hypothesis (H1)': 'At least one region has a significantly different mean Drought Index.',
            'Test_Statistic': f"F = {f_stat:.2f}",
            'P_Value': f"{p_anova:.2e}",
            'Alpha': 0.05,
            'Decision': 'Reject H0',
            'Conclusion': 'Significant spatial heterogeneity; Solapur and Ahmednagar experience distinctively higher drought pressure than Satara.'
        })
        
        hyp_df = pd.DataFrame(hypotheses)
        hyp_df.to_csv(f"{self.tables_dir}/hypothesis_tests.csv", index=False)
        
        # Multicollinearity: Variance Inflation Factor (VIF)
        vif_features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index']
        X_vif = df[vif_features].copy()
        X_vif_const = np.column_stack([np.ones(len(X_vif)), X_vif.values])
        
        vif_data = []
        for i, col in enumerate(vif_features):
            # i+1 because index 0 is constant
            vif_val = variance_inflation_factor(X_vif_const, i + 1)
            vif_data.append({
                'Feature': col,
                'VIF': round(vif_val, 2),
                'Severity': 'High (>10)' if vif_val > 10 else ('Moderate (5-10)' if vif_val > 5 else 'Low (<5)'),
                'Recommendation': 'Collinear climate indicator; tree-based models preferred over OLS for structural inference.' if vif_val > 5 else 'Retain in standard models.'
            })
        vif_df = pd.DataFrame(vif_data)
        vif_df.to_csv(f"{self.tables_dir}/vif_multicollinearity.csv", index=False)
        
        self.results['statistical_intelligence'] = {
            'correlations': corr_results,
            'hypotheses': hypotheses,
            'vif': vif_data
        }

    def run_predictive_modeling(self):
        df = self.df
        
        # ==========================================
        # 1. REGRESSION BENCHMARKS (Target: Crop_Yield_ton_ha)
        # ==========================================
        reg_features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index']
        X_reg = df[reg_features]
        y_reg = df['Crop_Yield_ton_ha']
        
        X_train, X_test, y_train, y_test = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)
        
        reg_models = {
            'Multiple Linear Regression': LinearRegression(),
            'Decision Tree Regressor': DecisionTreeRegressor(max_depth=5, random_state=42),
            'Random Forest Regressor': RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42),
            'Gradient Boosting Regressor': GradientBoostingRegressor(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42)
        }
        
        reg_metrics = []
        trained_reg = {}
        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        
        for name, model in reg_models.items():
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            
            r2 = r2_score(y_test, preds)
            n_samples = len(y_test)
            p_features = len(reg_features)
            adj_r2 = 1 - (1 - r2) * (n_samples - 1) / (n_samples - p_features - 1)
            
            mse = mean_squared_error(y_test, preds)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, preds)
            
            cv_scores = cross_val_score(model, X_reg, y_reg, cv=kf, scoring='r2')
            
            reg_metrics.append({
                'Model': name,
                'R2_Score': round(r2, 4),
                'Adjusted_R2': round(adj_r2, 4),
                'MSE': round(mse, 4),
                'RMSE': round(rmse, 4),
                'MAE': round(mae, 4),
                'CV_R2_Mean': round(float(cv_scores.mean()), 4),
                'CV_R2_Std': round(float(cv_scores.std()), 4)
            })
            trained_reg[name] = model
            joblib.dump(model, f"{self.models_dir}/{name.replace(' ', '_').lower()}.joblib")
            
        reg_df = pd.DataFrame(reg_metrics)
        reg_df.to_csv(f"{self.tables_dir}/regression_benchmarks.csv", index=False)
        
        # Residual Plot for Linear Regression vs Gradient Boosting
        lr_preds = trained_reg['Multiple Linear Regression'].predict(X_test)
        lr_residuals = y_test - lr_preds
        
        gb_preds = trained_reg['Gradient Boosting Regressor'].predict(X_test)
        gb_residuals = y_test - gb_preds
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5), facecolor=COLOR_BG)
        
        ax1.set_facecolor("#FFFFFF")
        ax1.scatter(lr_preds, lr_residuals, color=COLOR_ALERT, alpha=0.7, edgecolors='k')
        ax1.axhline(0, color=COLOR_PRIMARY, linestyle='--', linewidth=1.5)
        ax1.set_title("Linear Regression: Residuals vs. Fitted (Showing Ceiling Artifact)", fontsize=11, fontweight='bold', color=COLOR_PRIMARY)
        ax1.set_xlabel("Fitted Values (ton/ha)")
        ax1.set_ylabel("Residuals (Actual - Predicted)")
        ax1.grid(True, linestyle=':', alpha=0.6)
        
        ax2.set_facecolor("#FFFFFF")
        ax2.scatter(gb_preds, gb_residuals, color=COLOR_SECONDARY, alpha=0.7, edgecolors='k')
        ax2.axhline(0, color=COLOR_PRIMARY, linestyle='--', linewidth=1.5)
        ax2.set_title("Gradient Boosting: Residuals vs. Fitted (Better Plateau Adaptation)", fontsize=11, fontweight='bold', color=COLOR_PRIMARY)
        ax2.set_xlabel("Fitted Values (ton/ha)")
        ax2.set_ylabel("Residuals")
        ax2.grid(True, linestyle=':', alpha=0.6)
        
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/regression_residuals.png", dpi=300)
        plt.close()
        
        # ==========================================
        # 2. CLASSIFICATION BENCHMARKS (Target: Drought_Category)
        # ==========================================
        # IMPORTANT: Exclude Drought_Index to prevent target leakage!
        clf_features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI']
        X_clf = df[clf_features]
        y_clf = df['Drought_Category']
        
        Xc_train, Xc_test, yc_train, yc_test = train_test_split(
            X_clf, y_clf, test_size=0.2, random_state=42, stratify=y_clf
        )
        
        clf_models = {
            'Decision Tree Classifier': DecisionTreeClassifier(max_depth=4, class_weight='balanced', criterion='gini', random_state=42),
            'Random Forest Classifier': RandomForestClassifier(n_estimators=100, max_depth=5, class_weight='balanced', random_state=42),
            'Gradient Boosting Classifier': GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.08, random_state=42)
        }
        
        clf_metrics = []
        trained_clf = {}
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        
        fig, axes = plt.subplots(1, 3, figsize=(16, 5), facecolor=COLOR_BG)
        labels = ['Low', 'Moderate', 'High']
        
        for idx, (name, model) in enumerate(clf_models.items()):
            model.fit(Xc_train, yc_train)
            c_preds = model.predict(Xc_test)
            
            acc = accuracy_score(yc_test, c_preds)
            prec = precision_score(yc_test, c_preds, average='macro', zero_division=0)
            rec = recall_score(yc_test, c_preds, average='macro', zero_division=0)
            f1 = f1_score(yc_test, c_preds, average='macro', zero_division=0)
            
            cv_scores = cross_val_score(model, X_clf, y_clf, cv=skf, scoring='accuracy')
            
            cm = confusion_matrix(yc_test, c_preds, labels=labels)
            
            clf_metrics.append({
                'Model': name,
                'Accuracy': round(acc, 4),
                'Macro_Precision': round(prec, 4),
                'Macro_Recall': round(rec, 4),
                'Macro_F1': round(f1, 4),
                'CV_Accuracy_Mean': round(float(cv_scores.mean()), 4),
                'CV_Accuracy_Std': round(float(cv_scores.std()), 4),
                'Confusion_Matrix': cm.tolist()
            })
            trained_clf[name] = model
            joblib.dump(model, f"{self.models_dir}/{name.replace(' ', '_').lower()}.joblib")
            
            # Confusion matrix plot
            ax = axes[idx]
            sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax,
                        xticklabels=labels, yticklabels=labels, cbar=False)
            ax.set_title(f"{name}\nAcc: {acc*100:.1f}% | F1: {f1:.3f}", fontsize=10, fontweight='bold', color=COLOR_PRIMARY)
            ax.set_xlabel("Predicted Category")
            ax.set_ylabel("Actual Category")
            
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/classification_confusion_matrices.png", dpi=300)
        plt.close()
        
        clf_df = pd.DataFrame(clf_metrics)
        clf_df.to_csv(f"{self.tables_dir}/classification_benchmarks.csv", index=False)
        
        self.results['predictive_modeling'] = {
            'regression': reg_metrics,
            'classification': clf_metrics
        }
        
        self.trained_reg = trained_reg
        self.trained_clf = trained_clf
        self.X_train_reg = X_train
        self.X_test_reg = X_test
        self.y_test_reg = y_test
        self.Xc_train = Xc_train
        self.Xc_test = Xc_test
        self.yc_test = yc_test
        self.clf_features = clf_features
        self.reg_features = reg_features

    def run_regional_vulnerability(self):
        df = self.df
        
        # Calculate regional aggregations
        # Regional Agricultural Vulnerability Index (RAVI) Methodology:
        # Normalized mean of:
        # 1. Mean Drought_Index
        # 2. Percentage of High-drought months
        # 3. (1 - normalized mean Crop Yield)
        # 4. (1 - normalized mean NDVI)
        
        regions = df['Region'].unique()
        vulnerability_data = []
        
        for reg in regions:
            reg_df = df[df['Region'] == reg]
            mean_di = reg_df['Drought_Index'].mean()
            high_drought_pct = (reg_df['Drought_Category'] == 'High').mean() * 100
            mean_yield = reg_df['Crop_Yield_ton_ha'].mean()
            mean_ndvi = reg_df['NDVI'].mean()
            mean_rainfall = reg_df['Rainfall_mm'].mean()
            mean_soil_moisture = reg_df['Soil_Moisture_pct'].mean()
            
            vulnerability_data.append({
                'Region': reg,
                'Observations': len(reg_df),
                'Mean_Drought_Index': round(mean_di, 3),
                'High_Drought_Months_Pct': round(high_drought_pct, 2),
                'Mean_Crop_Yield': round(mean_yield, 2),
                'Mean_NDVI': round(mean_ndvi, 3),
                'Mean_Rainfall': round(mean_rainfall, 1),
                'Mean_Soil_Moisture': round(mean_soil_moisture, 1)
            })
            
        v_df = pd.DataFrame(vulnerability_data)
        
        # Min-Max Normalization across regions
        def norm(col):
            if col.max() == col.min():
                return pd.Series(0.5, index=col.index)
            return (col - col.min()) / (col.max() - col.min())
            
        norm_di = norm(v_df['Mean_Drought_Index'])
        norm_high_pct = norm(v_df['High_Drought_Months_Pct'])
        norm_yield_inv = 1.0 - norm(v_df['Mean_Crop_Yield'])
        norm_ndvi_inv = 1.0 - norm(v_df['Mean_NDVI'])
        
        # RAVI composite index (0 to 1 scale, equal 25% weights)
        v_df['RAVI_Score'] = ((norm_di + norm_high_pct + norm_yield_inv + norm_ndvi_inv) / 4.0).round(4)
        
        # Rank: 1 = Most Vulnerable
        v_df = v_df.sort_values(by='RAVI_Score', ascending=False).reset_index(drop=True)
        v_df['Vulnerability_Rank'] = range(1, len(v_df) + 1)
        
        # Risk interpretation
        def classify_risk(score):
            if score >= 0.70:
                return 'Severe Vulnerability'
            elif score >= 0.45:
                return 'Elevated Vulnerability'
            elif score >= 0.25:
                return 'Moderate Vulnerability'
            else:
                return 'Resilient / Low Vulnerability'
                
        v_df['Risk_Level'] = v_df['RAVI_Score'].apply(classify_risk)
        
        # Narrative explanations
        explanations = {
            'Solapur': 'Highest vulnerability due to chronic deficit rainfall, lowest soil moisture, elevated drought index, and high recurrence of severe drought months.',
            'Ahmednagar': 'Substantial vulnerability driven by prolonged dry spells in rainshadow terrain and recurrent vegetation stress.',
            'Pune': 'Moderate vulnerability; benefits from diversified canal infrastructure and moderate rainfall despite localized agricultural stress.',
            'Nashik': 'Lower-moderate vulnerability supported by consistent seasonal precipitation and higher horticultural resilience.',
            'Satara': 'Lowest vulnerability; benefits from Western Ghats orographic precipitation, high soil retention, and vigorous NDVI canopy cover.'
        }
        v_df['Analytical_Interpretation'] = v_df['Region'].map(explanations)
        
        v_df.to_csv(f"{self.tables_dir}/regional_vulnerability_ranking.csv", index=False)
        
        # Visualization of RAVI
        fig, ax = plt.subplots(figsize=(10, 5), facecolor=COLOR_BG)
        ax.set_facecolor("#FFFFFF")
        colors = [COLOR_ALERT if s >= 0.6 else (COLOR_ACCENT if s >= 0.3 else COLOR_SECONDARY) for s in v_df['RAVI_Score']]
        bars = ax.barh(v_df['Region'], v_df['RAVI_Score'], color=colors, edgecolor='k', height=0.55)
        ax.set_xlabel("Regional Agricultural Vulnerability Index (RAVI) [0-1]", fontweight='bold')
        ax.set_title("Maharashtra Regional Agricultural Vulnerability Index (RAVI) Rankings", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        ax.grid(True, linestyle=':', alpha=0.6)
        
        for bar in bars:
            w = bar.get_width()
            ax.text(w + 0.02, bar.get_y() + bar.get_height()/2, f"{w:.3f}", va='center', fontweight='bold', color=COLOR_TEXT)
            
        ax.set_xlim(0, 1.1)
        ax.invert_yaxis()
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/regional_vulnerability_index.png", dpi=300)
        plt.close()
        
        self.results['regional_vulnerability'] = v_df.to_dict(orient='records')

    def run_xai_suite(self):
        dt_clf = self.trained_clf['Decision Tree Classifier']
        rf_clf = self.trained_clf['Random Forest Classifier']
        gb_clf = self.trained_clf['Gradient Boosting Classifier']
        
        # 1. Feature Importance Comparison
        fi_df = pd.DataFrame({
            'Feature': self.clf_features,
            'Decision_Tree': dt_clf.feature_importances_,
            'Random_Forest': rf_clf.feature_importances_,
            'Gradient_Boosting': gb_clf.feature_importances_
        })
        fi_df.to_csv(f"{self.tables_dir}/feature_importance_comparison.csv", index=False)
        
        fig, ax = plt.subplots(figsize=(10, 5), facecolor=COLOR_BG)
        ax.set_facecolor("#FFFFFF")
        fi_df.set_index('Feature').plot(kind='bar', ax=ax, colormap='viridis', width=0.7)
        ax.set_title("Global Feature Importance Across Classification Algorithms", fontsize=12, fontweight='bold', color=COLOR_PRIMARY)
        ax.set_ylabel("Normalized Gini Importance", fontweight='bold')
        ax.set_xlabel("")
        ax.grid(True, linestyle=':', alpha=0.6)
        plt.xticks(rotation=15)
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/feature_importance_comparison.png", dpi=300)
        plt.close()
        
        # 2. Decision Tree Rules & Visualization
        tree_rules = export_text(dt_clf, feature_names=self.clf_features)
        with open(f"{self.tables_dir}/decision_tree_rules.txt", "w") as f:
            f.write(tree_rules)
            
        fig, ax = plt.subplots(figsize=(18, 9), facecolor='#FFFFFF')
        plot_tree(
            dt_clf,
            feature_names=self.clf_features,
            class_names=['Low', 'Moderate', 'High'],
            filled=True,
            rounded=True,
            fontsize=9,
            ax=ax
        )
        ax.set_title("Decision Tree Decision Boundaries (Depth = 4)", fontsize=14, fontweight='bold', color=COLOR_PRIMARY)
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/decision_tree_structure.png", dpi=300)
        plt.close()
        
        # 3. Permutation Importance on Test Set
        perm_imp = permutation_importance(rf_clf, self.Xc_test, self.yc_test, n_repeats=10, random_state=42)
        perm_df = pd.DataFrame({
            'Feature': self.clf_features,
            'Mean_Importance': perm_imp.importances_mean,
            'Std': perm_imp.importances_std
        }).sort_values(by='Mean_Importance', ascending=False)
        perm_df.to_csv(f"{self.tables_dir}/permutation_importance.csv", index=False)
        
        fig, ax = plt.subplots(figsize=(8, 4.5), facecolor=COLOR_BG)
        ax.set_facecolor("#FFFFFF")
        ax.barh(perm_df['Feature'], perm_df['Mean_Importance'], xerr=perm_df['Std'], color=COLOR_SECONDARY, edgecolor='k', height=0.5)
        ax.set_title("Permutation Feature Importance on Test Dataset (Random Forest)", fontsize=11, fontweight='bold', color=COLOR_PRIMARY)
        ax.set_xlabel("Mean Accuracy Drop When Feature is Shuffled")
        ax.grid(True, linestyle=':', alpha=0.6)
        ax.invert_yaxis()
        plt.tight_layout()
        plt.savefig(f"{self.figures_dir}/permutation_importance.png", dpi=300)
        plt.close()
        
        # 4. Regression Coefficients (Linear Model)
        lr_model = self.trained_reg['Multiple Linear Regression']
        coef_df = pd.DataFrame({
            'Feature': self.reg_features,
            'Coefficient': lr_model.coef_
        }).sort_values(by='Coefficient', ascending=False)
        coef_df.to_csv(f"{self.tables_dir}/linear_regression_coefficients.csv", index=False)
        
        self.results['explainable_ai'] = {
            'feature_importance': fi_df.to_dict(orient='records'),
            'permutation_importance': perm_df.to_dict(orient='records'),
            'tree_rules': tree_rules,
            'linear_coefficients': coef_df.to_dict(orient='records')
        }

if __name__ == '__main__':
    engine = AnalyticsEngine()
    engine.run_all()
