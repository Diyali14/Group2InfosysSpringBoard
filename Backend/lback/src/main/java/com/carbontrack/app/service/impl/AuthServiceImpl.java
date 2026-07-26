package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.AuthResponse;
import com.carbontrack.app.dto.LoginRequest;
import com.carbontrack.app.dto.SignupRequest;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.InvalidCredentialsException;
import com.carbontrack.app.exception.UserAlreadyExistsException;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.security.JwtUtil;
import com.carbontrack.app.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider("LOCAL")
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmailOrUsername(
                        request.getEmailOrUsername(),
                        request.getEmailOrUsername()
                )
                .orElseThrow(() -> new InvalidCredentialsException(
                        "Invalid email/username or password"
                ));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new InvalidCredentialsException(
                    "Invalid email/username or password"
            );
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token);
    }
}
