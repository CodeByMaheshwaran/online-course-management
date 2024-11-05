package com.college_directory_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.User;


@Repository
public interface UsersRepository extends JpaRepository<User, Integer> {
Optional<User> findByEmail(String email);
Optional<User> findByUsername(String name);
boolean existsByUsername(String username);
boolean existsByEmail(String email);
Optional<User> findById(Long id);


}
