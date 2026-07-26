package com.carbontrack.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EmissionFactorRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Activity Type is required")
    private String activityType;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Factor is required")
    @Positive(message = "Factor must be greater than 0")
    private Double factor;
}