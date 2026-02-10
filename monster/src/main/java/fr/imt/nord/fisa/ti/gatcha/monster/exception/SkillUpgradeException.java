package fr.imt.nord.fisa.ti.gatcha.monster.exception;

/**
 * Exception levée lorsqu'une amélioration de compétence n'est pas possible.
 */
public class SkillUpgradeException extends RuntimeException {
    public SkillUpgradeException(String message) {
        super(message);
    }
}
