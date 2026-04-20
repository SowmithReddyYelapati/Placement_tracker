package com.placement.intel.controller;

import com.placement.intel.model.Application;
import com.placement.intel.model.User;
import com.placement.intel.repository.UserRepository;
import com.placement.intel.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getApplications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(applicationService.getApplicationsByUser(user));
    }

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Application application, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        application.setUser(user);
        return ResponseEntity.ok(applicationService.saveApplication(application));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Map<String, Long> distribution = applicationService.getStatusDistribution(user);
        return ResponseEntity.ok(Map.of("statusDistribution", distribution));
    }
}
