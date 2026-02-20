package fr.imt.nord.fisa.ti.gatcha.monster.dto;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Monster;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Skill;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Représentation riche d'un monstre appartenant à un joueur")
public class MonsterDTO {
    @Schema(description = "Identifiant unique du monstre", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "ID du template associé", example = "10")
    private int templateId;

    @Schema(description = "Nom du propriétaire", example = "joueur123")
    private String ownerUsername;

    @Schema(description = "Élément du monstre", example = "FIRE")
    private ElementType element;

    @Schema(description = "PV actuels", example = "150")
    private int hp;

    @Schema(description = "Attaque", example = "50")
    private int atk;

    @Schema(description = "Défense", example = "40")
    private int def;

    @Schema(description = "Vitesse", example = "30")
    private int vit;

    @Schema(description = "Niveau actuel", example = "5")
    private int level;

    @Schema(description = "Expérience actuelle", example = "150.5")
    private double experience;

    @Schema(description = "Expérience requise pour le niveau suivant", example = "300.0")
    private double experienceToNextLevel;

    @Schema(description = "Points de compétence disponibles", example = "2")
    private int skillPoints;

    @Schema(description = "Liste des compétences")
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
