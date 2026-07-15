package com.carbontrack.app.service;

import com.carbontrack.app.dto.response.RecommendationResponse;

public interface RecommendationService {

    RecommendationResponse generateRecommendations(Long userId);

}