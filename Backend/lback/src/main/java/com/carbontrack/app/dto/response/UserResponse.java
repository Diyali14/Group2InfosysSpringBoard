package com.carbontrack.app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}