package fr.imt.nord.fisa.ti.gatcha.common.dto;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO partagé pour la création de monstre
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requête de création de monstre (interne)")
public class CreateMonsterRequest {
    @Schema(description = "ID du template utilisé", example = "5")
    private int templateId;

    @Schema(description = "Élément", example = "FIRE")
    private ElementType element;

    @Schema(description = "PV initiaux", example = "150")
    private int hp;

    @Schema(description = "Attaque initiale", example = "50")
    private int atk;

    @Schema(description = "Défense initiale", example = "40")
    private int def;

    @Schema(description = "Vitesse initiale", example = "30")
    private int vit;

    @NotEmpty
    @NotNull
    @Schema(description = "Liste des compétences initiales")
    private List<SkillDTO> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Détail d'une compétence")
    public static class SkillDTO {
        @Schema(description = "Numéro de slot", example = "1")
        private int num;

        @Schema(description = "Dégâts de base", example = "20")
        private int dmg;

        @NotNull
        @Schema(description = "Ratio de scaling")
        private RatioDTO ratio;

        @Schema(description = "Temps de recharge (tours)", example = "3")
        private int cooldown;

        @Schema(description = "Niveau actuel de la compétence", example = "1")
        private int lvl;

        @Schema(description = "Niveau maximum", example = "5")
        private int lvlMax;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatioDTO {
        @NotBlank
        @Schema(description = "Statistique utilisée pour le scaling (ATK, DEF, HP)", example = "ATK")
        private String stat;

        @NotBlank
        @Schema(description = "Multiplicateur de la stat", example = "1.5")
        private double percent;
    }
}
