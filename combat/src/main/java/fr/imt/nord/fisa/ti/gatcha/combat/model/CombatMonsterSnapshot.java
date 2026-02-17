package fr.imt.nord.fisa.ti.gatcha.combat.model;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.common.model.StatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Snapshot d'un monstre au moment du combat (stats figées).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CombatMonsterSnapshot {
    private UUID id;
    private String ownerUsername;
    private ElementType element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private int level;
    private List<SkillSnapshot> skills;

    /**
     * Retourne la valeur d'une statistique.
     */
    public int getStatValue(StatType statType) {
        return switch (statType) {
            case HP -> hp;
            case ATK -> atk;
            case DEF -> def;
            case VIT -> vit;
        };
    }
}
