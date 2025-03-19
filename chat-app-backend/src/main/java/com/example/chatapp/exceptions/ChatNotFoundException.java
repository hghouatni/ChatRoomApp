package com.example.chatapp.exceptions;

public class ChatNotFoundException extends Throwable {
    public ChatNotFoundException(String message) {
        super(message);
    }
}
