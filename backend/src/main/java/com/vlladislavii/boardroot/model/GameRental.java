package com.vlladislavii.boardroot.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_rentals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameRental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private BoardGame game;

    @Column(nullable = false)
    private LocalDate rentalDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.UPCOMING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @OneToOne(mappedBy = "rental", cascade = CascadeType.ALL, orphanRemoval = true)
    private TableReservation tableReservation;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RentalStatus {
        UPCOMING,
        ACTIVE,
        COMPLETED,
        CANCELLED,
        OVERDUE
    }
}
