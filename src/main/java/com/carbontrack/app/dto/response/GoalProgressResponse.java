package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoalProgressResponse {

    private Long goalId;

    private Double targetCo2e;

    private Double targetReductionPercentage;

    private Double currentProgress;

    private Boolean onTrack;

    private String status;
}