# RutuDrishti AI — Project Execution Roadmap

**Title:** RutuDrishti AI: An Explainable Machine Learning Framework for Drought Risk Prediction and Agricultural Vulnerability Assessment
**Dataset:** `RutuDrishti AI_Preprocessed_Dataset.csv` — 500 rows × 10 columns, no missing values, no duplicates
**Regions:** Pune (128), Solapur (114), Ahmednagar (102), Nashik (90), Satara (66) | **Years:** 2015–2025

---

## 1. Problem Statement
Maharashtra's agriculture depends on erratic rainfall. Droughts reduce soil moisture and vegetation health (NDVI) and cut crop yield, but farmers and planners lack a simple, interpretable early-warning tool. RutuDrishti AI uses climate and vegetation indicators to (a) classify drought severity, (b) predict crop yield, and (c) explain *which factors drive* drought risk and yield loss.

## 2. Objectives
1. Understand relationships between climate variables, drought index and crop yield (correlation + hypothesis testing).
2. Predict **Crop_Yield_ton_ha** using regression.
3. Classify drought severity (**Low / Moderate / High**) using a Decision Tree.
4. Explain predictions (feature importance, tree rules, coefficients).
5. Assess regional agricultural vulnerability (Region-wise risk ranking).

## 3. Dataset Summary
| Column | Type | Role |
|---|---|---|
| Region, Year, Month | categorical / int | Context / grouping |
| Rainfall_mm, Temperature_C, Humidity_pct | float | Climate features |
| Soil_Moisture_pct, NDVI | float | Land / vegetation features |
| Drought_Index | float | Regression feature & basis of drought category |
| Crop_Yield_ton_ha | float | Regression target (max 8.5 → capped, 153 rows) |

## 4. Work Already Completed (from Colab notebook)
- [x] Library setup, data loading, `head/tail/info/describe`
- [x] Missing/duplicate/dtype checks
- [x] Histograms: Rainfall, Temperature, Crop Yield
- [x] Correlation matrix + heatmap; Pearson test (Rainfall vs Yield: r = 0.908, p ≈ 2.5e-190)
- [x] Multiple Linear Regression (R² = 0.875, RMSE = 0.843, MAE = 0.705)
- [x] Simple regression hypothesis test (R² = 0.825)
- [x] Regression plots (Rainfall, Soil Moisture vs Yield; Temp vs Drought)
- [x] Drought category creation (33rd/66th percentile → thresholds 2.16 / 3.34)
- [x] Decision Tree (depth 4, accuracy 72%)
- [x] Confusion matrix

## 5. Remaining Work (to complete the project)
| # | Task | Output |
|---|---|---|
| 1 | Decision Tree visualization (`plot_tree`) and feature importance | Figure + table |
| 2 | Spearman correlation (imported but unused) | Table |
| 3 | Region-wise analysis: mean Drought_Index, yield, high-risk % | Bar charts |
| 4 | Time trend: Drought_Index/Yield by Year and Month (seasonality) | Line charts |
| 5 | Vulnerability score per region | Ranked table |
| 6 | Model improvement: Random Forest + cross-validation, compare with Decision Tree | Comparison table |
| 7 | Regression diagnostics: residual plot, VIF (multicollinearity) | Figures |
| 8 | Explainability: coefficients, tree rules, permutation importance (optional SHAP) | Figures |
| 9 | Predict-new-sample function (inputs → category + yield) | Demo cell |
| 10 | Final code cleanup, README, PPT | Deliverables |

## 6. Phased Timeline
| Phase | Duration | Activities | Deliverable |
|---|---|---|---|
| 1. Understanding & Setup | Day 1 | Problem definition, folder structure, load data | Repo skeleton |
| 2. EDA | Day 2 | Distributions, correlations, region/time analysis | EDA notebook |
| 3. Statistical Testing | Day 3 | Pearson, Spearman, linregress hypotheses | Stats results |
| 4. Modeling | Days 4–5 | Linear Regression, Decision Tree, Random Forest, CV | Trained models |
| 5. Explainability & Vulnerability | Day 6 | Importance, tree rules, regional risk score | Figures/tables |
| 6. Documentation & PPT | Day 7 | Final code, README, presentation | Final submission |

## 7. Recommended Folder Structure
```
RutuDrishti AI/
├── data/RutuDrishti AI_Preprocessed_Dataset.csv
├── notebooks/RutuDrishti AI_Full.ipynb
├── src/ (eda.py, stats_tests.py, regression.py, classification.py, vulnerability.py)
├── outputs/figures/
├── outputs/tables/
├── requirements.txt
└── README.md
```

## 8. Methodology
1. **Preprocessing:** dataset already clean; one-hot encode Region for extended models; scale only if needed (not for trees).
2. **Statistical analysis:** Pearson/Spearman; H0: no correlation; α = 0.05.
3. **Regression:** Multiple Linear Regression, 80/20 split, `random_state=42`; evaluate MSE, RMSE, MAE, R².
4. **Classification:** Drought_Category from Drought_Index percentiles; stratified split; Decision Tree (Gini, depth 4, balanced weights); compare with Random Forest.
5. **Explainability:** coefficients, feature importance, tree rules.
6. **Vulnerability index:** per region = normalized mean of (Drought_Index, % High-drought months, 1 − mean Yield, 1 − mean NDVI).

## 9. Key Findings So Far (for report/PPT)
- Rainfall has the strongest positive link with yield (r = 0.91); Drought_Index is strongly negative (r = −0.86).
- Soil moisture (0.79) and NDVI (0.81) are also strong yield drivers; temperature is weak (0.38).
- Linear model R² = 0.875; it over-predicts at the top end because yield is **capped at 8.5** (153 records) — a limitation to discuss.
- Decision Tree accuracy 72%; most confusion is between Moderate and High (11 High → Moderate).

## 10. Limitations & Improvements
- Yield ceiling (8.5) violates linear assumptions → try tree-based/regularized models or log/clip handling.
- Drought_Index is highly correlated with rainfall/soil moisture (multicollinearity) → check VIF.
- Drought categories derived from Drought_Index; excluding it from classifier features avoids leakage (already done).
- Small dataset (500 rows) → use cross-validation.
- Data appears synthetic/aggregated; state this honestly.

## 11. Rubric Mapping
| Rubric Criterion | How the project satisfies it |
|---|---|
| Engineering Knowledge (2) | Clear explanation of drought prediction application, variables and ML pipeline |
| Problem Analysis (3) | Correct use of pandas, correlation, hypothesis tests, regression, classification, metrics |
| Design of Solutions (2) | End-to-end framework: EDA → models → explainability → vulnerability index |
| Complex Problem Solving (2) | Insightful interpretation: yield cap, multicollinearity, class confusion, regional risk |
| Professional Ethics (1) | Original solution, cited dataset source, honest limitations, no plagiarism |

## 12. Deliverables Checklist
- [ ] Project code (`.ipynb` + `.py`)
- [ ] Project PPT (10–12 slides)
- [ ] README with run instructions
- [ ] Figures and tables exported

## 13. PPT Outline (10–12 slides)
1. Title & team 2. Problem & motivation 3. Objectives 4. Dataset 5. EDA highlights 6. Correlation & hypothesis tests 7. Regression results 8. Drought classification 9. Explainability 10. Regional vulnerability 11. Limitations & future work 12. Conclusion
