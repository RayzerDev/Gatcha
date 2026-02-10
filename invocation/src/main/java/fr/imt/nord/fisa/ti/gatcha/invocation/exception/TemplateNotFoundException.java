package fr.imt.nord.fisa.ti.gatcha.invocation.exception;

/**
 * Exception levée lorsqu'un template de monstre n'est pas trouvé.
 */
public class TemplateNotFoundException extends RuntimeException {
    public TemplateNotFoundException(int templateId) {
        super("Template not found: " + templateId);
    }
}
