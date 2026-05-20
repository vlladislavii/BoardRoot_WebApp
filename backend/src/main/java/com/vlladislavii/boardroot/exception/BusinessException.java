package com.vlladislavii.boardroot.exception;

/**
 * Thrown when a request is well-formed but violates a business rule
 * (e.g. no copies available, table already booked, time outside opening hours).
 * Surfaced to the client as a 400 with the message intact.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
