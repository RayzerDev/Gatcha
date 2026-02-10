package fr.imt.nord.fisa.ti.gatcha.monster.exception;

/**
 * Exception levée lorsqu'un monstre n'est pas trouvé.
 */
public class MonsterNotFoundException extends RuntimeException {
    public MonsterNotFoundException(String monsterId) {
        super("Monster not found: " + monsterId);
    }
}
