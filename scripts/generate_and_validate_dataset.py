import numpy as np
import pandas as pd
from scipy.stats import pearsonr
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

def generate_dataset(seed=42):
    np.random.seed(seed)
    n = 500
    
    # Regional breakdown exactly as specified in Roadmap:
    # Pune (128), Solapur (114), Ahmednagar (102), Nashik (90), Satara (66)
    regions = (
        ['Pune'] * 128 +
        ['Solapur'] * 114 +
        ['Ahmednagar'] * 102 +
        ['Nashik'] * 90 +
        ['Satara'] * 66
    )
    
    years = np.random.choice(range(2015, 2026), size=n)
    months = np.random.choice(range(1, 13), size=n)
    
    # Regional base climate factors:
    # Solapur & Ahmednagar are drier/semi-arid, Satara & Nashik higher rainfall, Pune intermediate
    reg_rain_bias = {'Solapur': -120, 'Ahmednagar': -80, 'Pune': 0, 'Nashik': 90, 'Satara': 140}
    reg_temp_bias = {'Solapur': 3.5, 'Ahmednagar': 2.0, 'Pune': 0.0, 'Nashik': -1.5, 'Satara': -2.5}
    reg_drought_bias = {'Solapur': 0.65, 'Ahmednagar': 0.40, 'Pune': -0.05, 'Nashik': -0.35, 'Satara': -0.65}
    
    # Seasonal base
    # Monsoon: months 6,7,8,9 (June-Sept)
    is_monsoon = np.isin(months, [6, 7, 8, 9])
    is_winter = np.isin(months, [11, 12, 1, 2])
    
    # Base latent moisture / climate cycle
    latent_factor = np.random.normal(0, 1, n)
    
    rainfall = []
    temperature = []
    humidity = []
    soil_moisture = []
    ndvi = []
    drought_index = []
    
    for i in range(n):
        reg = regions[i]
        m = months[i]
        
        # Base rainfall depends strongly on monsoon
        if m in [6, 7, 8, 9]:
            base_r = np.random.uniform(250, 750) + reg_rain_bias[reg] + latent_factor[i] * 50
        elif m in [5, 10]:
            base_r = np.random.uniform(50, 200) + reg_rain_bias[reg] * 0.4 + latent_factor[i] * 20
        else:
            base_r = np.random.uniform(5, 60) + max(0, reg_rain_bias[reg] * 0.1)
        r_val = max(5.0, base_r)
        
        # Temperature
        if m in [3, 4, 5]:
            base_t = np.random.uniform(32, 41) + reg_temp_bias[reg]
        elif m in [6, 7, 8, 9]:
            base_t = np.random.uniform(25, 32) + reg_temp_bias[reg] * 0.5
        else:
            base_t = np.random.uniform(20, 29) + reg_temp_bias[reg] * 0.8
        t_val = round(base_t + np.random.normal(0, 1.0), 1)
        
        # Humidity
        base_h = 25 + 0.065 * r_val - 0.4 * (t_val - 25) + np.random.normal(0, 4)
        h_val = round(np.clip(base_h, 20.0, 95.0), 1)
        
        # Soil Moisture
        base_sm = 12 + 0.045 * r_val + 0.15 * h_val - 0.25 * (t_val - 25) + np.random.normal(0, 3)
        sm_val = round(np.clip(base_sm, 8.0, 65.0), 1)
        
        # NDVI (Vegetation index 0.1 to 0.85)
        base_ndvi = 0.18 + 0.00045 * r_val + 0.006 * sm_val - 0.004 * (t_val - 25) + np.random.normal(0, 0.03)
        ndvi_val = round(np.clip(base_ndvi, 0.15, 0.88), 3)
        
        # Drought Index (roughly 0.5 to 5.0, where higher = worse drought)
        # Driven by high temp, low rain, low soil moisture, low NDVI
        base_di = 4.2 - 0.0035 * r_val - 0.035 * sm_val - 1.8 * ndvi_val + 0.04 * (t_val - 25) + reg_drought_bias[reg] + np.random.normal(0, 0.25)
        di_val = round(np.clip(base_di, 0.4, 5.2), 2)
        
        rainfall.append(round(r_val, 1))
        temperature.append(t_val)
        humidity.append(h_val)
        soil_moisture.append(sm_val)
        ndvi.append(ndvi_val)
        drought_index.append(di_val)
        
    rainfall = np.array(rainfall)
    temperature = np.array(temperature)
    humidity = np.array(humidity)
    soil_moisture = np.array(soil_moisture)
    ndvi = np.array(ndvi)
    drought_index = np.array(drought_index)
    
    # Align percentiles for drought index so 33rd is close to 2.16 and 66th is close to 3.34
    p33 = np.percentile(drought_index, 33.33)
    p66 = np.percentile(drought_index, 66.67)
    # Calibrate linearly to hit approx 2.16 and 3.34
    drought_index = 2.16 + (drought_index - p33) * ((3.34 - 2.16) / (p66 - p33))
    drought_index = np.round(np.clip(drought_index, 0.5, 5.0), 2)
    
    # Now Crop Yield:
    # Correlated with rainfall ~0.908, soil moisture ~0.79, ndvi ~0.81, drought ~ -0.86, temp ~ 0.38
    # Must cap at 8.5 for exactly 153 rows!
    raw_yield = (
        0.0078 * rainfall +
        0.045 * soil_moisture +
        3.2 * ndvi -
        0.55 * drought_index +
        0.04 * temperature +
        np.random.normal(0, 0.35, n)
    )
    
    # Adjust scale so that the top 153 values exceed 8.5, then cap them at 8.5
    # Sort to find the 153rd highest value (500 - 153 = 347th index)
    sorted_y = np.sort(raw_yield)
    cutoff_val = sorted_y[500 - 153] # index 347
    
    # Rescale raw_yield so that cutoff_val maps exactly to 8.5, and min is around 1.2
    min_target = 1.2
    raw_yield_scaled = min_target + (raw_yield - sorted_y.min()) * ((8.5 - min_target) / (cutoff_val - sorted_y.min()))
    
    # Cap at 8.5
    crop_yield = np.where(raw_yield_scaled >= 8.5, 8.5, np.round(raw_yield_scaled, 2))
    
    df = pd.DataFrame({
        'Region': regions,
        'Year': years,
        'Month': months,
        'Rainfall_mm': rainfall,
        'Temperature_C': temperature,
        'Humidity_pct': humidity,
        'Soil_Moisture_pct': soil_moisture,
        'NDVI': ndvi,
        'Drought_Index': drought_index,
        'Crop_Yield_ton_ha': crop_yield
    })
    
    return df

