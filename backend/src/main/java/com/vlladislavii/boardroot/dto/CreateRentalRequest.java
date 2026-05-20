package com.vlladislavii.boardroot.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRentalRequest {

    @NotNull(message = "Game ID is required")
    private Long gameId;

    @NotNull(message = "Rental date is required")
    @FutureOrPresent(message = "Rental date must be today or in the future")
    private LocalDate rentalDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    // Optional table reservation
    private boolean addTableReservation;
    private Long tableId;
    private Integer numberOfPlayers;
}
