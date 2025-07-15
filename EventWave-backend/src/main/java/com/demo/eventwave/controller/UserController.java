package com.demo.eventwave.controller;

import com.demo.eventwave.dto.UserDTO;

import com.demo.eventwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // 👁️ View logged-in user details
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ORGANIZER')")
    public ResponseEntity<UserDTO> getLoggedInUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserDetails(userDetails.getUsername()));
    }

    // ✏️ Update logged-in user details (email or password)
    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('USER', 'ORGANIZER')")
    public ResponseEntity<String> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDTO updatedUser) {

        userService.updateUserDetails(userDetails.getUsername(), updatedUser);
        return ResponseEntity.ok("User details updated successfully.");
    }
}
