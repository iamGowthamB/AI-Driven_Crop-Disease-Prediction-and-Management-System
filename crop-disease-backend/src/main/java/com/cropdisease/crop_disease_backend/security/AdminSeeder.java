package com.cropdisease.crop_disease_backend.security;

import com.cropdisease.crop_disease_backend.model.DiseaseKnowledge;
import com.cropdisease.crop_disease_backend.model.User;
import com.cropdisease.crop_disease_backend.model.User.Role;
import com.cropdisease.crop_disease_backend.repository.DiseaseKnowledgeRepository;
import com.cropdisease.crop_disease_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DiseaseKnowledgeRepository knowledgeRepo;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       DiseaseKnowledgeRepository knowledgeRepo) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.knowledgeRepo = knowledgeRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // ── Seed default admin user ────────────────────────────────────────────
        String adminEmail = "727723eucs007@skcet.ac.in";
        Optional<User> adminUser = userRepository.findByEmail(adminEmail);
        if (adminUser.isEmpty()) {
            User currentAdmin = new User();
            currentAdmin.setEmail(adminEmail);
            currentAdmin.setFullName("Ajay");
            currentAdmin.setPassword(passwordEncoder.encode("skcet@123"));
            currentAdmin.setRole(Role.ADMIN);
            userRepository.save(currentAdmin);
            System.out.println("Default Admin User created successfully!");
        } else {
            System.out.println("Admin User already exists.");
        }

        // ── Seed ML model disease classes into Knowledge DB ────────────────────
        if (knowledgeRepo.count() == 0) {
            List<DiseaseKnowledge> diseases = List.of(
                // ─ Pepper ─────────────────────────────────────────────────────
                DiseaseKnowledge.builder()
                    .cropType("Pepper").diseaseName("Bacterial Spot")
                    .description("Bacterial infection causing water-soaked spots on leaves and fruit.")
                    .chemicalSolution("Apply copper-based bactericides (e.g., Kocide 3000) every 7–10 days.")
                    .organicSolution("Remove and destroy infected debris. Treat seeds with hot water (50°C for 25 min).")
                    .preventionTips("Avoid overhead irrigation. Use certified disease-free transplants.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Pepper").diseaseName("Pepper Healthy")
                    .description("Plant shows no signs of disease. Continue standard care.")
                    .chemicalSolution("No treatment required.")
                    .organicSolution("Maintain regular watering and balanced fertilisation.")
                    .preventionTips("Monitor regularly for early signs of disease.")
                    .build(),

                // ─ Potato ─────────────────────────────────────────────────────
                DiseaseKnowledge.builder()
                    .cropType("Potato").diseaseName("Early Blight")
                    .description("Fungal disease causing dark concentric rings on lower leaves.")
                    .chemicalSolution("Apply chlorothalonil or mancozeb every 7 days at first sign of symptoms.")
                    .organicSolution("Remove lower infected leaves promptly. Apply neem oil spray.")
                    .preventionTips("Rotate crops — avoid planting potatoes in the same field for 2–3 years.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Potato").diseaseName("Late Blight")
                    .description("Highly destructive oomycete disease — spreads rapidly in wet, cool conditions.")
                    .chemicalSolution("Apply metalaxyl or cymoxanil systemic fungicides immediately upon detection.")
                    .organicSolution("Destroy all infected plant material. Do NOT compost infected debris.")
                    .preventionTips("Avoid wetting foliage. Treat the entire field as a precaution when detected.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Potato").diseaseName("Potato Healthy")
                    .description("Plant shows no signs of disease. Continue standard care.")
                    .chemicalSolution("No treatment required.")
                    .organicSolution("Maintain proper hilling and drainage.")
                    .preventionTips("Scout fields regularly during humid weather.")
                    .build(),

                // ─ Tomato ─────────────────────────────────────────────────────
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Bacterial Spot")
                    .description("Bacterial infection causing dark, water-soaked lesions on leaves and fruits.")
                    .chemicalSolution("Spray copper bactericides combined with mancozeb weekly.")
                    .organicSolution("Remove and bag infected leaves. Avoid working in field when plants are wet.")
                    .preventionTips("Use drip irrigation. Treat seeds with hot water (50°C, 25 min) before planting.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Early Blight")
                    .description("Fungal disease causing concentric ring lesions starting on older leaves.")
                    .chemicalSolution("Apply chlorothalonil or azoxystrobin every 7–10 days.")
                    .organicSolution("Remove and destroy infected lower leaves. Mulch to prevent soil splash.")
                    .preventionTips("Water at the base to keep foliage dry. Space plants adequately.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Late Blight")
                    .description("Highly destructive oomycete causing large greasy spots that rapidly kill tissue.")
                    .chemicalSolution("Apply mancozeb or chlorothalonil preventively; use metalaxyl on confirmed infection.")
                    .organicSolution("Destroy infected plants immediately to prevent spread to neighbours.")
                    .preventionTips("Avoid overhead watering. Act fast — this disease spreads within days.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Leaf Mold")
                    .description("Fungal disease producing yellow spots on upper leaf and olive-gray mold below.")
                    .chemicalSolution("Apply chlorothalonil or mancozeb fungicides at first appearance.")
                    .organicSolution("Improve greenhouse ventilation to reduce humidity. Remove infected leaves.")
                    .preventionTips("Avoid overhead watering. Maintain good air circulation.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Septoria Leaf Spot")
                    .description("Fungal disease causing small, circular spots with dark borders starting low on plant.")
                    .chemicalSolution("Apply chlorothalonil, mancozeb, or copper-based sprays every 7–10 days.")
                    .organicSolution("Remove infected leaves at bottom of plant. Mulch around base.")
                    .preventionTips("Rotate crops to reduce soil pathogen load. Avoid overhead irrigation.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Spider Mites (Two-spotted)")
                    .description("Tiny arachnids causing stippled, yellowing leaves; fine webbing visible under leaves.")
                    .chemicalSolution("Apply miticides (abamectin or spiromesifen). Spray undersides of leaves.")
                    .organicSolution("Introduce predatory mites (Phytoseiulus persimilis). Spray with water jets.")
                    .preventionTips("Keep plants well-watered — drought stress worsens mite outbreaks.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Target Spot")
                    .description("Fungal disease producing brown lesions with concentric rings resembling a target.")
                    .chemicalSolution("Apply pyraclostrobin or boscalid at early signs of infection.")
                    .organicSolution("Prune dense canopy to improve airflow. Remove infected plant material.")
                    .preventionTips("Avoid leaf wetness — use drip irrigation. Ensure good plant spacing.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Yellow Leaf Curl Virus")
                    .description("Viral disease transmitted by whiteflies causing severe leaf curl and stunted growth.")
                    .chemicalSolution("Control whitefly vectors with imidacloprid or reflective silver mulches.")
                    .organicSolution("Remove and destroy infected plants immediately — no cure exists for infected plants.")
                    .preventionTips("Plant resistant varieties. Use insect-proof nets in nurseries.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Mosaic Virus")
                    .description("Viral disease causing mosaic discolouration, leaf distortion, and reduced fruit quality.")
                    .chemicalSolution("Control aphid and insect vectors. Disinfect tools with 10% bleach solution.")
                    .organicSolution("Remove and destroy infected plants. Plant virus-resistant varieties.")
                    .preventionTips("Avoid tobacco products near plants — they can transmit the virus mechanically.")
                    .build(),
                DiseaseKnowledge.builder()
                    .cropType("Tomato").diseaseName("Tomato Healthy")
                    .description("Plant shows no signs of disease. Continue standard care.")
                    .chemicalSolution("No treatment required.")
                    .organicSolution("Continue balanced fertilisation and adequate watering.")
                    .preventionTips("Inspect plants weekly. Maintain good drainage and airflow.")
                    .build()
            );
            knowledgeRepo.saveAll(diseases);
            System.out.println("✓ Seeded " + diseases.size() + " ML model disease classes into Knowledge DB.");
        } else {
            System.out.println("Knowledge DB already seeded (" + knowledgeRepo.count() + " records).");
        }
    }
}
