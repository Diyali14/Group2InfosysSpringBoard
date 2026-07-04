package com.carbontrack.app.controller;

import com.carbontrack.app.dto.AuthResponse;
import com.carbontrack.app.dto.LoginRequest;
import com.carbontrack.app.dto.SignupRequest;
import com.carbontrack.app.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@jakarta.validation.Valid
                               @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@jakarta.validation.Valid
                              @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
