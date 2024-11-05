package com.college_directory_app.service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.dto.AcademicDetailsDTO;
import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.Enrollment;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.GradeAndAttendance;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.entity.User;
import com.college_directory_app.repository.EnrollmentRepository;
import com.college_directory_app.repository.GradeAndAttendanceRepository;
import com.college_directory_app.repository.StudentProfileRepository;


@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    @Autowired
    private GradeAndAttendanceRepository gradeAndAttendanceRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    
    public List<AcademicDetailsDTO> getCoursesWithGradesByStudentId(Long studentId) {
        List<GradeAndAttendance> gradeAndAttendanceList = gradeAndAttendanceRepository.findByEnrollmentStudentId(studentId);
        
        return gradeAndAttendanceList.stream()
                .map(g -> {
                    String courseTitle = (g.getEnrollment() != null && g.getEnrollment().getCourse() != null) ?
                            g.getEnrollment().getCourse().getTitle() : "Unknown Course"; // Handle potential nulls
                    return new AcademicDetailsDTO(
                            courseTitle,
                            g.getGrade(), 
                            g.getAttendance() 
                    );
                })
                .collect(Collectors.toList());
    }
    
    public Optional<StudentProfile> getStudentByUserName(String username){
    	return studentProfileRepository.findByUsername(username);
    }

    public Optional<StudentProfile> getStudentById(Long id) {
        return studentProfileRepository.findById(id);
    }
    
    public List<FacultyProfile> getFacultiesByStudentId(Long studentId) {
        // Fetch enrollments for the given student ID
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        // Extract unique faculty profiles from courses
        return enrollments.stream()
            .map(enrollment -> enrollment.getCourse().getFacultyProfile())
            .distinct() // To avoid duplicates if the student is enrolled in multiple courses by the same faculty
            .collect(Collectors.toList());
    }


	public RequestResponse getMyInfo(String username) {
		RequestResponse response = new RequestResponse();
		try {
			Optional<StudentProfile> studentOptional = studentProfileRepository.findByUsername(username);
			if (studentOptional.isPresent()) {
				response.setUsers(studentOptional.get());
				response.setStatusCode(200);
				response.setMessage("Successful");
			} else {
				response.setStatusCode(404);
				response.setMessage("User not found for update");
			}
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured while getting user Info : " + e.getMessage());

		}
		return response;
		}
}
