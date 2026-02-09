package fr.imt.nord.fisa.ti.gatcha.monster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monsters")
public class Monster {
    @Id
    private UUID id;

    private int templateId;

    @Indexed
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

    private List<Skill> skills;

    public static Monster createFromTemplate(int templateId, String ownerUsername, ElementType element,
                                              int hp, int atk, int def, int vit, List<Skill> skills) {
        return Monster.builder()
                .id(UUID.randomUUID())
                .templateId(templateId)
                .ownerUsername(ownerUsername)
                .element(element)
                .hp(hp)
                .atk(atk)
                .def(def)
                .vit(vit)
                .level(1)
                .experience(0)
                .experienceToNextLevel(100)
                .skillPoints(0)
                .skills(skills)
                .build();
    }

    public void addExperience(double xp) {
        this.experience += xp;
        while (this.experience >= this.experienceToNextLevel && this.level < 100) {
            levelUp();
        }
    }

    private void levelUp() {
        this.experience -= this.experienceToNextLevel;
        this.level++;
        this.experienceToNextLevel *= 1.15;
        this.skillPoints++;
        applyLevelUpStats();
    }

    private void applyLevelUpStats() {
        // Augmentation des stats de 5% à chaque niveau
        this.hp = (int) (this.hp * 1.05);
        this.atk = (int) (this.atk * 1.05);
        this.def = (int) (this.def * 1.05);
        this.vit = (int) (this.vit * 1.05);
    }

    public boolean upgradeSkill(int skillNum) {
        if (this.skillPoints <= 0) {
            return false;
        }
        for (Skill skill : skills) {
            if (skill.getNum() == skillNum && skill.canUpgrade()) {
                skill.upgrade();
                this.skillPoints--;
                return true;
            }
        }
        return false;
    }

    public int getStatValue(StatType statType) {
        return switch (statType) {
            case HP -> hp;
            case ATK -> atk;
            case DEF -> def;
            case VIT -> vit;
        };
    }
}
