package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalProgressResponse;
import com.carbontrack.app.dto.response.GoalResponse;
import com.carbontrack.app.dto.response.GoalStatusResponse;
import com.carbontrack.app.entity.Goal;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.GoalRepository;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import com.carbontrack.app.repository.ActivityLogRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    @Override
    public GoalResponse createGoal(GoalRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Goal goal = Goal.builder()
                .user(user)
                .targetCo2e(request.getTargetCo2e())
                .targetReductionPercentage(request.getTargetReductionPercentage())
                .currentProgress(0.0)
                .onTrack(true)
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
                .targetReductionPercentage(saved.getTargetReductionPercentage())
                .currentProgress(saved.getCurrentProgress())
                .onTrack(saved.getOnTrack())
                .build();
    }

    @Override
    public List<GoalResponse> getGoalsByUser(Long userId) {

        return goalRepository.findByUserId(userId)
                .stream()
                .map(g -> GoalResponse.builder()
                        .id(g.getId())
                        .targetCo2e(g.getTargetCo2e())
                        .targetReductionPercentage(g.getTargetReductionPercentage())
                        .currentProgress(g.getCurrentProgress())
                        .onTrack(g.getOnTrack())
                        .startDate(g.getStartDate())
                        .endDate(g.getEndDate())
                        .status(g.getStatus())
                        .build())
                .toList();
    }


    @Override
    public GoalResponse updateGoal(Long goalId, GoalRequest request) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found with id : " + goalId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        goal.setUser(user);
        goal.setTargetCo2e(request.getTargetCo2e());
        goal.setStartDate(request.getStartDate());
        goal.setEndDate(request.getEndDate());
        goal.setTargetReductionPercentage(request.getTargetReductionPercentage());

        Goal updated = goalRepository.save(goal);

        return GoalResponse.builder()
                .id(updated.getId())
                .targetCo2e(updated.getTargetCo2e())
                .targetReductionPercentage(updated.getTargetReductionPercentage())
                .currentProgress(updated.getCurrentProgress())
                .onTrack(updated.getOnTrack())
                .startDate(updated.getStartDate())
                .endDate(updated.getEndDate())
                .status(updated.getStatus())
                .build();
    }

    @Override
    public void deleteGoal(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found with id : " + goalId));

        goalRepository.delete(goal);
    }

    @Override
    public GoalProgressResponse getGoalProgress(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found with id : " + goalId));

        LocalDate today = LocalDate.now();

        // Goal duration
        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(
                goal.getStartDate(),
                goal.getEndDate()
        );

        if (totalDays <= 0) {
            totalDays = 1;
        }

        // Days completed
        long completedDays = java.time.temporal.ChronoUnit.DAYS.between(
                goal.getStartDate(),
                today
        );

        if (completedDays < 0) {
            completedDays = 0;
        }

        if (completedDays > totalDays) {
            completedDays = totalDays;
        }

        Double currentEmission = activityLogRepository.getEmissionBetweenDates(
                goal.getUser().getId(),
                goal.getStartDate(),
                today.isAfter(goal.getEndDate()) ? goal.getEndDate() : today
        );

        if (currentEmission == null) {
            currentEmission = 0.0;
        }

        // Actual Progress
        double actualProgress =
                ((goal.getTargetCo2e() - currentEmission) / goal.getTargetCo2e()) * 100;

        if (actualProgress < 0) {
            actualProgress = 0;
        }

        // Expected Progress till today
        double expectedProgress =
                (goal.getTargetReductionPercentage() * completedDays) / totalDays;

        boolean onTrack = actualProgress >= expectedProgress;

        goal.setCurrentProgress(actualProgress);
        goal.setOnTrack(onTrack);

        goalRepository.save(goal);

        return GoalProgressResponse.builder()
                .goalId(goal.getId())
                .targetCo2e(goal.getTargetCo2e())
                .targetReductionPercentage(goal.getTargetReductionPercentage())
                .currentProgress(actualProgress)
                .onTrack(onTrack)
                .status(goal.getStatus())
                .build();
    }

    @Override
    public GoalStatusResponse getGoalStatus(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found with id : " + goalId));

        String status;
        String message;

        if (Boolean.TRUE.equals(goal.getOnTrack())) {

            status = "ON_TRACK";
            message = "Great job! You are on track to achieve your goal.";

        } else {

            status = "BEHIND";
            message = "Your progress is behind schedule. Try reducing your emissions this week.";
        }

        return GoalStatusResponse.builder()
                .goalId(goal.getId())
                .status(status)
                .onTrack(goal.getOnTrack())
                .message(message)
                .build();
    }
}