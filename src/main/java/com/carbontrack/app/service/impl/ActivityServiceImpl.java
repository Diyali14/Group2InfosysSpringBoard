package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.request.ActivityRequest;
import com.carbontrack.app.dto.response.ActivityResponse;
import com.carbontrack.app.entity.ActivityLog;
import com.carbontrack.app.entity.EmissionFactor;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.ActivityLogRepository;
import com.carbontrack.app.repository.EmissionFactorRepository;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityLogRepository activityRepo;
    private final EmissionFactorRepository factorRepo;
    private final UserRepository userRepository;

    @Override
    @Caching(evict = {
            @CacheEvict(value = "dailyEmission", key = "#request.userId"),
            @CacheEvict(value = "weeklyEmission", key = "#request.userId"),
            @CacheEvict(value = "monthlyEmission", key = "#request.userId"),
            @CacheEvict(value = "categoryEmission", key = "#request.userId"),
            @CacheEvict(value = "weeklyRecommendations", key = "#request.userId")
    })
    public ActivityResponse addActivity(ActivityRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EmissionFactor factor = factorRepo
                .findByCategoryAndActivityType(request.getCategory(), request.getActivityType())
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found"));

        double co2e = request.getQuantity() * factor.getFactor();

        ActivityLog log = ActivityLog.builder()
                .user(user)
                .category(request.getCategory())
                .activityType(request.getActivityType())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .logDate(request.getLogDate())
                .co2e(co2e)
                .build();

        ActivityLog saved = activityRepo.save(log);

        return ActivityResponse.builder()
                .id(saved.getId())
                .category(saved.getCategory())
                .activityType(saved.getActivityType())
                .quantity(saved.getQuantity())
                .unit(saved.getUnit())
                .co2e(saved.getCo2e())
                .build();
    }

    @Override
    public List<ActivityResponse> getActivitiesByUser(Long userId) {

        return activityRepo.findByUserId(userId)
                .stream()
                .map(a -> ActivityResponse.builder()
                        .id(a.getId())
                        .category(a.getCategory())
                        .activityType(a.getActivityType())
                        .quantity(a.getQuantity())
                        .unit(a.getUnit())
                        .co2e(a.getCo2e())
                        .build())
                .toList();
    }
}