package com.carbontrack.app.service;

import com.carbontrack.app.dto.AuthResponse;
import com.carbontrack.app.dto.LoginRequest;
import com.carbontrack.app.dto.SignupRequest;

public interface AuthService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);
}
