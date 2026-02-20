package fr.imt.nord.fisa.ti.gatcha.invocation.model;

import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Modèle de définition (template) d'un monstre")
public class MonsterTemplate {
    @Id
    @Field("_id")
    @Schema(description = "Identifiant unique du template", example = "10")
    private Integer id;

    @Schema(description = "Élément du monstre (FIRE, WATER, WIND)", example = "FIRE")
    private ElementType element;

    @Schema(description = "Points de vie de base", example = "150")
    private int hp;

    @Schema(description = "Attaque de base", example = "45")
    private int atk;

    @Schema(description = "Défense de base", example = "30")
    private int def;

    @Schema(description = "Vitesse de base", example = "25")
    private int vit;

    @Schema(description = "Liste des compétences disponibles pour ce template")
    private List<SkillTemplate> skills;

    @Schema(description = "Probabilité d'obtention lors d'une invocation (pourcentage 0-1)", example = "0.05")
    private double lootRate;
}
