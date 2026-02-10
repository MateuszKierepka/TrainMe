package com.trainme.exceptions;

public class PhoneAlreadyExistsException extends RuntimeException {

    public PhoneAlreadyExistsException() {
        super("Podany numer telefonu jest już zajęty");
    }
}
