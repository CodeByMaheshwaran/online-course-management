package com.college_directory_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.Course;
import com.college_directory_app.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	
    @Query("SELECT e FROM Enrollment e JOIN e.course c WHERE c.facultyProfile.id = :facultyId")
    List<Enrollment> findEnrollmentsByFacultyId(@Param("facultyId") Long facultyId);
    List<Enrollment> findByStudentId(Long studentId);
    
    List<Enrollment> findAll();


}
