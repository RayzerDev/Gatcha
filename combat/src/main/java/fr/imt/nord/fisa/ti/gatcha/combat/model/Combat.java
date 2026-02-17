package fr.imt.nord.fisa.ti.gatcha.combat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Document MongoDB représentant un combat entre deux monstres.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "combats")
public class Combat {
    @Id
    private UUID id;

    @Indexed
    private String initiatorUsername;

    private CombatMonsterSnapshot monster1;
    private CombatMonsterSnapshot monster2;

    private UUID winnerId;
    private String winnerUsername;

    private CombatStatus status;
    private List<CombatLog> logs;
    private int totalTurns;

    private LocalDateTime createdAt;
}
