package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.response.CategoryEmissionResponse;
import com.carbontrack.app.repository.ActivityLogRepository;
import com.carbontrack.app.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.Cacheable;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ActivityLogRepository activityLogRepository;
    @Override
    @Cacheable(value = "dailyEmission", key = "#userId")
    public Double getDailyEmission(Long userId) {

        LocalDate today = LocalDate.now();

        return activityLogRepository.getDailyEmission(userId, today);

    }

    @Override
    @Cacheable(value = "weeklyEmission", key = "#userId")
    public Double getWeeklyEmission(Long userId) {

        LocalDate today = LocalDate.now();

        LocalDate startOfWeek =
                today.with(DayOfWeek.MONDAY);

        return activityLogRepository.getEmissionBetweenDates(
                userId,
                startOfWeek,
                today
        );

    }

    @Override
    @Cacheable(value = "monthlyEmission", key = "#userId")
    public Double getMonthlyEmission(Long userId) {

        LocalDate today = LocalDate.now();

        LocalDate firstDay =
                today.withDayOfMonth(1);

        return activityLogRepository.getEmissionBetweenDates(
                userId,
                firstDay,
                today
        );

    }

    @Override
    @Cacheable(value = "categoryEmission", key = "#userId")
    public List<CategoryEmissionResponse> getCategoryWiseEmission(Long userId) {

        LocalDate today = LocalDate.now();

        LocalDate firstDay =
                today.withDayOfMonth(1);

        return activityLogRepository.getCategoryWiseEmission(
                userId,
                firstDay,
                today
        );

    }
}
