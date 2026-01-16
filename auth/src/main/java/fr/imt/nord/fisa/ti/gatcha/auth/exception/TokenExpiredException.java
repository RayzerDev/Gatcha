package fr.imt.nord.fisa.ti.gatcha.auth.exception;

/**
 * Exception levée lorsqu'un token a expiré.
 */
public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException() {
        super("Token expired or invalid. Please authenticate again.");
    }

    public TokenExpiredException(String message) {
        super(message);
    }
}
