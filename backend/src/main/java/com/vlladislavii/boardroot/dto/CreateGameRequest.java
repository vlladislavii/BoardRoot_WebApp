package com.vlladislavii.boardroot.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGameRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Genre is required")
    private String genre;

    private Integer minPlayers;
    private Integer maxPlayers;
    private String duration;
    private String complexity;
    private String designer;
    private Integer yearPublished;

    @NotNull(message = "Total copies is required")
    @Min(value = 1, message = "At least 1 copy is required")
    private Integer totalCopies;

    @NotNull(message = "Price per hour is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal pricePerHour;

    private String imageUrl;
    private String rulebookUrl;
}
