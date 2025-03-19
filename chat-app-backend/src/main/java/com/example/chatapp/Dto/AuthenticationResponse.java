package com.example.chatapp.Dto;

import com.example.chatapp.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String id;
    private String access_token;
    private String email;
    private Role role;

}