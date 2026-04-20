package com.placement.intel.service;

import com.placement.intel.model.Application;
import com.placement.intel.model.User;
import com.placement.intel.repository.ApplicationRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;

    public List<Application> getApplicationsByUser(User user) {
        return applicationRepository.findAllByUser(user);
    }

    public Application saveApplication(@NonNull Application application) {
        return applicationRepository.save(application);
    }

    public Map<String, Long> getStatusDistribution(User user) {
        List<Application> apps = applicationRepository.findAllByUser(user);
        return apps.stream()
                .collect(Collectors.groupingBy(app -> app.getStatus().name(), Collectors.counting()));
    }
}
