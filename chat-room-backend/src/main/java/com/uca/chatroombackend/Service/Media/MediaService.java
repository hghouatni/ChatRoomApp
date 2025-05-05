package com.uca.chatroombackend.Service.Media;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8090}")
    private String baseUrl;

    /**
     * Store a file and return its URL
     */
    public String storeFile(MultipartFile file, String type) throws IOException {
        // Create the upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique file name to prevent conflicts
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } else {
            // If no extension, assign one based on the media type
            if ("image".equals(type)) {
                fileExtension = ".jpg";
            } else if ("audio".equals(type)) {
                fileExtension = ".mp3";
            }
        }

        String fileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(fileName);

        // Copy the file to the target location
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the URL to access the file
        return baseUrl + "/api/media/" + fileName;
    }

    /**
     * Get a file by its name
     */
    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir).resolve(fileName);
    }

    /**
     * Check if a file exists
     */
    public boolean fileExists(String fileName) {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        return Files.exists(filePath);
    }

    /**
     * Delete a file
     */
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        }
    }
}
