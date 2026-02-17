package fr.imt.nord.fisa.ti.gatcha.combat.dto;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.common.model.StatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * DTO pour désérialiser la réponse de l'API Monster.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonsterResponse {
    private UUID id;
    private int templateId;
    private String ownerUsername;
    private ElementType element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private int level;
    private double experience;
    private double experienceToNextLevel;
    private int skillPoints;
    private List<SkillResponse> skills;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillResponse {
        private int num;
        private int dmg;
        private RatioResponse ratio;
        private int cooldown;
        private int lvl;
        private int lvlMax;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatioResponse {
        private StatType stat;
        private double percent;
    }
}
