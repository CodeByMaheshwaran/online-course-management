package com.college_directory_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.AdministratorProfile;
@Repository
public interface AdminProfileRepository extends JpaRepository<AdministratorProfile, Long> {

	Optional<AdministratorProfile> findByUsername(String username);

}
