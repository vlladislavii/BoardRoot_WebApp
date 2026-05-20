package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.GameRental;
import com.vlladislavii.boardroot.model.TableReservation;
import com.vlladislavii.boardroot.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final BoardGameService gameService;
    private final GameRentalService rentalService;
    private final TableReservationService reservationService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Game stats
        List<BoardGameDTO> allGames = gameService.getAllGames();
        stats.put("totalGames", allGames.size());
        stats.put("lowStockGames", gameService.getLowStockGames().size());

        // Rental stats
        stats.put("activeRentals", rentalService.countByStatus(GameRental.RentalStatus.ACTIVE));
        stats.put("upcomingRentals", rentalService.countByStatus(GameRental.RentalStatus.UPCOMING));
        stats.put("overdueRentals", rentalService.countByStatus(GameRental.RentalStatus.OVERDUE));

        // Reservation stats
        stats.put("activeReservations", reservationService.countByStatus(TableReservation.ReservationStatus.ACTIVE));
        stats.put("upcomingReservations", reservationService.countByStatus(TableReservation.ReservationStatus.UPCOMING));

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllBookings() {
        Map<String, Object> bookings = new HashMap<>();
        bookings.put("rentals", rentalService.getAllRentals());
        bookings.put("reservations", reservationService.getAllReservations());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
