package com.cropdisease.crop_disease_backend.repository;

import com.cropdisease.crop_disease_backend.model.Prediction;
import com.cropdisease.crop_disease_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserOrderByCreatedAtDesc(User user);

    long countBySeverity(String severity);

    @Query("SELECT p.diseaseName FROM Prediction p GROUP BY p.diseaseName ORDER BY COUNT(p.diseaseName) DESC")
    List<String> findMostFrequentDisease();
}
