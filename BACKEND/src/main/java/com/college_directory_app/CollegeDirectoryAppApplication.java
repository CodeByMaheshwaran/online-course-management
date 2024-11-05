package com.college_directory_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class CollegeDirectoryAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeDirectoryAppApplication.class, args);
	}

}
