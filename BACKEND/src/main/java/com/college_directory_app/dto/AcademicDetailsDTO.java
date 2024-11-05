package com.college_directory_app.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicDetailsDTO {
 
	private String courseTitle;
    private String grade;
    private Integer attendance;
    
}
