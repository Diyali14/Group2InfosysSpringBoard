package com.carbontrack.app.service;

import com.carbontrack.app.entity.User;

import java.util.List;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}