package com.uca.chatroombackend.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow access to all endpoints
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedOrigins("http://localhost:80")
                .allowedOrigins("http://localhost")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
