package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.GameRental;
import com.vlladislavii.boardroot.model.User;
import com.vlladislavii.boardroot.service.GameRentalService;
import com.vlladislavii.boardroot.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final GameRentalService rentalService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RentalDTO>>> getAllRentals() {
        List<RentalDTO> rentals = rentalService.getAllRentals();
        return ResponseEntity.ok(ApiResponse.success(rentals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RentalDTO>> getRentalById(@PathVariable Long id) {
        RentalDTO rental = rentalService.getRentalById(id);
        return ResponseEntity.ok(ApiResponse.success(rental));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RentalDTO>>> getMyRentals(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        List<RentalDTO> rentals = rentalService.getRentalsByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(rentals));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RentalDTO>>> getRentalsByUserId(@PathVariable Long userId) {
        List<RentalDTO> rentals = rentalService.getRentalsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(rentals));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RentalDTO>>> getRentalsByStatus(@PathVariable String status) {
        GameRental.RentalStatus rentalStatus = GameRental.RentalStatus.valueOf(status.toUpperCase());
        List<RentalDTO> rentals = rentalService.getRentalsByStatus(rentalStatus);
        return ResponseEntity.ok(ApiResponse.success(rentals));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RentalDTO>> createRental(
            Authentication authentication,
            @Valid @RequestBody CreateRentalRequest request) {
        User user = userService.findByEmail(authentication.getName());
        RentalDTO rental = rentalService.createRental(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Rental created successfully", rental));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RentalDTO>> updateRentalStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        RentalDTO rental = rentalService.updateRentalStatus(id, status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", rental));
    }
}
