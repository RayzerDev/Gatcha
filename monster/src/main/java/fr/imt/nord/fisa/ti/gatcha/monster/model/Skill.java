package fr.imt.nord.fisa.ti.gatcha.monster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    private int num;
    private int dmg;
    private Ratio ratio;
    private int cooldown;
    private int lvl;
    private int lvlMax;

    public static Skill createFromBase(int num, int dmg, Ratio ratio, int cooldown, int lvlMax) {
        return Skill.builder()
                .num(num)
                .dmg(dmg)
                .ratio(ratio)
                .cooldown(cooldown)
                .lvl(1)
                .lvlMax(lvlMax)
                .build();
    }

    public boolean canUpgrade() {
        return lvl < lvlMax;
    }

    public void upgrade() {
        if (canUpgrade()) {
            lvl++;
        }
    }
}
