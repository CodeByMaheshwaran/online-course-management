package com.college_directory_app.service;


import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.entity.AdministratorProfile;
import com.college_directory_app.entity.Department;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.Photo;
import com.college_directory_app.entity.Role;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.entity.User;
import com.college_directory_app.enums.AppRole;
import com.college_directory_app.repository.AdminProfileRepository;
import com.college_directory_app.repository.DepartmentRepository;
import com.college_directory_app.repository.FacultyProfileRepository;
import com.college_directory_app.repository.RoleRepository;
import com.college_directory_app.repository.StudentProfileRepository;
import com.college_directory_app.repository.UsersRepository;

@Service
public class UserManagementService {

	@Autowired
	private UsersRepository userRepo;
	@Autowired
	private RoleRepository roleRepo;
	@Autowired
	private JwtUtils jwtUtils;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private PasswordEncoder passwordEncoder;

    @Autowired
    private StudentProfileRepository studentRepository; 
    @Autowired
    private FacultyProfileRepository facultyRepository; 
    @Autowired
    private AdminProfileRepository adminRepository;
    @Autowired
    private PhotoService photoService; 
    @Autowired
    private DepartmentRepository departmentRepository; 
    
    @Transactional(rollbackFor = Exception.class)
	public RequestResponse register(RequestResponse registrationRequest) {
		RequestResponse resp = new RequestResponse();
		System.out.println(registrationRequest);

		try {
			// Check for existing username
			if (userRepo.existsByUsername(registrationRequest.getUsername())) {
	            resp.setMessage("Username already exists. Please choose a different username.");
	            resp.setStatusCode(409); // HTTP Status Code 409 Conflict
	            return resp;
	        }

	        // Check for existing email
	        if (userRepo.existsByEmail(registrationRequest.getEmail())) {
	            resp.setMessage("Email already exists. Please use a different email.");
	            resp.setStatusCode(409); // HTTP Status Code 409 Conflict
	            return resp;
	        }

			
			
	        Role role = roleRepo.findByRoleName(AppRole.valueOf(registrationRequest.getRole()))
                    .orElseThrow(() -> new RuntimeException("Role not found"));


			
	        Long userId = registrationRequest.getUserId();

	        
	        Photo uploadedPhoto=null;
	        
	        if (registrationRequest.getPhoto() != null) {
	             uploadedPhoto  = photoService.uploadPhoto(registrationRequest.getPhoto(),userId);
	            
	        }
			
	        
			Department department;
	        Optional<Department> departmentOpt = departmentRepository.findByName(registrationRequest.getDepartment());
	        
	        if (departmentOpt.isPresent()) {
	            department = departmentOpt.get();
	        } else {
	            department = new Department();
	            department.setName(registrationRequest.getDepartment());
	            department = departmentRepository.save(department); // Save if new department
	        }

	
			
			if ("ROLE_STUDENT".equals(registrationRequest.getRole())) {
				
				
				StudentProfile studentProfile = new StudentProfile();
				
				studentProfile.setUsername(registrationRequest.getUsername());
				studentProfile.setName(registrationRequest.getName());
				studentProfile.setEmail(registrationRequest.getEmail());
				studentProfile.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
				studentProfile.setPhone(registrationRequest.getPhone());
				studentProfile.setRole(role);
		        studentProfile.setYear(registrationRequest.getYear());
		        studentProfile.setPhoto(uploadedPhoto); 
		        studentProfile.setDepartment(department); 
		        
		        
		        try {
		        	StudentProfile studentResult=studentRepository.save(studentProfile);
		            
		        	System.out.println(studentResult);
		        	if (studentResult != null && studentResult.getId() > 0) { 
		            	resp.setUsers(studentResult);
						resp.setRole(studentResult.getRole().getRoleName().toString());
						var jwt = jwtUtils.generateToken(studentResult);
		                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), studentResult); 
		    	        resp.setToken(jwt);
		    	        resp.setRefreshToken(refreshToken);
		    	        resp.setExpirationTime("24 hours");
						resp.setMessage("Student Registered Successfully");
						resp.setStatusCode(200);
		            } else {
		            	
		            	resp.setMessage("Student not saved");
		                resp.setStatusCode(400);
		            }
		        } catch (Exception e) {
		        	resp.setMessage("An error occurred while saving student details: " + e.getMessage());
		            resp.setStatusCode(500);
		        }

		       			   
			
			}else if ("ROLE_FACULTYMEMBER".equals(registrationRequest.getRole())) {
		        FacultyProfile facultyProfile = new FacultyProfile();
		        facultyProfile.setUsername(registrationRequest.getUsername());
		        facultyProfile.setName(registrationRequest.getName());
		        facultyProfile.setEmail(registrationRequest.getEmail());
		        facultyProfile.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
		        facultyProfile.setPhone(registrationRequest.getPhone());
		        facultyProfile.setRole(role);
		        facultyProfile.setDepartment(department); 
		        facultyProfile.setOfficeHours(registrationRequest.getOfficeHours()); 
		        facultyProfile.setPhoto(uploadedPhoto); 
		        
		        
		        try {
		        	FacultyProfile facultyResult=facultyRepository.save(facultyProfile);
		            if (facultyResult != null && facultyResult.getId() > 0) { 
		            	resp.setUsers(facultyResult);
						resp.setRole(facultyResult.getRole().getRoleName().toString());
						var jwt = jwtUtils.generateToken(facultyResult);
		                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), facultyResult); 
		    	        resp.setToken(jwt);
		    	        resp.setRefreshToken(refreshToken);
		    	        resp.setExpirationTime("24 hours");
						resp.setMessage("Faculty Registered Successfully");
						resp.setStatusCode(200);
		            } else {
		            	
		            	resp.setMessage("Faculty not saved");
		                resp.setStatusCode(400);
		            }
		        } catch (Exception e) {
		        	resp.setMessage("An error occurred while saving student details: " + e.getMessage());
		            resp.setStatusCode(500);
		        }
		    }else if("ROLE_ADMINISTRATOR".equals(registrationRequest.getRole())) {
		    	AdministratorProfile administratorProfile=new AdministratorProfile();
		    	administratorProfile.setUsername(registrationRequest.getUsername());
		    	administratorProfile.setName(registrationRequest.getName());
		    	administratorProfile.setEmail(registrationRequest.getEmail());
		    	administratorProfile.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
		    	administratorProfile.setPhone(registrationRequest.getPhone());
		    	administratorProfile.setRole(role);
		    	administratorProfile.setPhoto(uploadedPhoto);
		    	administratorProfile.setDepartment(department);
		    	
		    
		    	try {
		    		AdministratorProfile adminResults= adminRepository.save(administratorProfile);
		            if (adminResults != null && adminResults.getId() > 0) { 
		            	resp.setUsers(adminResults);
						resp.setRole(adminResults.getRole().getRoleName().toString());
						var jwt = jwtUtils.generateToken(adminResults);
		                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), adminResults); 
		    	        resp.setToken(jwt);
		    	        resp.setRefreshToken(refreshToken);
		    	        resp.setExpirationTime("24 hours");
						resp.setMessage("Admin Registered Successfully");
						resp.setStatusCode(200);
		            } else {
		            	
		            	resp.setMessage("Admin not saved");
		                resp.setStatusCode(400);
		            }
		        } catch (Exception e) {
		        	resp.setMessage("An error occurred while saving student details: " + e.getMessage());
		            resp.setStatusCode(500);
		        }
		    
		    }
			

		} catch (Exception e) {
			resp.setStatusCode(500);
			resp.setError(e.getMessage());
		}
		return resp;
	}

	public RequestResponse login(RequestResponse loginRequest) {
	    RequestResponse response = new RequestResponse();
	    try {
	        Authentication authentication = authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
	        var user = userRepo.findByUsername(loginRequest.getUsername())
	        		.orElseThrow();
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        
	        String userRole = authentication.getAuthorities().stream()
	                .map(grantedAuthority -> grantedAuthority.getAuthority())
	                .findFirst().orElse(null);
	        
	        Role role = roleRepo.findByRoleName(AppRole.valueOf(loginRequest.getRole()))
                    .orElseThrow(() -> new RuntimeException("Role not found"));
	        String roleName=role.getRoleName().toString();
	        	        
	        // Check for role mismatch
	        if (userRole != null && !userRole.equals(loginRequest.getRole())) {
	            response.setStatusCode(403);
	            response.setMessage("Role mismatch. Access denied.");
	            return response; // Exit early to avoid sending tokens
	        }
	        
	        // Proceed with successful login if roles match
	        response.setStatusCode(200);
	        
	        if (userRole.equals("ROLE_ADMINISTRATOR")) {
	            response.setMessage("Admin login successful. Redirect to admin home.");
	        } else if (userRole.equals("ROLE_FACULTYMEMBER")) {
	            response.setMessage("Faculty login successful. Redirect to admin home.");
	        } else if(userRole.equals("ROLE_STUDENT")){
	            response.setMessage("Student login successful. Redirect to admin home.");
	        }
	        
	        // Generate tokens only on successful login
	        var jwt = jwtUtils.generateToken(user);
	        var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
	        response.setRole(roleName);
	        response.setToken(jwt);
	        response.setRefreshToken(refreshToken);
	        response.setExpirationTime("24 hours");
	        
	    } catch (Exception e) {
	        if(e.getMessage().equals("No value present")) {
	        	response.setStatusCode(404);
	        	response.setMessage("User Not Found");
	        }
	        else {
	    	response.setStatusCode(500);
	        response.setMessage("An error occurred: " + e.getMessage());
	        }
	    }
	    return response;

	}

	public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
		RequestResponse response = new RequestResponse();
		try {
			String username = jwtUtils.extractUserName(refreshTokenRequest.getToken());
			User user = userRepo.findByUsername(username).orElseThrow();

			if (jwtUtils.isTokenVaild(refreshTokenRequest.getToken(), user)) {
				var jwt = jwtUtils.generateToken(user);
				response.setStatusCode(200);
				response.setToken(jwt);
				response.setRefreshToken(refreshTokenRequest.getToken());
				response.setExpirationTime("24hr");
				response.setMessage("Successfully Refreshed Token");
			}
			response.setStatusCode(200);
			return response;

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage(e.getMessage());
			return response;
		}

	}

	public RequestResponse getAllUser() {
		RequestResponse response = new RequestResponse();
		try {
			List<User> usersResult = userRepo.findAll();
			if (!usersResult.isEmpty()) {
				response.setUsersList(usersResult);
				response.setStatusCode(200);
				response.setMessage("Successful");
			} else {
				response.setStatusCode(404);
				response.setMessage("No users found");
			}
			return response;
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured" + e.getMessage());
			return response;
		}

	}

	public RequestResponse getUserById(Long userId) {
	    RequestResponse response = new RequestResponse();
	    try {
	        
	        User userById = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User Not Found"));

	        
	        response.setUsers(userById);
	        
	        
	        Role role = userById.getRole(); 
	        response.setRole(role.getRoleName().toString()); 
	        response.setStatusCode(200);
	        response.setMessage("User with userId '" + userId + "' found successfully.");

	    } catch (Exception e) {
	        response.setStatusCode(500);
	        response.setMessage("Error occurred: " + e.getMessage());
	    }
	    return response;
	}
	@Transactional(rollbackFor = Exception.class )
	public RequestResponse deleteUser(Integer userId) {
		RequestResponse response = new RequestResponse();
		try {
			Optional<User> userOptional = userRepo.findById(userId);
			if (userOptional.isPresent()) {
				userRepo.deleteById(userId);
				response.setStatusCode(200);
				response.setMessage("User Deleted Successfully");
			} else {
				response.setStatusCode(404);
				response.setMessage("User not Found.Unable to delete");
			}
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured while deleting user: " + e.getMessage());
		}
		return response;
	}
    @Transactional(rollbackFor = Exception.class )
	public RequestResponse updateProfile(Long userId, RequestResponse updateRequest) {
	    RequestResponse response = new RequestResponse();

	    try {
	        
	        User existingUser = userRepo.findById(userId)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Role role = roleRepo.findByRoleName(AppRole.valueOf(updateRequest.getRole()))
	                .orElseThrow(() -> new RuntimeException("Role not found"));

	        Photo uploadedPhoto = null;
	        if (updateRequest.getPhoto()!= null) {
	            uploadedPhoto = photoService.uploadPhoto(updateRequest.getPhoto(), userId);
	        }

	        Department department = null;
	        if (updateRequest.getDepartment() != null) {
	            Optional<Department> departmentOpt = departmentRepository.findByName(updateRequest.getDepartment());
	            if (departmentOpt.isPresent()) {
	                department = departmentOpt.get();
	            } else {
	                department = new Department();
	                department.setName(updateRequest.getDepartment());
	                department = departmentRepository.save(department); 
	            }
	        }

	        
	        if ("ROLE_STUDENT".equals(updateRequest.getRole())) {
	            StudentProfile existingStudent = studentRepository.findById(userId)
	                    .orElseThrow(() -> new RuntimeException("Student Not Found"));

	            if (updateRequest.getUsername() != null) existingStudent.setUsername(updateRequest.getUsername());
	            if (updateRequest.getName() != null) existingStudent.setName(updateRequest.getName());
	            if (updateRequest.getEmail() != null) existingStudent.setEmail(updateRequest.getEmail());
	            if (updateRequest.getPassword() != null) existingStudent.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
	            if (updateRequest.getPhone() != null) existingStudent.setPhone(updateRequest.getPhone());
	            if (updateRequest.getYear() != null) existingStudent.setYear(updateRequest.getYear());
	            if (uploadedPhoto != null) existingStudent.setPhoto(uploadedPhoto);
	            if (department != null) existingStudent.setDepartment(department);

	            try {
	                StudentProfile studentResult = studentRepository.save(existingStudent);
	                if (studentResult != null && studentResult.getId() > 0) {
	                    response.setUsers(studentResult);
	                    response.setRole(studentResult.getRole().getRoleName().toString());
	                    response.setMessage("Student Profile Updated Successfully");
	                    response.setStatusCode(200);
	                } else {
	                    response.setMessage("Student Profile not Updated");
	                    response.setStatusCode(400);
	                }
	            } catch (Exception e) {
	                response.setMessage("An error occurred while saving student details: " + e.getMessage());
	                response.setStatusCode(500);
	            }
	        } else if ("ROLE_FACULTYMEMBER".equals(updateRequest.getRole())) {
	            FacultyProfile existingFaculty = facultyRepository.findById(userId)
	                    .orElseThrow(() -> new RuntimeException("Faculty Not Found"));

	            if (updateRequest.getUsername() != null) existingFaculty.setUsername(updateRequest.getUsername());
	            if (updateRequest.getName() != null) existingFaculty.setName(updateRequest.getName());
	            if (updateRequest.getEmail() != null) existingFaculty.setEmail(updateRequest.getEmail());
	            if (updateRequest.getPassword() != null) existingFaculty.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
	            if (updateRequest.getPhone() != null) existingFaculty.setPhone(updateRequest.getPhone());
	            if (updateRequest.getOfficeHours() != null) existingFaculty.setOfficeHours(updateRequest.getOfficeHours());
	            if (uploadedPhoto != null) existingFaculty.setPhoto(uploadedPhoto);
	            if (department != null) existingFaculty.setDepartment(department);

	            try {
	                FacultyProfile facultyResult = facultyRepository.save(existingFaculty);
	                if (facultyResult != null && facultyResult.getId() > 0) {
	                    response.setUsers(facultyResult);
	                    response.setRole(facultyResult.getRole().getRoleName().toString());
	                    response.setMessage("Faculty Profile Updated Successfully");
	                    response.setStatusCode(200);
	                } else {
	                    response.setMessage("Faculty Profile not Updated");
	                    response.setStatusCode(400);
	                }
	            } catch (Exception e) {
	                response.setMessage("An error occurred while saving faculty details: " + e.getMessage());
	                response.setStatusCode(500);
	            }
	        } else if ("ROLE_ADMINISTRATOR".equals(updateRequest.getRole())) {
	            AdministratorProfile existingAdmin = adminRepository.findById(userId)
	                    .orElseThrow(() -> new RuntimeException("Administrator Not Found"));

	            if (updateRequest.getUsername() != null) existingAdmin.setUsername(updateRequest.getUsername());
	            if (updateRequest.getName() != null) existingAdmin.setName(updateRequest.getName());
	            if (updateRequest.getEmail() != null) existingAdmin.setEmail(updateRequest.getEmail());
	            if (updateRequest.getPassword() != null) existingAdmin.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
	            if (updateRequest.getPhone() != null) existingAdmin.setPhone(updateRequest.getPhone());
	            if (uploadedPhoto != null) existingAdmin.setPhoto(uploadedPhoto);
	            if (department != null) existingAdmin.setDepartment(department);

	            try {
	                AdministratorProfile adminResult = adminRepository.save(existingAdmin);
	                if (adminResult != null && adminResult.getId() > 0) {
	                    response.setUsers(adminResult);
	                    response.setRole(adminResult.getRole().getRoleName().toString());
	                    response.setMessage("Administrator Profile Updated Successfully");
	                    response.setStatusCode(200);
	                } else {
	                    response.setMessage("Administrator Profile not Updated");
	                    response.setStatusCode(400);
	                }
	            } catch (Exception e) {
	                response.setMessage("An error occurred while saving administrator details: " + e.getMessage());
	                response.setStatusCode(500);
	            }
	        }
	    } catch (Exception e) {
	        response.setStatusCode(500);
	        response.setMessage("Error occurred while updating profile: " + e.getMessage());
	    }

	    return response;
	}



	public RequestResponse getMyInfo(String username) {
	    RequestResponse response = new RequestResponse();

	    try {
	        Optional<User> userOptional = userRepo.findByUsername(username);

	        if (userOptional.isPresent()) {
	            User user = userOptional.get();
	            String role = user.getRole().getRoleName().toString();       
	            Optional<StudentProfile> studentDetails = null;
	            Optional<FacultyProfile> facultyDetails = null;
	            Optional<AdministratorProfile> adminDetails = null;

	            
	            switch (role) {
	                case "ROLE_STUDENT":
	                    studentDetails = studentRepository.findByUsername(username);
	                    
	                    if (studentDetails != null) {
	                        response.setStudent(studentDetails);
	                        response.setRole(role);
	                        response.setStatusCode(200);
	                        response.setMessage("User information retrieved successfully.");
	                    } else {
	                        response.setStatusCode(404);
	                        response.setMessage("Student details not found.");
	                    }
	                    break;

	                case "ROLE_FACULTYMEMBER":
	                    facultyDetails = facultyRepository.findByUsername(username);
	                    if (facultyDetails != null) {
	                        response.setFaculty(facultyDetails);
	                        response.setRole(role);
	                        response.setStatusCode(200);
	                        response.setMessage("User information retrieved successfully.");
	                    } else {
	                        response.setStatusCode(404);
	                        response.setMessage("Faculty details not found.");
	                    }
	                    break;

	                case "ROLE_ADMINISTRATOR":
	                    adminDetails = adminRepository.findByUsername(username);
	                    if (adminDetails != null) {
	                        response.setAdministrator(adminDetails);
	                        response.setRole(role);
	                        response.setStatusCode(200);
	                        response.setMessage("User information retrieved successfully.");
	                    } else {
	                        response.setStatusCode(404);
	                        response.setMessage("Administrator details not found.");
	                    }
	                    break;

	                default:
	                    response.setStatusCode(403);
	                    response.setMessage("Role not recognized.");
	                    break;
	            }
	        } else {
	            response.setStatusCode(404);
	            response.setMessage("User not found.");
	        }
	    } catch (Exception e) {
	        System.err.println("Error occurred while getting user info: " + e.getMessage());
	        response.setStatusCode(500);
	        response.setMessage("An error occurred while retrieving user information.");
	    }

	    return response;
	}

}
