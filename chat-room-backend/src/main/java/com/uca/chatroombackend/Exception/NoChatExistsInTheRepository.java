package com.uca.chatroombackend.Exception;

public class NoChatExistsInTheRepository extends Throwable {
    NoChatExistsInTheRepository(String message) {
        super(message);
    }
}
