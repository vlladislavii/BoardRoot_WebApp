package com.vlladislavii.boardroot.repository;

import com.vlladislavii.boardroot.model.ClubTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubTableRepository extends JpaRepository<ClubTable, Long> {

    Optional<ClubTable> findByName(String name);

    List<ClubTable> findByCapacityGreaterThanEqual(Integer capacity);

    List<ClubTable> findByIsAvailableTrue();
}
