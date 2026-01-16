package fr.imt.nord.fisa.ti.gatcha.auth.exception;

/**
 * Exception levée lorsqu'un token n'est pas trouvé en base de données.
 */
public class TokenNotFoundException extends Exception {
    public TokenNotFoundException() {
        super("Token not found or invalid");
    }

    public TokenNotFoundException(String message) {
        super(message);
    }
}
