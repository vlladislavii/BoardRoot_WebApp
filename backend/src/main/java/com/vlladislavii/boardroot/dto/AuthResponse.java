package com.vlladislavii.boardroot.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDTO user;

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
