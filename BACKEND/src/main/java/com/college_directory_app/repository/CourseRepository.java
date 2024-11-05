package com.college_directory_app.repository;	

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course,Long> {
	@Query("SELECT c FROM Course c WHERE c.facultyProfile.id = :facultyId")
    List<Course> findCoursesByFacultyId(@Param("facultyId") Long facultyId);
}
