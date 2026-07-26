package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class GoalResponse {

    private Long id;
    private Double targetCo2e;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}