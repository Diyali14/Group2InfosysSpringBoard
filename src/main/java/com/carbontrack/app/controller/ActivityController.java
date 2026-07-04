package com.carbontrack.app.controller;

import com.carbontrack.app.dto.request.ActivityRequest;
import com.carbontrack.app.dto.response.ActivityResponse;
import com.carbontrack.app.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@Tag(
        name = "Activity API",
        description = "APIs for Managing User Activities"
)
public class ActivityController {

    private final ActivityService activityService;

    @Operation(summary = "Add a new activity")
    @PostMapping
    public ActivityResponse addActivity(@Valid @RequestBody ActivityRequest request) {
        return activityService.addActivity(request);
    }

    @Operation(summary = "Get all activities of a user")
    @GetMapping("/user/{userId}")
    public List<ActivityResponse> getActivitiesByUser(@PathVariable Long userId) {
        return activityService.getActivitiesByUser(userId);
    }
}