package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityResponse {

    private Long id;
    private String category;
    private String activityType;
    private Double quantity;
    private String unit;
    private Double co2e;
}