package com.carbontrack.app.controller;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalProgressResponse;
import com.carbontrack.app.dto.response.GoalResponse;
import com.carbontrack.app.dto.response.GoalStatusResponse;
import com.carbontrack.app.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
@Tag(
        name = "Goal API",
        description = "APIs for Managing Carbon Reduction Goals"
)
public class GoalController {

    private final GoalService goalService;

    @Operation(summary = "Create a carbon reduction goal")
    @PostMapping
    public GoalResponse createGoal(@Valid @RequestBody GoalRequest request) {
        return goalService.createGoal(request);
    }

    @Operation(summary = "Get goals by user")
    @GetMapping("/user/{userId}")
    public List<GoalResponse> getGoalsByUser(@PathVariable Long userId) {
        return goalService.getGoalsByUser(userId);
    }

    @Operation(summary = "Update Goal")
    @PutMapping("/{goalId}")
    public GoalResponse updateGoal(
            @PathVariable Long goalId,
            @Valid @RequestBody GoalRequest request) {

        return goalService.updateGoal(goalId, request);
    }

    @Operation(summary = "Delete Goal")
    @DeleteMapping("/{goalId}")
    public void deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);
    }

    @Operation(summary = "Get Goal Progress")
    @GetMapping("/{goalId}/progress")
    public GoalProgressResponse getGoalProgress(
            @PathVariable Long goalId) {

        return goalService.getGoalProgress(goalId);
    }

    @Operation(summary = "Get Goal Status")
    @GetMapping("/{goalId}/status")
    public GoalStatusResponse getGoalStatus(
            @PathVariable Long goalId) {

        return goalService.getGoalStatus(goalId);
    }
}