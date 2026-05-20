package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.TableReservation;
import com.vlladislavii.boardroot.model.User;
import com.vlladislavii.boardroot.service.TableReservationService;
import com.vlladislavii.boardroot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Table Reservations", description = "APIs for managing table reservations")
public class TableReservationController {

    private final TableReservationService reservationService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all reservations", description = "Admin only - retrieves all table reservations")
    public ResponseEntity<ApiResponse<List<TableReservationDTO>>> getAllReservations() {
        List<TableReservationDTO> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by ID")
    public ResponseEntity<ApiResponse<TableReservationDTO>> getReservationById(@PathVariable Long id) {
        TableReservationDTO reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success(reservation));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my reservations", description = "Get all reservations for the authenticated user")
    public ResponseEntity<ApiResponse<List<TableReservationDTO>>> getMyReservations(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        List<TableReservationDTO> reservations = reservationService.getReservationsByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get reservations by status", description = "Admin only - filter reservations by status")
    public ResponseEntity<ApiResponse<List<TableReservationDTO>>> getReservationsByStatus(@PathVariable String status) {
        TableReservation.ReservationStatus reservationStatus = TableReservation.ReservationStatus.valueOf(status.toUpperCase());
        List<TableReservationDTO> reservations = reservationService.getReservationsByStatus(reservationStatus);
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/tables")
    @Operation(summary = "Get all tables", description = "Get all club tables")
    public ResponseEntity<ApiResponse<List<ClubTableDTO>>> getAllTables() {
        List<ClubTableDTO> tables = reservationService.getAllTables();
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/tables/capacity/{capacity}")
    @Operation(summary = "Get tables by capacity", description = "Get tables with capacity >= specified value")
    public ResponseEntity<ApiResponse<List<ClubTableDTO>>> getTablesByCapacity(@PathVariable Integer capacity) {
        List<ClubTableDTO> tables = reservationService.getTablesByCapacity(capacity);
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/tables/available")
    @Operation(summary = "Get available tables", description = "Get tables available for a specific date, time slot, and number of players")
    public ResponseEntity<ApiResponse<List<ClubTableDTO>>> getAvailableTables(
            @Parameter(description = "Date for reservation (YYYY-MM-DD)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Parameter(description = "Start time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @Parameter(description = "End time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @Parameter(description = "Number of players")
            @RequestParam Integer numberOfPlayers) {
        List<ClubTableDTO> tables = reservationService.getAvailableTables(date, startTime, endTime, numberOfPlayers);
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/tables/availability/count")
    @Operation(summary = "Count available tables", description = "Count how many tables are available for a specific time slot")
    public ResponseEntity<ApiResponse<Map<String, Object>>> countAvailableTables(
            @Parameter(description = "Date for reservation (YYYY-MM-DD)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Parameter(description = "Start time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @Parameter(description = "End time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @Parameter(description = "Number of players")
            @RequestParam Integer numberOfPlayers) {
        int count = reservationService.countAvailableTables(date, startTime, endTime, numberOfPlayers);
        Map<String, Object> result = Map.of(
                "date", date.toString(),
                "startTime", startTime.toString(),
                "endTime", endTime.toString(),
                "numberOfPlayers", numberOfPlayers,
                "availableTablesCount", count,
                "hasAvailability", count > 0
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/tables/{tableId}/check")
    @Operation(summary = "Check table availability", description = "Check if a specific table is available for a time slot")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkTableAvailability(
            @PathVariable Long tableId,
            @Parameter(description = "Date for reservation (YYYY-MM-DD)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Parameter(description = "Start time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @Parameter(description = "End time (HH:mm)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {
        boolean isAvailable = reservationService.isTableAvailable(tableId, date, startTime, endTime);
        Map<String, Object> result = Map.of(
                "tableId", tableId,
                "date", date.toString(),
                "startTime", startTime.toString(),
                "endTime", endTime.toString(),
                "isAvailable", isAvailable
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    @Operation(summary = "Create reservation", description = "Create a new table reservation")
    public ResponseEntity<ApiResponse<TableReservationDTO>> createReservation(
            Authentication authentication,
            @Valid @RequestBody CreateTableReservationRequest request) {
        User user = userService.findByEmail(authentication.getName());
        TableReservationDTO reservation = reservationService.createReservation(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Reservation created successfully", reservation));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update reservation status", description = "Admin only - update the status of a reservation")
    public ResponseEntity<ApiResponse<TableReservationDTO>> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        TableReservationDTO reservation = reservationService.updateReservationStatus(id, status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", reservation));
    }
}
