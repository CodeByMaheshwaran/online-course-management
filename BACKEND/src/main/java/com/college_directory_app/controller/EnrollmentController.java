package com.college_directory_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college_directory_app.dto.EnrollmentDTO;
import com.college_directory_app.entity.Enrollment;
import com.college_directory_app.service.EnrollmentService;

@RestController
@RequestMapping("/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/enrollment-trends")
    public ResponseEntity<List<EnrollmentDTO>> getEnrollmentTrends() {
        List<EnrollmentDTO> trends = enrollmentService.getEnrollmentTrends();
        return ResponseEntity.ok(trends);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Enrollment> registerEnrollment(@RequestBody Enrollment enrollment) {
        Enrollment savedEnrollment = enrollmentService.registerEnrollment(enrollment);
        return new ResponseEntity<>(savedEnrollment, HttpStatus.CREATED);
    }

}
