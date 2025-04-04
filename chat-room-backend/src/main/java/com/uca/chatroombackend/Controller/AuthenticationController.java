package com.uca.chatroombackend.Controller;

import com.uca.chatroombackend.Dto.AuthenticationRequest;
import com.uca.chatroombackend.Dto.RegisterRequest;
import com.uca.chatroombackend.Entity.User;
import com.uca.chatroombackend.Repository.UserRepository;
import com.uca.chatroombackend.Service.Authentication.AuthenticationService;
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
