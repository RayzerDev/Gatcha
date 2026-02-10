package fr.imt.nord.fisa.ti.gatcha.invocation.exception;

/**
 * Exception levée lorsqu'une invocation échoue.
 */
public class InvocationFailedException extends RuntimeException {
    public InvocationFailedException(String message) {
        super(message);
    }

    public InvocationFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
