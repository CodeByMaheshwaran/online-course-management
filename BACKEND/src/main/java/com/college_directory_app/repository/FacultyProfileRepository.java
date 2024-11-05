package com.college_directory_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.FacultyProfile;
@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile,Long>{
	Optional<FacultyProfile> findById(Long id);

	Optional<FacultyProfile> findByUsername(String username);
}
