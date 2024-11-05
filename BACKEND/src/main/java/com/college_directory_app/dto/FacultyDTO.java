package com.college_directory_app.dto;



import java.util.List;

import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.StudentProfile;

import lombok.Data;

@Data
public class FacultyDTO {
    private Long facultyId;
    private String name; 
    private List<Course> courses;
    private List<StudentProfile> students;
}

