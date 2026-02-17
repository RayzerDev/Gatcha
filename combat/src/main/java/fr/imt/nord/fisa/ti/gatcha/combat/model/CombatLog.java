package fr.imt.nord.fisa.ti.gatcha.combat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Log d'un tour de combat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CombatLog {
    private int turn;
    private UUID attackerId;
    private UUID defenderId;
    private int skillUsed;
    private int damageDealt;
    private int attackerHpRemaining;
    private int defenderHpRemaining;
    private String description;
}
