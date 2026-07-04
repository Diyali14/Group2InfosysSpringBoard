package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.ActivityRequest;
import com.carbontrack.app.dto.response.ActivityResponse;

import java.util.List;

public interface ActivityService {

    ActivityResponse addActivity(ActivityRequest request);

    List<ActivityResponse> getActivitiesByUser(Long userId);
}