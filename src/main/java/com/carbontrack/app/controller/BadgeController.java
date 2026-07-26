package com.carbontrack.app.controller;

import com.carbontrack.app.dto.request.BadgeRequest;
import com.carbontrack.app.dto.response.BadgeResponse;
import com.carbontrack.app.service.BadgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/badges")
@RequiredArgsConstructor
@Tag(
        name = "Badge API",
        description = "APIs for Managing User Badges"
)
public class BadgeController {

    private final BadgeService badgeService;

    @Operation(summary = "Assign badge to a user")
    @PostMapping
    public BadgeResponse addBadge(@Valid @RequestBody BadgeRequest request) {
        return badgeService.addBadge(request);
    }

    @Operation(summary = "Get badges earned by a user")
    @GetMapping("/user/{userId}")
    public List<BadgeResponse> getBadgesByUser(@PathVariable Long userId) {
        return badgeService.getBadgesByUser(userId);
    }
}