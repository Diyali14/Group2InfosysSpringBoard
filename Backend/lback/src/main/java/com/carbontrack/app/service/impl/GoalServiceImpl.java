package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalResponse;
import com.carbontrack.app.entity.Goal;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.GoalRepository;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    public GoalResponse createGoal(GoalRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Goal goal = Goal.builder()
                .user(user)
                .targetCo2e(request.getTargetCo2e())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status("ACTIVE")
                .build();

        Goal saved = goalRepository.save(goal);

        return GoalResponse.builder()
                .id(saved.getId())
                .targetCo2e(saved.getTargetCo2e())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .status(saved.getStatus())
                .build();
    }

    @Override
    public List<GoalResponse> getGoalsByUser(Long userId) {

        return goalRepository.findByUserId(userId)
                .stream()
                .map(g -> GoalResponse.builder()
                        .id(g.getId())
                        .targetCo2e(g.getTargetCo2e())
                        .startDate(g.getStartDate())
                        .endDate(g.getEndDate())
                        .status(g.getStatus())
                        .build())
                .toList();
    }
}