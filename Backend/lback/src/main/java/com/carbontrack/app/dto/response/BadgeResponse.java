package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BadgeResponse {

    private Long id;
    private String badgeName;
    private String description;
    private LocalDate earnedDate;
}