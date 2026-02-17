package fr.imt.nord.fisa.ti.gatcha.combat.exception;

/**
 * Exception levée lorsqu'un combat est invalide (données manquantes ou incorrectes).
 */
public class InvalidCombatException extends RuntimeException {
    public InvalidCombatException(String message) {
        super(message);
    }
}
