package com.cropdisease.crop_disease_backend.repository;

import com.cropdisease.crop_disease_backend.model.DiseaseKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DiseaseKnowledgeRepository extends JpaRepository<DiseaseKnowledge, Long> {
    Optional<DiseaseKnowledge> findByDiseaseName(String diseaseName);
}
