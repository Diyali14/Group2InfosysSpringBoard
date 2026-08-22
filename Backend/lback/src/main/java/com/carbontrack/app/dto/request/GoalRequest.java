package com.carbontrack.app.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Target CO2e is required")
    @Positive(message = "Target CO2e must be greater than 0")
    private Double targetCo2e;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}