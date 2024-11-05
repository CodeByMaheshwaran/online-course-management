package com.college_directory_app.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college_directory_app.dto.FacultyDTO;
import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.service.FacultyService;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping("/{id}/students")
    public ResponseEntity<FacultyDTO> getFacultyWithStudentsAndCourses(@PathVariable("id") Long facultyId) {
    	return ResponseEntity.ok(facultyService.getFacultyWithStudentsAndCourses(facultyId));
    }
    @GetMapping("/get-profile")
	public ResponseEntity<RequestResponse> getMyProfile(){
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		System.out.println("Authentication "+authentication);
		String username=authentication.getName();
		System.out.println(username);
		RequestResponse response=facultyService.getMyInfo(username);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
}