if __name__ == '__main__':
    df = generate_dataset(42)
    print("Dataset shape:", df.shape)
    print("Region counts:\n", df['Region'].value_counts())
    print("Capped rows at 8.5:", (df['Crop_Yield_ton_ha'] == 8.5).sum())
    p33 = np.percentile(df['Drought_Index'], 33.33)
    p66 = np.percentile(df['Drought_Index'], 66.67)
    print(f"Drought Index 33rd percentile: {p33:.2f}, 66th percentile: {p66:.2f}")
    
    r_rain, p_rain = pearsonr(df['Rainfall_mm'], df['Crop_Yield_ton_ha'])
    r_sm, _ = pearsonr(df['Soil_Moisture_pct'], df['Crop_Yield_ton_ha'])
    r_ndvi, _ = pearsonr(df['NDVI'], df['Crop_Yield_ton_ha'])
    r_di, _ = pearsonr(df['Drought_Index'], df['Crop_Yield_ton_ha'])
    r_temp, _ = pearsonr(df['Temperature_C'], df['Crop_Yield_ton_ha'])
    print(f"Correlations with Crop Yield: Rain={r_rain:.3f} (p={p_rain:.2e}), SM={r_sm:.3f}, NDVI={r_ndvi:.3f}, DI={r_di:.3f}, Temp={r_temp:.3f}")
    
    # Baseline Linear Regression
    features = ['Rainfall_mm', 'Temperature_C', 'Humidity_pct', 'Soil_Moisture_pct', 'NDVI', 'Drought_Index']
    X = df[features]
    y = df['Crop_Yield_ton_ha']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    preds = lr.predict(X_test)
    print(f"Linear Regression: R2={r2_score(y_test, preds):.3f}, RMSE={np.sqrt(mean_squared_error(y_test, preds)):.3f}, MAE={mean_absolute_error(y_test, preds):.3f}")
