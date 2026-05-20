package com.vlladislavii.boardroot.dto;

import com.vlladislavii.boardroot.model.ClubTable;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubTableDTO {
    private Long id;
    private String name;
    private String description;
    private Integer capacity;
    private BigDecimal hourlyRate;
    private Boolean isAvailable;

    public static ClubTableDTO fromEntity(ClubTable table) {
        return ClubTableDTO.builder()
                .id(table.getId())
                .name(table.getName())
                .description(table.getDescription())
                .capacity(table.getCapacity())
                .hourlyRate(table.getHourlyRate())
                .isAvailable(table.getIsAvailable())
                .build();
    }
}
