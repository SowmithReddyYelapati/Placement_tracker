package com.placement.intel.controller;

import com.placement.intel.model.Reminder;
import com.placement.intel.model.User;
import com.placement.intel.repository.UserRepository;
import com.placement.intel.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReminderController {
    private final ReminderService reminderService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Reminder>> getMyReminders(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Trigger auto-generation check whenever reminders are fetched
        reminderService.generateAutoReminders(user.getId());
        return ResponseEntity.ok(reminderService.getRemindersByUser(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@NonNull @PathVariable UUID id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }
}
