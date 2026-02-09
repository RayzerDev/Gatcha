package fr.imt.nord.fisa.ti.gatcha.common.exception;

import lombok.Getter;

/**
 * Exception levée lors d'une erreur de communication avec un service externe.
 */
@Getter
public class ServiceCommunicationException extends RuntimeException {
    private final int statusCode;

    public ServiceCommunicationException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public ServiceCommunicationException(String message, int statusCode, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
    }
}
