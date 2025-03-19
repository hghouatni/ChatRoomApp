package com.example.chatapp.exceptions;

public class NoChatExistsInTheRepository extends Throwable {
    NoChatExistsInTheRepository(String message) {
        super(message);
    }
}
