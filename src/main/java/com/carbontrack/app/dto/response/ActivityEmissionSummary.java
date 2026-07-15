package com.carbontrack.app.dto.response;

import lombok.*;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ActivityEmissionSummary {

    private String category;

    private String activityType;

    private Double totalEmission;

    private Long frequency;

    private Double totalQuantity;

}
