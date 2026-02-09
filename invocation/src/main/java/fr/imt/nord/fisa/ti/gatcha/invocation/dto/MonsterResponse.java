package fr.imt.nord.fisa.ti.gatcha.invocation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO reçue de l'API Monster lors de la création d'un monstre
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonsterResponse {
    private UUID id;
    private int templateId;
    private String ownerUsername;
    private String element;
    private int hp;
    private int atk;
    private int def;
    private int vit;
    private int level;
}
