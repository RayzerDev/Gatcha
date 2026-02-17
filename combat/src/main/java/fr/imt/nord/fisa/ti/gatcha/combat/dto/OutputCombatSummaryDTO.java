package fr.imt.nord.fisa.ti.gatcha.combat.dto;

import fr.imt.nord.fisa.ti.gatcha.combat.model.Combat;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatStatus;
import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO résumé d'un combat pour l'historique (sans les logs détaillés).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutputCombatSummaryDTO {
    private UUID id;
    private String initiatorUsername;
    private UUID monster1Id;
    private ElementType monster1Element;
    private int monster1Level;
    private UUID monster2Id;
    private ElementType monster2Element;
    private int monster2Level;
    private UUID winnerId;
    private String winnerUsername;
    private CombatStatus status;
    private int totalTurns;
    private LocalDateTime createdAt;

    public static OutputCombatSummaryDTO fromEntity(Combat combat) {
        return OutputCombatSummaryDTO.builder()
                .id(combat.getId())
                .initiatorUsername(combat.getInitiatorUsername())
                .monster1Id(combat.getMonster1().getId())
                .monster1Element(combat.getMonster1().getElement())
                .monster1Level(combat.getMonster1().getLevel())
                .monster2Id(combat.getMonster2().getId())
                .monster2Element(combat.getMonster2().getElement())
                .monster2Level(combat.getMonster2().getLevel())
                .winnerId(combat.getWinnerId())
                .winnerUsername(combat.getWinnerUsername())
                .status(combat.getStatus())
                .totalTurns(combat.getTotalTurns())
                .createdAt(combat.getCreatedAt())
                .build();
    }
}
