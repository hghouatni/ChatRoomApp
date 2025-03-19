package com.example.chatapp.Controller;


import com.example.chatapp.Dto.AuthenticationRequest;
import com.example.chatapp.Dto.RegisterRequest;
import com.example.chatapp.Entity.User;
import com.example.chatapp.Repository.UserRepository;
import com.example.chatapp.Service.Authentication.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/authentication")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        return authenticationService.register(registerRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthenticationRequest authenticationRequest) {
        return authenticationService.authenticate(authenticationRequest);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getAuthenticatedUser(Principal principal) {
        if (principal != null) {
            String username = principal.getName();
            Optional<User> authenticatedUser = userRepository.findByEmail(username);

            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(401).body("User not authenticated");
        }
    }
}
