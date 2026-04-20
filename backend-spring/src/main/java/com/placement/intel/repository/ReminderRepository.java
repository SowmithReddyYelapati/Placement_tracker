package com.placement.intel.repository;

import com.placement.intel.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {
    List<Reminder> findByUserId(UUID userId);
    List<Reminder> findByApplicationId(UUID applicationId);
}
