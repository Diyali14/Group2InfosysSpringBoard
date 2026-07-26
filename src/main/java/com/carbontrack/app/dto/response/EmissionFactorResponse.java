package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmissionFactorResponse {

    private Long id;
    private String category;
    private String activityType;
    private String unit;
    private Double factor;
}