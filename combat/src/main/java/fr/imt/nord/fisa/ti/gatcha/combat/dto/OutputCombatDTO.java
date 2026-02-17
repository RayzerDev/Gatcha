package fr.imt.nord.fisa.ti.gatcha.combat.dto;

import fr.imt.nord.fisa.ti.gatcha.combat.model.Combat;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatMonsterSnapshot;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO de sortie contenant le résultat complet d'un combat avec les logs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutputCombatDTO {
    private UUID id;
    private String initiatorUsername;
    private CombatMonsterSnapshot monster1;
    private CombatMonsterSnapshot monster2;
    private UUID winnerId;
    private String winnerUsername;
    private CombatStatus status;
    private List<OutputCombatLogDTO> logs;
    private int totalTurns;
    private LocalDateTime createdAt;

    public static OutputCombatDTO fromEntity(Combat combat) {
        return OutputCombatDTO.builder()
                .id(combat.getId())
                .initiatorUsername(combat.getInitiatorUsername())
                .monster1(combat.getMonster1())
                .monster2(combat.getMonster2())
                .winnerId(combat.getWinnerId())
                .winnerUsername(combat.getWinnerUsername())
                .status(combat.getStatus())
                .logs(combat.getLogs().stream()
                        .map(OutputCombatLogDTO::fromEntity)
                        .toList())
                .totalTurns(combat.getTotalTurns())
                .createdAt(combat.getCreatedAt())
                .build();
    }
}
