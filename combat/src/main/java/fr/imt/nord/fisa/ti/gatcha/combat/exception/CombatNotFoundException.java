package fr.imt.nord.fisa.ti.gatcha.combat.exception;

/**
 * Exception levée lorsqu'un combat n'est pas trouvé.
 */
public class CombatNotFoundException extends RuntimeException {
    public CombatNotFoundException(String combatId) {
        super("Combat not found: " + combatId);
    }
}
