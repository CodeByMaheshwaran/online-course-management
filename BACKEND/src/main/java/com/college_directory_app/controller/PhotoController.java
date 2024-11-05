package com.college_directory_app.controller;

import com.college_directory_app.entity.Photo;
import com.college_directory_app.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/profile-photo")
public class PhotoController {
    @Autowired
    private PhotoService photoService;

    @PostMapping("/upload")
    public ResponseEntity<Photo> uploadPhoto(@RequestParam("file") MultipartFile file, 
    		                                 @RequestParam("userId") Long userId) {
        try {
            Photo photo = photoService.uploadPhoto(file,userId);
            return ResponseEntity.ok(photo);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // Handle error
        }
    }
}
