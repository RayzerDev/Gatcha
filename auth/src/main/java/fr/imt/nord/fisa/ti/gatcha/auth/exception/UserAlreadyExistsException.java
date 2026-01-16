package fr.imt.nord.fisa.ti.gatcha.auth.exception;

/**
 * Exception levee lorsqu'on tente de creer un utilisateur avec un nom d'utilisateur deja existant.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("Username already exists: " + username);
    }
}
