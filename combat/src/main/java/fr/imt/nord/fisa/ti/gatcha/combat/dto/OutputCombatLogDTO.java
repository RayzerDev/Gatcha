package fr.imt.nord.fisa.ti.gatcha.combat.dto;

import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO de sortie pour un log de tour de combat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutputCombatLogDTO {
    private int turn;
    private UUID attackerId;
    private UUID defenderId;
    private int skillUsed;
    private int damageDealt;
    private int attackerHpRemaining;
    private int defenderHpRemaining;
    private String description;

    public static OutputCombatLogDTO fromEntity(CombatLog log) {
        return OutputCombatLogDTO.builder()
                .turn(log.getTurn())
                .attackerId(log.getAttackerId())
                .defenderId(log.getDefenderId())
                .skillUsed(log.getSkillUsed())
                .damageDealt(log.getDamageDealt())
                .attackerHpRemaining(log.getAttackerHpRemaining())
                .defenderHpRemaining(log.getDefenderHpRemaining())
                .description(log.getDescription())
                .build();
    }
}
