package com.vlladislavii.boardroot.service;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.exception.BusinessException;
import com.vlladislavii.boardroot.model.*;
import com.vlladislavii.boardroot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableReservationService {

    private final TableReservationRepository reservationRepository;
    private final ClubTableRepository tableRepository;
    private final UserRepository userRepository;

    private static final LocalTime OPENING_TIME = LocalTime.of(10, 0);
    private static final LocalTime CLOSING_TIME = LocalTime.of(20, 0);

    public List<TableReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(TableReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public TableReservationDTO getReservationById(Long id) {
        TableReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return TableReservationDTO.fromEntity(reservation);
    }

    public List<TableReservationDTO> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(TableReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TableReservationDTO> getReservationsByStatus(TableReservation.ReservationStatus status) {
        return reservationRepository.findByStatus(status).stream()
                .map(TableReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ClubTableDTO> getAllTables() {
        return tableRepository.findAll().stream()
                .map(ClubTableDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ClubTableDTO> getTablesByCapacity(Integer capacity) {
        return tableRepository.findByCapacityGreaterThanEqual(capacity).stream()
                .map(ClubTableDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get available tables for a specific date, time slot, and number of players.
     * Returns tables that have sufficient capacity and are not reserved during the requested time.
     */
    public List<ClubTableDTO> getAvailableTables(LocalDate date, LocalTime startTime, LocalTime endTime, Integer numberOfPlayers) {
        // Validate time slots
        if (startTime.isBefore(OPENING_TIME) || endTime.isAfter(CLOSING_TIME)) {
            throw new BusinessException("Time must be between 10:00 AM and 8:00 PM");
        }
        if (!startTime.isBefore(endTime)) {
            throw new BusinessException("Start time must be before end time");
        }

        // Get all tables with sufficient capacity
        List<ClubTable> suitableTables = tableRepository.findByCapacityGreaterThanEqual(numberOfPlayers);

        // Filter out tables that have overlapping reservations
        List<ClubTableDTO> availableTables = new ArrayList<>();
        for (ClubTable table : suitableTables) {
            if (isTableAvailable(table.getId(), date, startTime, endTime)) {
                availableTables.add(ClubTableDTO.fromEntity(table));
            }
        }

        return availableTables;
    }

    /**
     * Check if a specific table is available for a given date and time slot.
     */
    public boolean isTableAvailable(Long tableId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<TableReservation> overlapping = reservationRepository.findByDateAndTableId(date, tableId);

        for (TableReservation reservation : overlapping) {
            if (reservation.getStatus() == TableReservation.ReservationStatus.CANCELLED) {
                continue;
            }

            LocalTime reservationStart = reservation.getStartTime();
            LocalTime reservationEnd = reservationStart.plusHours(reservation.getDurationHours());

            // Check for overlap: (startA < endB) && (endA > startB)
            if (startTime.isBefore(reservationEnd) && endTime.isAfter(reservationStart)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Count available tables for a specific time slot.
     */
    public int countAvailableTables(LocalDate date, LocalTime startTime, LocalTime endTime, Integer numberOfPlayers) {
        return getAvailableTables(date, startTime, endTime, numberOfPlayers).size();
    }

    @Transactional
    public TableReservationDTO createReservation(Long userId, CreateTableReservationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // Validate capacity
        if (table.getCapacity() < request.getNumberOfPlayers()) {
            throw new BusinessException("Table capacity is insufficient for " + request.getNumberOfPlayers() + " players");
        }

        // Calculate end time
        LocalTime endTime = request.getStartTime().plusHours(request.getDurationHours());

        // Validate time slots
        if (request.getStartTime().isBefore(OPENING_TIME) || endTime.isAfter(CLOSING_TIME)) {
            throw new BusinessException("Reservation time must be between 10:00 AM and 8:00 PM");
        }

        // Check availability
        if (!isTableAvailable(table.getId(), request.getDate(), request.getStartTime(), endTime)) {
            throw new BusinessException("Table is not available during the requested time slot");
        }

        BigDecimal totalPrice = table.getHourlyRate().multiply(BigDecimal.valueOf(request.getDurationHours()));

        TableReservation reservation = TableReservation.builder()
                .user(user)
                .table(table)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .durationHours(request.getDurationHours())
                .numberOfPlayers(request.getNumberOfPlayers())
                .status(TableReservation.ReservationStatus.UPCOMING)
                .totalPrice(totalPrice)
                .build();

        TableReservation savedReservation = reservationRepository.save(reservation);
        return TableReservationDTO.fromEntity(savedReservation);
    }

    @Transactional
    public TableReservationDTO createReservationForRental(Long userId, CreateTableReservationRequest request, GameRental rental) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // Validate that rental time is within table reservation time
        LocalTime tableEndTime = request.getStartTime().plusHours(request.getDurationHours());
        if (rental.getStartTime().isBefore(request.getStartTime()) || rental.getEndTime().isAfter(tableEndTime)) {
            throw new BusinessException("Game rental time must be within the table reservation period");
        }

        // Check availability
        if (!isTableAvailable(table.getId(), request.getDate(), request.getStartTime(), tableEndTime)) {
            throw new BusinessException("Table is not available during the requested time slot");
        }

        BigDecimal totalPrice = table.getHourlyRate().multiply(BigDecimal.valueOf(request.getDurationHours()));

        TableReservation reservation = TableReservation.builder()
                .user(user)
                .table(table)
                .rental(rental)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .durationHours(request.getDurationHours())
                .numberOfPlayers(request.getNumberOfPlayers())
                .status(TableReservation.ReservationStatus.UPCOMING)
                .totalPrice(totalPrice)
                .build();

        TableReservation savedReservation = reservationRepository.save(reservation);
        return TableReservationDTO.fromEntity(savedReservation);
    }

    @Transactional
    public TableReservationDTO updateReservationStatus(Long id, String status) {
        TableReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(TableReservation.ReservationStatus.valueOf(status));
        TableReservation savedReservation = reservationRepository.save(reservation);
        return TableReservationDTO.fromEntity(savedReservation);
    }

    public Long countByStatus(TableReservation.ReservationStatus status) {
        return reservationRepository.countByStatus(status);
    }
}
