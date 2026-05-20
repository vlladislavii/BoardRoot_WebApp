package com.vlladislavii.boardroot.service;

import com.vlladislavii.boardroot.dto.PhotoDTO;
import com.vlladislavii.boardroot.model.Photo;
import com.vlladislavii.boardroot.model.User;
import com.vlladislavii.boardroot.repository.PhotoRepository;
import com.vlladislavii.boardroot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/photos/";

    public List<PhotoDTO> getPhotosByUserId(Long userId) {
        return photoRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                .map(PhotoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Stores an uploaded file on disk and returns its public URL.
     * Shared by gallery photo uploads and user avatar uploads.
     */
    public String storeFile(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return "/api/photos/files/" + filename;
    }

    @Transactional
    public PhotoDTO uploadPhoto(Long userId, MultipartFile file, String caption) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String url = storeFile(file);

        // Create photo record
        Photo photo = Photo.builder()
                .user(user)
                .url(url)
                .caption(caption)
                .build();

        Photo savedPhoto = photoRepository.save(photo);
        return PhotoDTO.fromEntity(savedPhoto);
    }

    @Transactional
    public PhotoDTO addPhotoUrl(Long userId, String url, String caption) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Photo photo = Photo.builder()
                .user(user)
                .url(url)
                .caption(caption)
                .build();

        Photo savedPhoto = photoRepository.save(photo);
        return PhotoDTO.fromEntity(savedPhoto);
    }

    @Transactional
    public void deletePhoto(Long userId, Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (!photo.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this photo");
        }

        // Delete file if it's a local upload
        if (photo.getUrl().startsWith("/api/photos/files/")) {
            String filename = photo.getUrl().substring("/api/photos/files/".length());
            try {
                Files.deleteIfExists(Paths.get(UPLOAD_DIR + filename));
            } catch (IOException e) {
                // Log error but continue with database deletion
            }
        }

        photoRepository.delete(photo);
    }
}
