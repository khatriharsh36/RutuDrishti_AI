import unittest
from fastapi.testclient import TestClient
from backend.app.main import app

class TestBackendEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        if "text/html" in response.headers.get("content-type", ""):
            self.assertIn("RutuDrishti AI", response.text)
        else:
            data = response.json()
            self.assertIn(data["platform"], ["RutuDrishti AI", "RutuDrishti AI"])
            self.assertEqual(data["status"], "operational")

    def test_overview(self):
        response = self.client.get("/api/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("dataset_overview", data)
        self.assertEqual(data["dataset_overview"]["total_observations"], 500)
        self.assertEqual(data["dataset_overview"]["capped_yield_count"], 153)

    def test_climate(self):
        response = self.client.get("/api/climate")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("regional_climate", data)
        self.assertEqual(len(data["regional_climate"]), 5)

    def test_drought(self):
        response = self.client.get("/api/drought")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["percentile_thresholds"]["33rd_percentile_low_cutoff"], 2.16)
        self.assertEqual(data["percentile_thresholds"]["66th_percentile_high_cutoff"], 3.34)

    def test_vulnerability(self):
        response = self.client.get("/api/vulnerability")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        rankings = data["regional_rankings"]
        self.assertEqual(len(rankings), 5)
        self.assertEqual(rankings[0]["Region"], "Solapur")

    def test_predict(self):
        payload = {
            "rainfall_mm": 250.0,
            "temperature_c": 28.5,
            "humidity_pct": 65.0,
            "soil_moisture_pct": 32.0,
            "ndvi": 0.55,
            "region": "Pune"
        }
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn(data["predicted_drought_category"], ["Low", "Moderate", "High"])
        self.assertTrue(0.0 <= data["predicted_crop_yield_ton_ha"] <= 8.5)
        self.assertIn("explanation", data)

    def test_simulate(self):
        payload = {
            "base_region": "Pune",
            "rainfall_change_pct": -30.0,
            "temperature_change_c": 2.5,
            "soil_moisture_change_pct": -8.0,
            "ndvi_change": -0.1
        }
        response = self.client.post("/api/simulate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["is_simulation"])
        self.assertIn("impact_analysis", data)

if __name__ == "__main__":
    unittest.main()
