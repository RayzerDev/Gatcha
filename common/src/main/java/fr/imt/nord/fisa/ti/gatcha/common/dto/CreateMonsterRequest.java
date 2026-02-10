package fr.imt.nord.fisa.ti.gatcha.common.dto;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
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
public class CreateMonsterRequest {
    private int templateId;
    private ElementType element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    @NotEmpty
    @NotNull
    private List<SkillDTO> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDTO {
        private int num;
        private int dmg;
        @NotNull
        private RatioDTO ratio;
        private int cooldown;
        private int lvl;
        private int lvlMax;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatioDTO {
        @NotBlank
        private String stat;
        @NotBlank
        private double percent;
    }
}

