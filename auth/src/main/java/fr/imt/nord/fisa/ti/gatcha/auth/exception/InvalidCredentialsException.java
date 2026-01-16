package fr.imt.nord.fisa.ti.gatcha.auth.exception;

/**
 * Exception levée lorsque les identifiants de connexion sont invalides.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
