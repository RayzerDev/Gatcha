package fr.imt.nord.fisa.ti.gatcha.monster.dto;

import fr.imt.nord.fisa.ti.gatcha.monster.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMonsterRequest {
    private int templateId;
    private String ownerUsername;
    private ElementType element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private List<Skill> skills;
}
