package com.carbontrack.app.controller;

import com.carbontrack.app.dto.request.GoalRequest;
import com.carbontrack.app.dto.response.GoalResponse;
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
}