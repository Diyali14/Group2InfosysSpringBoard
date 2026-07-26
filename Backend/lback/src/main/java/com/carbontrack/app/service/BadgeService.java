package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.BadgeRequest;
import com.carbontrack.app.dto.response.BadgeResponse;

import java.util.List;

public interface BadgeService {

    BadgeResponse addBadge(BadgeRequest request);

    List<BadgeResponse> getBadgesByUser(Long userId);
}