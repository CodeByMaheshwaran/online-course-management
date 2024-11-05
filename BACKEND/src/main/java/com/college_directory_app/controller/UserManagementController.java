package com.college_directory_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.service.UserManagementService;


@RestController
public class UserManagementController {
	@Autowired
	private UserManagementService userManagementService;

	@PostMapping("/admin/register")
	public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse register) {
		return ResponseEntity.ok(userManagementService.register(register));
	}

	@PostMapping("/auth/login")
	public ResponseEntity<RequestResponse> login(@RequestBody RequestResponse loginRequest) {
		return ResponseEntity.ok(userManagementService.login(loginRequest));
	}

	@PostMapping("/adminuser/refresh")
	public ResponseEntity<RequestResponse> refreshToken(@RequestBody RequestResponse refreshTokenRequest) {
		return ResponseEntity.ok(userManagementService.refreshToken(refreshTokenRequest));
	}

	@GetMapping("/admin/get-all-users")
	public ResponseEntity<RequestResponse> getAllUsers() {
		return ResponseEntity.ok(userManagementService.getAllUser());
	}

	@GetMapping("/admin/get-users/{userId}")
	public ResponseEntity<RequestResponse> getUserById(@PathVariable Long userId) {
		return ResponseEntity.ok(userManagementService.getUserById(userId));
	}

	@PutMapping("/admin-faculty/update/{userId}")
	public ResponseEntity<RequestResponse> updateUserById(@PathVariable Long userId,
			@RequestBody RequestResponse updateRequest) {
		return ResponseEntity.ok(userManagementService.updateProfile(userId, updateRequest));
	}
	@GetMapping("/adminuser/get-profile")
	public ResponseEntity<RequestResponse> getMyProfile(){
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		System.out.println("Authentication "+authentication);
		String username=authentication.getName();
		System.out.println(username);
		RequestResponse response=userManagementService.getMyInfo(username);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	@DeleteMapping("/admin/delete/{userId}")
	public ResponseEntity<RequestResponse> deleteUser(@PathVariable Integer userId) {
		return ResponseEntity.ok(userManagementService.deleteUser(userId));
	}
	
	
}
