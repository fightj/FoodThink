package com.ssafy.foodthink.global.exception;

public class NoExistsException extends RuntimeException{
    public NoExistsException(String message) {
        super(message);
    }
}