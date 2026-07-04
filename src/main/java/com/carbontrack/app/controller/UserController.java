package com.carbontrack.app.controller;

import com.carbontrack.app.dto.CreateUserRequest;
import com.carbontrack.app.dto.UpdateUserRequest;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.carbontrack.app.dto.UserResponse;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse saveUser(
            @Valid @RequestBody CreateUserRequest request) {

        return userService.saveUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully.";
    }
}