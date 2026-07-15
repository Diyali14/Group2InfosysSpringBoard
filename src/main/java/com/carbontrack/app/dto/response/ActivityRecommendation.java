package com.carbontrack.app.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRecommendation {

    private String activity;

    private String reason;
    private String estimatedImpact;
    private List<String> tips;

}