package com.college_directory_app.dto;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.college_directory_app.entity.AdministratorProfile;
import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.GradeAndAttendance;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class EnrollmentDTO {
	
    private String courseName;
    private Long count; // Total number of enrollments for that course
}
