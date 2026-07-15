package com.carbontrack.app.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityInsight {

    private String category;

    private String activityType;

    private Double totalEmission;

    private Double percentage;

    private Long frequency;

    private Double totalQuantity;

}
