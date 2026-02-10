package com.trainme.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException() {
        super("Podany adres e-mail jest już zajęty");
    }
}
