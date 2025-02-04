package com.ssafy.foodthink.global.exception;

import io.jsonwebtoken.ExpiredJwtException;

public class InvalidTokenException extends ExpiredJwtException {
    public InvalidTokenException(String message) {
        super(null, null, message);
    }
}


