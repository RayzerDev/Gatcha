package fr.imt.nord.fisa.ti.gatcha.invocation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO pour créer un monstre dans l'API Monster
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMonsterRequest {
    private int templateId;
    private String ownerUsername;
    private String element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private List<SkillDTO> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDTO {
        private int num;
        private int dmg;
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
        private String stat;
        private double percent;
    }
}
