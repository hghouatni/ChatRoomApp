package com.uca.chatroombackend.Controller;

import com.uca.chatroombackend.Service.Media.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            Path filePath = mediaService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType;

                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (fileName.endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (fileName.endsWith(".mp3")) {
                    contentType = "audio/mpeg";
                } else if (fileName.endsWith(".wav")) {
                    contentType = "audio/wav";
                } else if (fileName.endsWith(".ogg")) {
                    contentType = "audio/ogg";
                } else {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}