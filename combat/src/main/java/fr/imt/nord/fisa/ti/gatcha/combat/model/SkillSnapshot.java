package fr.imt.nord.fisa.ti.gatcha.combat.model;

import fr.imt.nord.fisa.ti.gatcha.common.model.StatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Snapshot d'une compétence au moment du combat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillSnapshot {
    private int num;
    private int dmg;
    private StatType ratioStat;
    private double ratioPercent;
    private int cooldown;
    private int lvl;
}
