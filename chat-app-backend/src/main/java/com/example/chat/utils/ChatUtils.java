package com.example.chat.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ChatUtils {

    public ChatUtils(){

    }

    public static ResponseEntity<String> getResponeEntity(String responseMessage , HttpStatus httpStatus){
        return new ResponseEntity<String>("{\"message\":\""+responseMessage+"\"}", httpStatus);
    }

}
