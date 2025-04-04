package com.uca.chatroombackend.Exception;

public class UserAlreadyExistException extends Throwable {

    UserAlreadyExistException(String message) {
        super(message);
    }
}