package com.ssafy.foodthink.global.exception;

public class AleadyExistsException extends RuntimeException {
    public AleadyExistsException(String message) {
        super(message);
    }
}

