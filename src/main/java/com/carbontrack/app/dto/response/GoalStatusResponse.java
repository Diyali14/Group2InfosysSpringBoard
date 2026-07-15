package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoalStatusResponse {

    private Long goalId;

    private String status;

    private Boolean onTrack;

    private String message;
}