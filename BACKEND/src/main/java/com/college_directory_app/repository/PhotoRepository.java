package com.college_directory_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college_directory_app.entity.Photo;
import java.util.List;



@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

	 Photo findByUserId(Long userId);
}
