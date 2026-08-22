package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.request.BadgeRequest;
import com.carbontrack.app.dto.response.BadgeResponse;
import com.carbontrack.app.entity.Badge;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.BadgeRepository;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeServiceImpl implements BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;

    @Override
    public BadgeResponse addBadge(BadgeRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Badge badge = Badge.builder()
                .user(user)
                .badgeName(request.getBadgeName())
                .description(request.getDescription())
                .earnedDate(request.getEarnedDate())
                .build();

        Badge saved = badgeRepository.save(badge);

        return BadgeResponse.builder()
                .id(saved.getId())
                .badgeName(saved.getBadgeName())
                .description(saved.getDescription())
                .earnedDate(saved.getEarnedDate())
                .build();
    }

    @Override
    public List<BadgeResponse> getBadgesByUser(Long userId) {

        return badgeRepository.findByUserId(userId)
                .stream()
                .map(b -> BadgeResponse.builder()
                        .id(b.getId())
                        .badgeName(b.getBadgeName())
                        .description(b.getDescription())
                        .earnedDate(b.getEarnedDate())
                        .build())
                .toList();
    }
}