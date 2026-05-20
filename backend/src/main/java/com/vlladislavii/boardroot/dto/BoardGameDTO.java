package com.vlladislavii.boardroot.dto;

import com.vlladislavii.boardroot.model.BoardGame;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardGameDTO {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer minPlayers;
    private Integer maxPlayers;
    private String duration;
    private String complexity;
    private String designer;
    private Integer yearPublished;
    private Integer totalCopies;
    private Integer availableCopies;
    private BigDecimal pricePerHour;
    private String imageUrl;
    private String rulebookUrl;
    private Double rating;

    public static BoardGameDTO fromEntity(BoardGame game) {
        return BoardGameDTO.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .genre(game.getGenre())
                .minPlayers(game.getMinPlayers())
                .maxPlayers(game.getMaxPlayers())
                .duration(game.getDuration())
                .complexity(game.getComplexity())
                .designer(game.getDesigner())
                .yearPublished(game.getYearPublished())
                .totalCopies(game.getTotalCopies())
                .availableCopies(game.getAvailableCopies())
                .pricePerHour(game.getPricePerHour())
                .imageUrl(game.getImageUrl())
                .rulebookUrl(game.getRulebookUrl())
                .rating(game.getRating())
                .build();
    }
}
