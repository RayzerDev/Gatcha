package fr.imt.nord.fisa.ti.gatcha.monster.dto;

import fr.imt.nord.fisa.ti.gatcha.monster.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Monster;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonsterDTO {
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
    private List<Skill> skills;

    public static MonsterDTO fromEntity(Monster monster) {
        return MonsterDTO.builder()
                .id(monster.getId())
                .templateId(monster.getTemplateId())
                .ownerUsername(monster.getOwnerUsername())
                .element(monster.getElement())
                .hp(monster.getHp())
                .atk(monster.getAtk())
                .def(monster.getDef())
                .vit(monster.getVit())
                .level(monster.getLevel())
                .experience(monster.getExperience())
                .experienceToNextLevel(monster.getExperienceToNextLevel())
                .skillPoints(monster.getSkillPoints())
                .skills(monster.getSkills())
                .build();
    }
}
