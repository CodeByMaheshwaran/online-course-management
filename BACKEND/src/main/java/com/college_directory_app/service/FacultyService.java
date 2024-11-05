package com.college_directory_app.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.college_directory_app.dto.FacultyDTO;
import com.college_directory_app.dto.RequestResponse;
import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.Enrollment;
import com.college_directory_app.entity.FacultyProfile;
import com.college_directory_app.entity.StudentProfile;
import com.college_directory_app.repository.CourseRepository;
import com.college_directory_app.repository.EnrollmentRepository;
import com.college_directory_app.repository.FacultyProfileRepository;

@Service
public class FacultyService {

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public FacultyDTO getFacultyWithStudentsAndCourses(Long facultyId) {
        Optional<FacultyProfile> optionalFaculty = facultyProfileRepository.findById(facultyId);

        if (optionalFaculty.isPresent()) {
            FacultyProfile faculty = optionalFaculty.get();
            List<Course> courses = courseRepository.findCoursesByFacultyId(facultyId);
            List<Enrollment> enrollments = enrollmentRepository.findEnrollmentsByFacultyId(facultyId);

            // Extract students from enrollments
            List<StudentProfile> students = enrollments.stream()
                .map(Enrollment::getStudent)
                .distinct()
                .collect(Collectors.toList());

            
            FacultyDTO facultyDTO = new FacultyDTO();
            facultyDTO.setFacultyId(faculty.getId());
            facultyDTO.setName(faculty.getName()); 
            facultyDTO.setCourses(courses);
            facultyDTO.setStudents(students);
            
            return facultyDTO;
        }

        return null; 
    }

	public RequestResponse getMyInfo(String username) {
		RequestResponse response = new RequestResponse();
		try {
			Optional<FacultyProfile> FacultyOptional = facultyProfileRepository.findByUsername(username);
			if (FacultyOptional.isPresent()) {
				response.setUsers(FacultyOptional.get());
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
