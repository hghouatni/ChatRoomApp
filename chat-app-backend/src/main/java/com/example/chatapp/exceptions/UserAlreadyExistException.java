package com.example.chatapp.exceptions;

public class UserAlreadyExistException extends Throwable {

    UserAlreadyExistException(String message) {
        super(message);
    }
}
