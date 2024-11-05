package com.college_directory_app.service;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.college_directory_app.entity.AdministratorProfile;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.Photo;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.entity.User;
import com.college_directory_app.repository.AdminProfileRepository;
import com.college_directory_app.repository.FacultyProfileRepository;
import com.college_directory_app.repository.PhotoRepository;
import com.college_directory_app.repository.RoleRepository;
import com.college_directory_app.repository.StudentProfileRepository;
import com.college_directory_app.repository.UsersRepository;

@Service
public class PhotoService {
    @Autowired
    private PhotoRepository photoRepository;
    
    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private AdminProfileRepository adminProfileRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UsersRepository usersRepository;
    
    @Value("${upload.dir}")
    private String uploadDir;
  
    public Photo uploadPhoto(MultipartFile file, Long userId) throws IOException {
        // Create the upload directory if it does not exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file
        String filePath = uploadDir + File.separator + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        // Get or create the Photo entity
        Photo photo = photoRepository.findByUserId(userId);
        if (photo == null) {
            photo = new Photo();
            photo.setUserId(userId);  
        }

        // Update the URL path
        photo.setUrl("/uploads/" + file.getOriginalFilename());

        // Save the photo entity
        Photo uploadedPhoto = photoRepository.save(photo);

        // Fetch the User to determine the role
        User user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String roleName = user.getRole().getRoleName().toString();

        // Save photo to the appropriate profile based on the user's role
        if ("ROLE_STUDENT".equals(roleName)) {
            StudentProfile profile = studentProfileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Student profile not found"));
            profile.setPhoto(uploadedPhoto);
            studentProfileRepository.save(profile);
        } else if ("ROLE_FACULTYMEMBER".equals(roleName)) {
            FacultyProfile profile = facultyProfileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            profile.setPhoto(uploadedPhoto);
            facultyProfileRepository.save(profile);
        } else if ("ROLE_ADMINISTRATOR".equals(roleName)) {
            AdministratorProfile profile = adminProfileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Admin profile not found"));
            profile.setPhoto(uploadedPhoto);
            adminProfileRepository.save(profile);
        } else {
            throw new RuntimeException("Role not recognized for photo saving.");
        }

        return uploadedPhoto;
    }

}
