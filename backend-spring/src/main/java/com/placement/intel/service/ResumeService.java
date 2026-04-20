package com.placement.intel.service;

import com.placement.intel.model.Resume;
import com.placement.intel.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository resumeRepository;

    public Resume saveResume(@NonNull Resume resume) {
        return resumeRepository.save(resume);
    }

    public List<Resume> getResumesByUserId(UUID userId) {
        return resumeRepository.findByUserId(userId);
    }

    public void deleteResume(@NonNull UUID id) {
        resumeRepository.deleteById(id);
    }
}
