package com.example.fitness.controller;

import com.example.fitness.model.User;
import com.example.fitness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        System.out.println("Registration request received");
        System.out.println("Registration data: " + user.toString());

        String email = user.getEmail();

        System.out.println("Attempting registration for email: " + email);

        if (userRepository.findByEmail(email) != null) {
            System.out.println("Email already registered: " + email);
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        try {
            userRepository.save(user);
            System.out.println("User registered successfully: " + email);
            return ResponseEntity.ok("Registration successful!");
        } catch (Exception e) {
            System.out.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        System.out.println("Login request received");
        System.out.println("Login request data: " + loginRequest.toString());

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        System.out.println("Attempting login for email: " + email);

        User user = userRepository.findByEmail(email);

        if (user != null) {
            System.out.println("User found: " + user.toString());
            System.out.println("Stored password: " + user.getPassword());
            System.out.println("Provided password: " + password);

            if (user.getPassword().equals(password)) {
                System.out.println("Login successful for user: " + email);
                return ResponseEntity.ok("Login successful!");
            } else {
                System.out.println("Password mismatch for user: " + email);
            }
        } else {
            System.out.println("User not found for email: " + email);
        }

        System.out.println("Login failed for email: " + email);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUser(@PathVariable String email) {
        System.out.println("GET request received for email: " + email);
        User user = userRepository.findByEmail(email);
        if (user != null) {
            System.out.println("User found: " + user.toString());
            return ResponseEntity.ok(user);
        }
        System.out.println("User not found for email: " + email);
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{email}")
    public ResponseEntity<User> updateUser(@PathVariable String email, @RequestBody User updatedUser) {
        System.out.println("PUT request received for email: " + email);
        System.out.println("Updated user data: " + updatedUser.toString());

        User user = userRepository.findByEmail(email);
        if (user != null) {
            System.out.println("User found: " + user.toString());
            // Update all profile fields, preserving email and password
            user.setName(updatedUser.getName());
            user.setAge(updatedUser.getAge());
            user.setHeight(updatedUser.getHeight());
            user.setWeight(updatedUser.getWeight());
            user.setGender(updatedUser.getGender());
            user.setFitnessGoal(updatedUser.getFitnessGoal());
            user.setActivityLevel(updatedUser.getActivityLevel());
            // Ensure email and password are preserved
            user.setEmail(email); // Preserve the original email
            // Password is already set, no need to change it
            userRepository.save(user);
            System.out.println("User updated successfully: " + user.toString());
            System.out.println("Returning updated user: " + user.toString());
            return ResponseEntity.ok(user);
        }
        System.out.println("User not found for email: " + email);
        return ResponseEntity.notFound().build();
    }
}
