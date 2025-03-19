package com.example.chatapp.exceptions;

public class ChatAlreadyExistException extends Throwable {

    public ChatAlreadyExistException(String message) {
        super(message);
    }
}
