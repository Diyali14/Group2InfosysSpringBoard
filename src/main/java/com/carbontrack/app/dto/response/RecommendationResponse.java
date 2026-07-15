package com.carbontrack.app.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {

    private String weeklySummary;

    private List<ActivityRecommendation> recommendations;

}