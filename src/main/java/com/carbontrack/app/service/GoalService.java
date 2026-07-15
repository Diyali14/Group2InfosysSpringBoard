package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalProgressResponse;
import com.carbontrack.app.dto.response.GoalResponse;
import com.carbontrack.app.dto.response.GoalStatusResponse;

import java.util.List;

public interface GoalService {

    GoalResponse createGoal(GoalRequest request);

    List<GoalResponse> getGoalsByUser(Long userId);

    GoalResponse updateGoal(Long goalId, GoalRequest request);

    void deleteGoal(Long goalId);

    GoalProgressResponse getGoalProgress(Long goalId);

    GoalStatusResponse getGoalStatus(Long goalId);

}