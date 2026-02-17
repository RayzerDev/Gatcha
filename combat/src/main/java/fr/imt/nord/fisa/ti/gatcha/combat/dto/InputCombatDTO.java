package fr.imt.nord.fisa.ti.gatcha.combat.dto;

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
    private UUID monster1Id;

    @NotNull(message = "L'ID du second monstre est requis")
    private UUID monster2Id;
}
