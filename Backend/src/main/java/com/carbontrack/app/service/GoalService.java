package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalResponse;

import java.util.List;

public interface GoalService {

    GoalResponse createGoal(GoalRequest request);

    List<GoalResponse> getGoalsByUser(Long userId);
}