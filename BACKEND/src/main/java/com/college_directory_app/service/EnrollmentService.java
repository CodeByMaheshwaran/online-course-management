package com.college_directory_app.service;

import com.college_directory_app.dto.EnrollmentDTO;
import com.college_directory_app.entity.Enrollment;
import com.college_directory_app.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public List<EnrollmentDTO> getEnrollmentTrends() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();

        Map<String, Long> courseEnrollments = new HashMap<>();

        // Aggregate the number of enrollments per course
        for (Enrollment enrollment : enrollments) {
            String courseName = enrollment.getCourse().getTitle();
            courseEnrollments.put(courseName, courseEnrollments.getOrDefault(courseName, 0L) + 1);
        }

        // Convert to a list of DTOs
        return courseEnrollments.entrySet().stream()
                .map(entry -> new EnrollmentDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        		
    }
    
    public Enrollment registerEnrollment(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }
    

}
