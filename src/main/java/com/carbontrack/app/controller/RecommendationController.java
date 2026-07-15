package com.carbontrack.app.controller;

import com.carbontrack.app.dto.response.RecommendationResponse;
import com.carbontrack.app.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(
        name = "Recommendation API",
        description = "AI Powered Carbon Reduction Recommendations"
)
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Operation(summary = "Generate personalized recommendations")
    @GetMapping("/{userId}")
    public RecommendationResponse generateRecommendations(
            @PathVariable Long userId) {

        return recommendationService.generateRecommendations(userId);

    }

}