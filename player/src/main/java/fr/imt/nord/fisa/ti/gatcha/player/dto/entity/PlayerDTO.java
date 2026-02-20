package fr.imt.nord.fisa.ti.gatcha.player.dto.entity;

import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Schema(description = "Informations publiques sur un joueur")
public class PlayerDTO {
    @Schema(description = "Identifiant interne du joueur", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Nom d'utilisateur unique", example = "Link")
    private String username;

    @Schema(description = "Niveau du joueur", example = "10")
    private int level;

    @Schema(description = "Expérience accumulée", example = "500.0")
    private double experience;

    @Schema(description = "Expérience requise pour le niveau suivant", example = "100.0")
    private double experienceStep;

    @Schema(description = "Liste des IDs des monstres possédés")
    private List<UUID> monsters;

    @Schema(description = "Nombre maximum de monstres stockables", example = "6")
    private int maxMonsters;

    public PlayerDTO(Player player) {
        this.id = player.getId();
        this.username = player.getUsername();
        this.level = player.getLevel();
        this.experience = player.getExperience();
        this.experienceStep = player.getExperienceStep();
        this.monsters = new ArrayList<>(player.getMonsters());
        this.maxMonsters = player.getMaxMonsters();
    }

}
