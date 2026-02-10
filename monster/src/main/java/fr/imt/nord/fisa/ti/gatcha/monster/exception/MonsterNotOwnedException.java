package fr.imt.nord.fisa.ti.gatcha.monster.exception;

/**
 * Exception levée lorsqu'un joueur tente d'accéder à un monstre qui ne lui appartient pas.
 */
public class MonsterNotOwnedException extends RuntimeException {
    public MonsterNotOwnedException(String monsterId, String username) {
        super("Monster " + monsterId + " is not owned by " + username);
    }
}
