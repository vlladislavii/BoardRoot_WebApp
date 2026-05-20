package com.vlladislavii.boardroot.repository;

import com.vlladislavii.boardroot.model.GameRental;
import com.vlladislavii.boardroot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface GameRentalRepository extends JpaRepository<GameRental, Long> {

    List<GameRental> findByUser(User user);

    List<GameRental> findByUserId(Long userId);

    List<GameRental> findByStatus(GameRental.RentalStatus status);

    @Query("SELECT r FROM GameRental r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<GameRental> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT r FROM GameRental r WHERE r.status = 'ACTIVE' AND " +
            "(r.rentalDate < :today OR (r.rentalDate = :today AND r.endTime < :currentTime))")
    List<GameRental> findOverdueRentals(@Param("today") LocalDate today, @Param("currentTime") LocalTime currentTime);

    @Query("SELECT COUNT(r) FROM GameRental r WHERE r.status = :status")
    Long countByStatus(@Param("status") GameRental.RentalStatus status);

    @Query("SELECT r FROM GameRental r WHERE r.game.id = :gameId AND r.rentalDate = :date AND r.status IN ('UPCOMING', 'ACTIVE')")
    List<GameRental> findByGameIdAndDate(@Param("gameId") Long gameId, @Param("date") LocalDate date);
}
