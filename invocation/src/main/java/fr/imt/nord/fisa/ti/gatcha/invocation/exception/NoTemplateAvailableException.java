package fr.imt.nord.fisa.ti.gatcha.invocation.exception;

/**
 * Exception levée lorsqu'aucun template de monstre n'est disponible.
 */
public class NoTemplateAvailableException extends RuntimeException {
    public NoTemplateAvailableException() {
        super("No monster templates available for invocation");
    }

    public NoTemplateAvailableException(String message) {
        super(message);
    }
}
