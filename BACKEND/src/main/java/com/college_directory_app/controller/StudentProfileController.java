package com.college_directory_app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.service.StudentProfileService;


@RestController	
@RequestMapping("/students")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    
    
    
    @GetMapping("/id/{id}")
    public ResponseEntity<StudentProfile> getStudentById(@PathVariable Long id) {
        Optional<StudentProfile> studentProfile = studentProfileService.getStudentById(id);
        return studentProfile.map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<StudentProfile> getStudentByUserName(@PathVariable String username) {
        Optional<StudentProfile> studentProfile = studentProfileService.getStudentByUserName(username);
        return studentProfile.map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{studentId}/faculties")
    public ResponseEntity<List<FacultyProfile>> getFacultiesByStudentId(@PathVariable Long studentId) {
        List<FacultyProfile> faculties = studentProfileService.getFacultiesByStudentId(studentId);
        return ResponseEntity.ok(faculties);
    }

    
    @GetMapping("/{studentId}/courses/grades")
    public List<AcademicDetailsDTO> getCoursesWithGrades(@PathVariable Long studentId) {
        return studentProfileService.getCoursesWithGradesByStudentId(studentId);
    }
    

    @GetMapping("/get-profile")
	public ResponseEntity<RequestResponse> getMyProfile(){
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		System.out.println("Authentication "+authentication);
		String username=authentication.getName();
		System.out.println(username);
		RequestResponse response=studentProfileService.getMyInfo(username);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
    
}
