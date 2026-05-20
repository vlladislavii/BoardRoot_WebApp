package com.vlladislavii.boardroot.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "board_games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String genre;

    private Integer minPlayers;

    private Integer maxPlayers;

    private String duration;

    private String complexity;

    private String designer;

    private Integer yearPublished;

    @Column(nullable = false)
    private Integer totalCopies;

    @Column(nullable = false)
    private Integer availableCopies;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    private String imageUrl;

    private String rulebookUrl;

    private Double rating;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @Builder.Default
    private List<GameRental> rentals = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (availableCopies == null) {
            availableCopies = totalCopies;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
