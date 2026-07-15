package com.carbontrack.app.service;

import com.carbontrack.app.dto.response.CategoryEmissionResponse;

import java.util.List;

public interface AnalyticsService {

    // Today's total emission
    Double getDailyEmission(Long userId);

    // Current week's total emission
    Double getWeeklyEmission(Long userId);

    // Current month's total emission
    Double getMonthlyEmission(Long userId);

    // Category-wise emission (for Pie Chart)
    List<CategoryEmissionResponse> getCategoryWiseEmission(Long userId);

}
