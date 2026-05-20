package com.vlladislavii.boardroot.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTableReservationRequest {

    @NotNull(message = "Table ID is required")
    private Long tableId;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date must be today or in the future")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Minimum duration is 1 hour")
    @Max(value = 4, message = "Maximum duration is 4 hours")
    private Integer durationHours;

    @NotNull(message = "Number of players is required")
    @Min(value = 1, message = "At least 1 player is required")
    private Integer numberOfPlayers;
}
