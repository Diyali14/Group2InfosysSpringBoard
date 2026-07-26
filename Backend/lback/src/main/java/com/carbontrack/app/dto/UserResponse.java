package com.carbontrack.app.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String preferredUnit;

    private Boolean goalVisibility;

    private String provider;

    private String role;
}