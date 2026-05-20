package com.vlladislavii.boardroot.service;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.exception.BusinessException;
import com.vlladislavii.boardroot.model.*;
import com.vlladislavii.boardroot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameRentalService {

    private static final LocalTime OPENING_TIME = LocalTime.of(10, 0);
    private static final LocalTime CLOSING_TIME = LocalTime.of(20, 0);

    private final GameRentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final BoardGameRepository gameRepository;
    private final BoardGameService gameService;
    private final TableReservationService tableReservationService;

    public List<RentalDTO> getAllRentals() {
        return rentalRepository.findAll().stream()
                .map(RentalDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public RentalDTO getRentalById(Long id) {
        GameRental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
        return RentalDTO.fromEntity(rental);
    }

    public List<RentalDTO> getRentalsByUserId(Long userId) {
        return rentalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(RentalDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RentalDTO> getRentalsByStatus(GameRental.RentalStatus status) {
        return rentalRepository.findByStatus(status).stream()
                .map(RentalDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RentalDTO createRental(Long userId, CreateRentalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BoardGame game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getAvailableCopies() <= 0) {
            throw new BusinessException("No copies available for this game");
        }

        // Validate time slots (10am - 8pm)
        validateTimeSlots(request.getStartTime(), request.getEndTime());

        // Calculate rental hours and price
        long rentalHours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        if (rentalHours <= 0) {
            throw new BusinessException("End time must be after start time");
        }
        BigDecimal totalPrice = game.getPricePerHour().multiply(BigDecimal.valueOf(rentalHours));

        GameRental rental = GameRental.builder()
                .user(user)
                .game(game)
                .rentalDate(request.getRentalDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(GameRental.RentalStatus.UPCOMING)
                .totalPrice(totalPrice)
                .build();

        GameRental savedRental = rentalRepository.save(rental);

        // Decrement available copies
        gameService.decrementAvailableCopies(game.getId());

        // Handle table reservation if requested
        if (Boolean.TRUE.equals(request.getAddTableReservation()) && request.getTableId() != null) {
            int durationHours = (int) rentalHours;
            CreateTableReservationRequest tableRequest = CreateTableReservationRequest.builder()
                    .tableId(request.getTableId())
                    .date(request.getRentalDate())
                    .startTime(request.getStartTime())
                    .durationHours(durationHours)
                    .numberOfPlayers(request.getNumberOfPlayers())
                    .build();

            tableReservationService.createReservationForRental(userId, tableRequest, savedRental);
        }

        return RentalDTO.fromEntity(savedRental);
    }

    private void validateTimeSlots(LocalTime startTime, LocalTime endTime) {
        if (startTime.isBefore(OPENING_TIME)) {
            throw new BusinessException("Start time cannot be before 10:00 AM");
        }
        if (endTime.isAfter(CLOSING_TIME)) {
            throw new BusinessException("End time cannot be after 8:00 PM");
        }
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BusinessException("Start time must be before end time");
        }
    }

    @Transactional
    public RentalDTO updateRentalStatus(Long id, String status) {
        GameRental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        GameRental.RentalStatus oldStatus = rental.getStatus();
        GameRental.RentalStatus newStatus = GameRental.RentalStatus.valueOf(status);

        rental.setStatus(newStatus);
        GameRental savedRental = rentalRepository.save(rental);

        // If completed or cancelled, return the copy
        if ((newStatus == GameRental.RentalStatus.COMPLETED || newStatus == GameRental.RentalStatus.CANCELLED)
                && oldStatus != GameRental.RentalStatus.COMPLETED && oldStatus != GameRental.RentalStatus.CANCELLED) {
            gameService.incrementAvailableCopies(rental.getGame().getId());
        }

        return RentalDTO.fromEntity(savedRental);
    }

    @Transactional
    public void checkAndUpdateOverdueRentals() {
        List<GameRental> overdueRentals = rentalRepository.findOverdueRentals(LocalDate.now(), LocalTime.now());
        for (GameRental rental : overdueRentals) {
            rental.setStatus(GameRental.RentalStatus.OVERDUE);
            rentalRepository.save(rental);
        }
    }

    public Long countByStatus(GameRental.RentalStatus status) {
        return rentalRepository.countByStatus(status);
    }
}
