package com.college_directory_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.Role;
import com.college_directory_app.enums.AppRole;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
Optional<Role>findByRoleName(AppRole roleName);
}
