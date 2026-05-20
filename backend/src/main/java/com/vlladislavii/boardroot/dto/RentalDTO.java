package com.vlladislavii.boardroot.dto;

import com.vlladislavii.boardroot.model.GameRental;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long gameId;
    private String gameTitle;
    private String gameImageUrl;
    private LocalDate rentalDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private BigDecimal totalPrice;
    private boolean hasTableReservation;
    private TableReservationDTO tableReservation;
    private LocalDateTime createdAt;

    public static RentalDTO fromEntity(GameRental rental) {
        return RentalDTO.builder()
                .id(rental.getId())
                .userId(rental.getUser().getId())
                .userName(rental.getUser().getFirstName() + " " + rental.getUser().getLastName())
                .gameId(rental.getGame().getId())
                .gameTitle(rental.getGame().getTitle())
                .gameImageUrl(rental.getGame().getImageUrl())
                .rentalDate(rental.getRentalDate())
                .startTime(rental.getStartTime())
                .endTime(rental.getEndTime())
                .status(rental.getStatus().name())
                .totalPrice(rental.getTotalPrice())
                .hasTableReservation(rental.getTableReservation() != null)
                .tableReservation(rental.getTableReservation() != null
                        ? TableReservationDTO.fromEntity(rental.getTableReservation())
                        : null)
                .createdAt(rental.getCreatedAt())
                .build();
    }
}
