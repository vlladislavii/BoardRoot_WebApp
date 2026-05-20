package com.vlladislavii.boardroot.repository;

import com.vlladislavii.boardroot.model.BoardGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BoardGameRepository extends JpaRepository<BoardGame, Long> {

    List<BoardGame> findByGenre(String genre);

    List<BoardGame> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT g FROM BoardGame g WHERE g.availableCopies > 0")
    List<BoardGame> findAvailableGames();

    @Query("SELECT g FROM BoardGame g WHERE g.availableCopies <= 1 AND g.availableCopies > 0")
    List<BoardGame> findLowStockGames();

    List<BoardGame> findByMinPlayersLessThanEqualAndMaxPlayersGreaterThanEqual(Integer players, Integer players2);
}
