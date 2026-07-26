package com.carbontrack.app.service;

import com.carbontrack.app.dto.CreateUserRequest;
import com.carbontrack.app.dto.UpdateUserRequest;
import com.carbontrack.app.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse saveUser(CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);
}