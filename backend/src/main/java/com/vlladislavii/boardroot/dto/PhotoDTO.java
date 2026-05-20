package com.vlladislavii.boardroot.dto;

import com.vlladislavii.boardroot.model.Photo;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoDTO {
    private Long id;
    private Long userId;
    private String url;
    private String caption;
    private LocalDateTime uploadedAt;

    public static PhotoDTO fromEntity(Photo photo) {
        return PhotoDTO.builder()
                .id(photo.getId())
                .userId(photo.getUser().getId())
                .url(photo.getUrl())
                .caption(photo.getCaption())
                .uploadedAt(photo.getUploadedAt())
                .build();
    }
}
