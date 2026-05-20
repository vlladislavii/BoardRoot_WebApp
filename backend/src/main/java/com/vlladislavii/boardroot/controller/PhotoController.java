package com.vlladislavii.boardroot.controller;

import com.vlladislavii.boardroot.dto.*;
import com.vlladislavii.boardroot.model.User;
import com.vlladislavii.boardroot.service.PhotoService;
import com.vlladislavii.boardroot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;
    private final UserService userService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PhotoDTO>>> getMyPhotos(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        List<PhotoDTO> photos = photoService.getPhotosByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(photos));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PhotoDTO>>> getPhotosByUserId(@PathVariable Long userId) {
        List<PhotoDTO> photos = photoService.getPhotosByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(photos));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<PhotoDTO>> uploadPhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption) throws IOException {
        User user = userService.findByEmail(authentication.getName());
        PhotoDTO photo = photoService.uploadPhoto(user.getId(), file, caption);
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded successfully", photo));
    }

    @PostMapping("/url")
    public ResponseEntity<ApiResponse<PhotoDTO>> addPhotoUrl(
            Authentication authentication,
            @RequestParam String url,
            @RequestParam(value = "caption", required = false) String caption) {
        User user = userService.findByEmail(authentication.getName());
        PhotoDTO photo = photoService.addPhotoUrl(user.getId(), url, caption);
        return ResponseEntity.ok(ApiResponse.success("Photo added successfully", photo));
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            Authentication authentication,
            @PathVariable Long photoId) {
        User user = userService.findByEmail(authentication.getName());
        photoService.deletePhoto(user.getId(), photoId);
        return ResponseEntity.ok(ApiResponse.success("Photo deleted successfully", null));
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/photos/").resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
