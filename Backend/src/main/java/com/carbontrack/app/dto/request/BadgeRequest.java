package com.carbontrack.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BadgeRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Badge name is required")
    private String badgeName;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Earned date is required")
    private LocalDate earnedDate;
}