package com.cropdisease.crop_disease_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disease_knowledge")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseKnowledge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String diseaseName;

    @Column(nullable = false)
    private String cropType;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String organicSolution;

    @Column(length = 2000)
    private String chemicalSolution;

    @Column(length = 2000)
    private String preventionTips;
}
