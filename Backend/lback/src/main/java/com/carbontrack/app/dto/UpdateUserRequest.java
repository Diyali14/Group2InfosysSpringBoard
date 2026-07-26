package com.carbontrack.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String preferredUnit;

    private Boolean goalVisibility;
}
