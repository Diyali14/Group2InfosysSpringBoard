package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.CreateUserRequest;
import com.carbontrack.app.dto.UpdateUserRequest;
import com.carbontrack.app.dto.UserResponse;
import com.carbontrack.app.entity.User;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.mapper.UserMapper;
import com.carbontrack.app.repository.UserRepository;
import com.carbontrack.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse saveUser(CreateUserRequest request) {

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .preferredUnit(request.getPreferredUnit())
                .goalVisibility(request.getGoalVisibility())
                .provider("LOCAL")
                .role("USER")
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        return UserMapper.toResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id,
                                   UpdateUserRequest request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());


        existingUser.setEmail(request.getEmail());

        existingUser.setPreferredUnit(request.getPreferredUnit());
        existingUser.setGoalVisibility(request.getGoalVisibility());


        User updatedUser = userRepository.save(existingUser);

        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }

        userRepository.deleteById(id);
    }
}