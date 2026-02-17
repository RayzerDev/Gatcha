package fr.imt.nord.fisa.ti.gatcha.player.dto.entity;

import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class PlayerDTO {
    private UUID id;
    private String username;
    private int level;
    private double experience;
    private double experienceStep;
    private List<UUID> monsters;
    private int maxMonsters;

    public PlayerDTO(Player player) {
        this.id = player.getId();
        this.username = player.getUsername();
        this.level = player.getLevel();
        this.experience = player.getExperience();
        this.experienceStep = player.getExperienceStep();
        this.monsters = new ArrayList<>(player.getMonsters());
        this.maxMonsters = player.getMaxMonsters();
    }

}
