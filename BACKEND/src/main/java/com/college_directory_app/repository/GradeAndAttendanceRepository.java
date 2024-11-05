package com.college_directory_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.GradeAndAttendance;
@Repository
public interface GradeAndAttendanceRepository extends JpaRepository<GradeAndAttendance, Long> {
    @Query("SELECT g FROM GradeAndAttendance g JOIN g.enrollment e WHERE e.student.id = :studentId")
    List<GradeAndAttendance> findByStudentId(@Param("studentId") Long studentId);
    List<GradeAndAttendance> findByEnrollmentStudentId(Long studentId);

}
