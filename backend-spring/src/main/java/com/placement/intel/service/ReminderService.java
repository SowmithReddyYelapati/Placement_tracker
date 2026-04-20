package com.placement.intel.service;

import com.placement.intel.model.Application;
import com.placement.intel.model.Reminder;
import com.placement.intel.repository.ApplicationRepository;
import com.placement.intel.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final ReminderRepository reminderRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    @SuppressWarnings("null")
    public void generateAutoReminders(UUID userId) {
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(5);
        List<Application> pendingApplications = applicationRepository.findByUserIdAndStatus(userId, Application.ApplicationStatus.Applied);

        for (Application app : pendingApplications) {
            if (app.getAppliedDate().isBefore(fiveDaysAgo)) {
                // Check if a reminder already exists for this application
                boolean exists = !reminderRepository.findByApplicationId(app.getId()).isEmpty();
                if (!exists) {
                    Reminder reminder = Reminder.builder()
                            .message("It's been 5 days since you applied to " + app.getCompany().getName() + ". Consider following up!")
                            .reminderDate(LocalDateTime.now())
                            .user(app.getUser())
                            .application(app)
                            .build();
                    reminderRepository.save(reminder);
                }
            }
        }
    }

    public List<Reminder> getRemindersByUser(UUID userId) {
        return reminderRepository.findByUserId(userId);
    }

    public void deleteReminder(@NonNull UUID id) {
        reminderRepository.deleteById(id);
    }
}
