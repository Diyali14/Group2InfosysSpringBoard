package com.carbontrack.app.controller;

import com.carbontrack.app.dto.response.CategoryEmissionResponse;
import com.carbontrack.app.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(
        name = "Analytics API",
        description = "APIs for Carbon Footprint Analytics"
)
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "Get today's carbon emission")
    @GetMapping("/daily/{userId}")
    public Double getDailyEmission(@PathVariable Long userId) {

        return analyticsService.getDailyEmission(userId);

    }

    @Operation(summary = "Get current week's carbon emission")
    @GetMapping("/weekly/{userId}")
    public Double getWeeklyEmission(@PathVariable Long userId) {

        return analyticsService.getWeeklyEmission(userId);

    }

    @Operation(summary = "Get current month's carbon emission")
    @GetMapping("/monthly/{userId}")
    public Double getMonthlyEmission(@PathVariable Long userId) {

        return analyticsService.getMonthlyEmission(userId);

    }

    @Operation(summary = "Get category-wise carbon emission")
    @GetMapping("/categories/{userId}")
    public List<CategoryEmissionResponse> getCategoryWiseEmission(
            @PathVariable Long userId) {

        return analyticsService.getCategoryWiseEmission(userId);

    }

}
