package com.cropdisease.crop_disease_backend.controller;

import com.cropdisease.crop_disease_backend.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/risk")
    public ResponseEntity<?> getRisk(@RequestParam(defaultValue = "current") String location) {
        return ResponseEntity.ok(weatherService.getCurrentRisk(location));
    }
}
