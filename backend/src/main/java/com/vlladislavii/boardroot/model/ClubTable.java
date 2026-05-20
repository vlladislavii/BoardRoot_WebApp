package com.vlladislavii.boardroot.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "club_tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TableReservation> reservations = new ArrayList<>();
}
