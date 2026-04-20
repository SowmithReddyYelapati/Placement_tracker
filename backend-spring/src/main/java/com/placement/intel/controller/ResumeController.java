package com.placement.intel.controller;

import com.placement.intel.model.Resume;
import com.placement.intel.model.User;
import com.placement.intel.repository.UserRepository;
import com.placement.intel.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {
    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Resume>> getUserResumes(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(resumeService.getResumesByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Resume> uploadResume(@RequestBody Resume resume, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        resume.setUser(user);
        return ResponseEntity.ok(resumeService.saveResume(resume));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@NonNull @PathVariable UUID id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}
