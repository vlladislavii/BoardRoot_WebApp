package com.vlladislavii.boardroot.dto;

import com.vlladislavii.boardroot.model.TableReservation;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableReservationDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long tableId;
    private String tableName;
    private Integer tableCapacity;
    private LocalDate date;
    private LocalTime startTime;
    private Integer durationHours;
    private Integer numberOfPlayers;
    private String status;
    private BigDecimal totalPrice;
    private Long rentalId;
    private LocalDateTime createdAt;

    public static TableReservationDTO fromEntity(TableReservation reservation) {
        return TableReservationDTO.builder()
                .id(reservation.getId())
                .userId(reservation.getUser().getId())
                .userName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName())
                .tableId(reservation.getTable().getId())
                .tableName(reservation.getTable().getName())
                .tableCapacity(reservation.getTable().getCapacity())
                .date(reservation.getDate())
                .startTime(reservation.getStartTime())
                .durationHours(reservation.getDurationHours())
                .numberOfPlayers(reservation.getNumberOfPlayers())
                .status(reservation.getStatus().name())
                .totalPrice(reservation.getTotalPrice())
                .rentalId(reservation.getRental() != null ? reservation.getRental().getId() : null)
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
