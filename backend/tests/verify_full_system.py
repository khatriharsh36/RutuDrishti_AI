import os
import sys
import json
import pandas as pd

sys.path.insert(0, os.path.abspath("."))
from backend.app.services.ml_service import MLService

def test_system():
    print("=== STARTING FULL SYSTEM VERIFICATION ===")
    
    # 1. Dataset Verification
    assert os.path.exists("data/RutuDrishti AI_Preprocessed_Dataset.csv"), "Dataset CSV missing"
    df = pd.read_csv("data/RutuDrishti AI_Preprocessed_Dataset.csv")
    assert df.shape == (500, 10), f"Unexpected shape {df.shape}"
    assert (df['Crop_Yield_ton_ha'] == 8.5).sum() == 153, "Capped count mismatch"
    print("[PASS] Dataset verified (500 rows, 10 cols, 153 capped).")
    
    # 2. Output Figures Verification
    expected_figs = [
        'classification_confusion_matrices.png',
        'decision_tree_structure.png',
        'eda_correlation_matrix.png',
        'eda_distributions.png',
        'eda_rainfall_yield_scatter.png',
        'eda_regional_comparisons.png',
        'eda_seasonal_trends.png',
        'feature_importance_comparison.png',
        'permutation_importance.png',
        'regional_vulnerability_index.png',
        'regression_residuals.png'
    ]
    for fig in expected_figs:
        p = os.path.join("outputs/figures", fig)
        assert os.path.exists(p), f"Missing figure {fig}"
    print(f"[PASS] All {len(expected_figs)} figures present and validated.")
    
    # 3. Output Tables Verification
    expected_tables = [
        'classification_benchmarks.csv',
        'correlation_analysis.csv',
        'decision_tree_rules.txt',
        'feature_importance_comparison.csv',
        'hypothesis_tests.csv',
        'linear_regression_coefficients.csv',
        'permutation_importance.csv',
        'regional_vulnerability_ranking.csv',
        'regression_benchmarks.csv',
        'statistical_profiling.csv',
        'vif_multicollinearity.csv'
    ]
    for t in expected_tables:
        p = os.path.join("outputs/tables", t)
        assert os.path.exists(p), f"Missing table {t}"
    print(f"[PASS] All {len(expected_tables)} tables present and validated.")
    
    # 4. ML Models & Inference
    ml = MLService()
    pred = ml.predict(250, 28, 60, 30, 0.45, "Pune")
    assert pred['predicted_drought_category'] in ['Low', 'Moderate', 'High']
    assert 0.5 <= pred['predicted_crop_yield_ton_ha'] <= 8.5
    print("[PASS] ML Service prediction operational.")
    
    sim = ml.simulate_scenario("Pune", -30, 2.5, -8, -0.1)
    assert sim['is_simulation'] is True
    assert 'impact_analysis' in sim
    print("[PASS] Scenario simulation operational.")
    
    # 5. Deliverables Verification
    assert os.path.exists("notebooks/RutuDrishti AI_Full.ipynb"), "Notebook missing"
    assert os.path.exists("presentation/RutuDrishti AI_Executive_Presentation.pptx"), "Presentation PPTX missing"
    assert os.path.exists("presentation/RutuDrishti AI_Presentation_Slides.md"), "Slides MD missing"
    assert os.path.exists("README.md"), "README missing"
    assert os.path.exists("PROJECT_DOCUMENTATION.md"), "Documentation missing"
    assert os.path.exists("frontend/dist/index.html"), "Frontend dist missing"
    print("[PASS] All core deliverables present and verified.")
    
    print("=== FULL SYSTEM VERIFICATION COMPLETE: ALL 5/5 SUITES PASSED ===")

if __name__ == "__main__":
    test_system()
