package fr.imt.nord.fisa.ti.gatcha.invocation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO reçue de l'API Player
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {
    private UUID id;
    private String username;
    private int level;
    private double experience;
    private double experienceStep;
    private List<UUID> monsters;
    private int maxMonsters;
}
