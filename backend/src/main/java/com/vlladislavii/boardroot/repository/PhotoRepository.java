package com.vlladislavii.boardroot.repository;

import com.vlladislavii.boardroot.model.Photo;
import com.vlladislavii.boardroot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByUser(User user);

    List<Photo> findByUserId(Long userId);

    List<Photo> findByUserIdOrderByUploadedAtDesc(Long userId);
}
