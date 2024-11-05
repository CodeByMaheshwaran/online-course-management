package com.college_directory_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.StudentProfile;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile,Long> {
    Optional<StudentProfile> findByUsername(String username);
    Optional<StudentProfile> findById(Long userId);
}
