package fr.imt.nord.fisa.ti.gatcha.invocation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monster_templates")
public class MonsterTemplate {
    @Id
    @Field("_id")
    private int id;

    private ElementType element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private List<SkillTemplate> skills;
    private double lootRate;
}
