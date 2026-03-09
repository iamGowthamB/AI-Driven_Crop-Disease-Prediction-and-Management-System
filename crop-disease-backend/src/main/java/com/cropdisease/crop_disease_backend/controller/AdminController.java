package com.cropdisease.crop_disease_backend.controller;

import com.cropdisease.crop_disease_backend.model.DiseaseKnowledge;
import com.cropdisease.crop_disease_backend.model.User;
import com.cropdisease.crop_disease_backend.repository.DiseaseKnowledgeRepository;
import com.cropdisease.crop_disease_backend.repository.PredictionRepository;
import com.cropdisease.crop_disease_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final DiseaseKnowledgeRepository knowledgeRepo;
    private final UserRepository userRepo;
    private final PredictionRepository predictionRepo;

    // ════════════════════════════════════════
    // Disease Knowledge CRUD → /api/admin/knowledge
    // ════════════════════════════════════════
    @GetMapping("/api/admin/knowledge")
    @PreAuthorize("hasAnyRole('ADMIN','USER')") // browsable by users too
    public List<DiseaseKnowledge> getKnowledge() {
        return knowledgeRepo.findAll();
    }

    @PostMapping("/api/admin/knowledge")
    @PreAuthorize("hasRole('ADMIN')")
    public DiseaseKnowledge create(@RequestBody DiseaseKnowledge k) {
        return knowledgeRepo.save(k);
    }

    @PutMapping("/api/admin/knowledge/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DiseaseKnowledge update(@PathVariable Long id, @RequestBody DiseaseKnowledge k) {
        k.setId(id);
        return knowledgeRepo.save(k);
    }

    @DeleteMapping("/api/admin/knowledge/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteKnowledge(@PathVariable Long id) {
        knowledgeRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ════════════════════════════════════════
    // Platform Stats → /api/admin/stats
    // ════════════════════════════════════════
    @GetMapping("/api/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepo.count();
        long totalPredictions = predictionRepo.count();
        long severeCount = predictionRepo.countBySeverity("Severe");

        // Most frequent disease name
        String mostFrequent = predictionRepo.findMostFrequentDisease()
                .stream().findFirst().orElse("No data yet");

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalPredictions", totalPredictions,
                "severeCount", severeCount,
                "mostFrequentDisease", mostFrequent));
    }

    // ════════════════════════════════════════
    // User Management → /api/admin/users
    // ════════════════════════════════════════
    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepo.findById(id).orElseThrow();
        user.setRole(User.Role.valueOf(body.get("role")));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated"));
    }
}
