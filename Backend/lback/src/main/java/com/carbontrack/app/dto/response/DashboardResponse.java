package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private Double totalEmission;
    private Double goalProgress;
    private List<ActivityResponse> recentActivities;
    private List<BadgeResponse> badges;
}