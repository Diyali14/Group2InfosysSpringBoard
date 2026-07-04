package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.RegisterUserRequest;
import com.carbontrack.app.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse registerUser(RegisterUserRequest request);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();
}