package com.vlladislavii.boardroot.repository;

import com.vlladislavii.boardroot.model.TableReservation;
import com.vlladislavii.boardroot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {

    List<TableReservation> findByUser(User user);

    List<TableReservation> findByUserId(Long userId);

    List<TableReservation> findByStatus(TableReservation.ReservationStatus status);

    List<TableReservation> findByDate(LocalDate date);

    boolean existsByTableId(Long tableId);

    @Query("SELECT r FROM TableReservation r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<TableReservation> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM TableReservation r WHERE r.status = :status")
    Long countByStatus(@Param("status") TableReservation.ReservationStatus status);

    @Query("SELECT r FROM TableReservation r WHERE r.date = :date AND r.table.id = :tableId AND r.status != 'CANCELLED'")
    List<TableReservation> findByDateAndTableId(@Param("date") LocalDate date, @Param("tableId") Long tableId);

    // Find active reservations for a specific table on a specific date (overlap checking done in service)
    @Query("SELECT r FROM TableReservation r WHERE r.date = :date AND r.table.id = :tableId " +
            "AND r.status IN ('UPCOMING', 'ACTIVE')")
    List<TableReservation> findActiveReservationsByDateAndTableId(
            @Param("date") LocalDate date,
            @Param("tableId") Long tableId
    );

    // Find all reservations on a specific date (for checking availability)
    @Query("SELECT r FROM TableReservation r WHERE r.date = :date AND r.status IN ('UPCOMING', 'ACTIVE')")
    List<TableReservation> findActiveReservationsByDate(@Param("date") LocalDate date);
}
