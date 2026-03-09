package com.cropdisease.crop_disease_backend.controller;

import com.cropdisease.crop_disease_backend.model.*;
import com.cropdisease.crop_disease_backend.repository.*;
import com.cropdisease.crop_disease_backend.service.MLClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final MLClientService mlClientService;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;

    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestParam("image") MultipartFile image,
            @RequestParam("cropType") String cropType) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Map result = mlClientService.predict(image.getResource()).block();

        // Safely extract confidence — ML service returns it as an Integer or Double
        Double confidence;
        Object rawConf = result.get("confidence");
        if (rawConf instanceof Integer i) {
            confidence = i.doubleValue();
        } else if (rawConf instanceof Double d) {
            confidence = d;
        } else {
            confidence = Double.parseDouble(rawConf.toString());
        }

        Prediction prediction = Prediction.builder()
                .user(user)
                .cropType(cropType)
                .diseaseName((String) result.get("disease"))
                .confidence(confidence)
                .severity((String) result.get("severity"))
                .treatment((String) result.get("treatment"))
                .build();

        predictionRepository.save(prediction);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Prediction>> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(predictionRepository.findByUserOrderByCreatedAtDesc(user));
    }
}
