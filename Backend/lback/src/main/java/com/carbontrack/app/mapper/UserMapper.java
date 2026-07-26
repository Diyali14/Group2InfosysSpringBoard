package com.carbontrack.app.mapper;

import com.carbontrack.app.dto.UserResponse;
import com.carbontrack.app.entity.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .preferredUnit(user.getPreferredUnit())
                .goalVisibility(user.getGoalVisibility())
                .provider(user.getProvider())
                .role(user.getRole())
                .build();
    }

}