package com.cropdisease.crop_disease_backend.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Data
    public static class WeatherRisk {
        private double temperature;
        private double humidity;
        private String riskLevel; // LOW, MODERATE, HIGH
        private String message;
    }

    public WeatherRisk getCurrentRisk(String location) {
        // In a real production app, we would call OpenWeatherMap API here.
        // For this architecture demonstration, we implement a sophisticated simulator
        // that calculates risk based on typical agricultural parameters.

        double temp = 22.0 + (Math.random() * 10); // 22-32 C
        double humidity = 60.0 + (Math.random() * 35); // 60-95 %

        WeatherRisk risk = new WeatherRisk();
        risk.setTemperature(Math.round(temp * 10.0) / 10.0);
        risk.setHumidity(Math.round(humidity * 10.0) / 10.0);

        if (humidity > 85 && temp > 25) {
            risk.setRiskLevel("HIGH");
            risk.setMessage("High humidity and warmth detected. Elevated risk for Late Blight and Fungal pathogens.");
        } else if (humidity > 75) {
            risk.setRiskLevel("MODERATE");
            risk.setMessage("Moderate humidity. Monitor for early signs of Septoria or Leaf Mold.");
        } else {
            risk.setRiskLevel("LOW");
            risk.setMessage("Environmental conditions are optimal. Low risk of moisture-driven diseases.");
        }

        return risk;
    }
}
