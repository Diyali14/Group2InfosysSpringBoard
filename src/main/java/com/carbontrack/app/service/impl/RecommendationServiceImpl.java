package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.response.ActivityEmissionSummary;
import com.carbontrack.app.dto.response.RecommendationResponse;
import com.carbontrack.app.repository.ActivityLogRepository;
import com.carbontrack.app.service.LLMService;
import com.carbontrack.app.service.PromptBuilder;
import com.carbontrack.app.service.RecommendationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ActivityLogRepository activityLogRepository;
    private final PromptBuilder promptBuilder;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;

    @Override
    public RecommendationResponse generateRecommendations(Long userId) {

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        List<ActivityEmissionSummary> summary =
                activityLogRepository.getActivityEmissionSummary(
                        userId,
                        startDate,
                        endDate
                );

        // No activities found
        if (summary.isEmpty()) {
            return RecommendationResponse.builder()
                    .weeklySummary("No activity data is available for the last 30 days. Start logging your activities to receive personalized carbon reduction recommendations.")
                    .recommendations(List.of())
                    .build();
        }

        // Top 3 highest-emission activities
        List<ActivityEmissionSummary> topActivities =
                summary.stream()
                        .limit(3)
                        .toList();

        // Total emissions across all activities
        double totalEmission = summary.stream()
                .mapToDouble(ActivityEmissionSummary::getTotalEmission)
                .sum();

        // Build AI prompt
        String prompt =
                promptBuilder.buildRecommendationPrompt(
                        topActivities,
                        totalEmission
                );

        // Generate AI response
        String aiResponse =
                llmService.generateResponse(prompt);

        try {

            return objectMapper.readValue(
                    aiResponse,
                    RecommendationResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI recommendation response.",
                    e
            );
        }
    }
}