package com.trainme.exceptions;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException() {
        super("Token jest nieprawidłowy lub wygasł");
    }
}
