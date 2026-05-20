package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.User;
import com.vlladislavii.boardroot.security.JwtTokenProvider;
import com.vlladislavii.boardroot.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userService.findByEmail(request.getEmail());
        UserDTO userDTO = UserDTO.fromEntity(user);

        AuthResponse authResponse = new AuthResponse(token, userDTO);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(UserDTO.fromEntity(user)));
    }
}
