package com.college_directory_app.dto;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.college_directory_app.entity.AdministratorProfile;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.GradeAndAttendance;
import com.college_directory_app.entity.Role;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class RequestResponse {

	private int statusCode;
	private String error;
	private String message;
	private String token;
	private String refreshToken;
	private String expirationTime;
	private Long userId;
	private String username;
	private String name;
	private String phone;
	private String role;
	private String email;
	private String password;
	private MultipartFile photo;
	private String department;
	private String year;
	private String officeHours;
	private User users;
	private List<User> usersList;
	private Optional<StudentProfile> student;
	private GradeAndAttendance studentAcademicDetails;
	private Optional<FacultyProfile> faculty;
	private Optional<AdministratorProfile> administrator;
	
}
