package com.placement.intel.repository;

import com.placement.intel.model.Application;
import com.placement.intel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findAllByUser(User user);
    List<Application> findByUserId(UUID userId);
    List<Application> findByUserIdAndStatus(UUID userId, Application.ApplicationStatus status);
}
