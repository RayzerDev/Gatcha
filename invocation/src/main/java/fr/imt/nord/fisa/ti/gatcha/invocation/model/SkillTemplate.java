package fr.imt.nord.fisa.ti.gatcha.invocation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillTemplate {
    private int num;
    private int dmg;
    private Ratio ratio;
    private int cooldown;
    private int lvlMax;
}
