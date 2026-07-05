package com.carbontrack.app.controller;

import com.carbontrack.app.dto.CreateUserRequest;
import com.carbontrack.app.dto.UpdateUserRequest;
import com.carbontrack.app.dto.UserResponse;
import com.carbontrack.app.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(
        name = "User API",
        description = "APIs for User Management"
)
public class UserController {

    private final UserService userService;

    @Operation(summary = "Create a new user")
    @PostMapping
    public UserResponse saveUser(
            @Valid @RequestBody CreateUserRequest request) {

        return userService.saveUser(request);
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {

        return userService.getUserById(id);
    }

    @Operation(summary = "Update user")
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        return userService.updateUser(id, request);
    }

    @Operation(summary = "Delete user")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);
        return "User deleted successfully.";
    }
}