package fr.imt.nord.fisa.ti.gatcha.monster.exception;

/**
 * Exception levée lorsqu'une valeur invalide est fournie.
 */
public class InvalidValueException extends RuntimeException {
    public InvalidValueException(String message) {
        super(message);
    }
}
