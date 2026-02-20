package fr.imt.nord.fisa.ti.gatcha.combat.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO d'entrée pour lancer un combat entre deux monstres.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InputCombatDTO {
    @NotNull(message = "L'ID du premier monstre est requis")
    @Schema(description = "ID du premier monstre (votre monstre)", example = "123e4567-e89b-12d3-a456-426614174000", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID monster1Id;

    @NotNull(message = "L'ID du second monstre est requis")
    @Schema(description = "ID du second monstre (adversaire)", example = "123e4567-e89b-12d3-a456-426614174001", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID monster2Id;
}
