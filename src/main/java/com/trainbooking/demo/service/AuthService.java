package com.trainbooking.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trainbooking.demo.dto.LoginRequest;
import com.trainbooking.demo.dto.LoginResponse;
import com.trainbooking.demo.dto.SignupRequest;
import com.trainbooking.demo.model.User;
import com.trainbooking.demo.repository.UserRepository;
import com.trainbooking.demo.util.JwtUtil;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String signup(SignupRequest request) {

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return "Email already registered";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return "Signup Successful";
    }

    public LoginResponse login(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent() &&
                passwordEncoder.matches(request.getPassword(), userOptional.get().getPassword())) {

            User user = userOptional.get();
            String token = jwtUtil.generateToken(user.getEmail());

            return new LoginResponse(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    "Login Successful"
            );
        }

        return new LoginResponse(
                null,
                null,
                null,
                null,
                "Invalid Email or Password"
        );
    }
}