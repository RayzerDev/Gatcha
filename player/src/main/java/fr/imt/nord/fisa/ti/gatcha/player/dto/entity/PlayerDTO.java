package fr.imt.nord.fisa.ti.gatcha.player.dto.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import fr.imt.nord.fisa.ti.gatcha.player.model.Player;

public class PlayerDTO {
    private UUID id;
    private int level;
    private double experience;
    private double experienceStep;
    private List<UUID> monsters;
    private int maxMonsters;

    public PlayerDTO(List<UUID> monsters) {
        this.monsters = new ArrayList<>(monsters);
    }

    public PlayerDTO(Player player) {
        this.id = player.getId();
        this.level = player.getLevel();
        this.experience = player.getExperience();
        this.experienceStep = player.getExperienceStep();
        this.monsters = new ArrayList<>(player.getMonsters());
        this.maxMonsters = player.getMaxMonsters();
    }

    public UUID getId() {
        return id;
    }

    public int getLevel() {
        return level;
    }

    public double getExperience() {
        return experience;
    }

    public double getExperienceStep() {
        return experienceStep;
    }

    public List<UUID> getMonsters() {
        return monsters;
    }

    public int getMaxMonsters() {
        return maxMonsters;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public void setExperience(double experience) {
        this.experience = experience;
    }

    public void setExperienceStep(double experienceStep) {
        this.experienceStep = experienceStep;
    }

    public void setMonsters(List<UUID> monsters) {
        this.monsters = monsters;
    }

    public void setMaxMonsters(int maxMonsters) {
        this.maxMonsters = maxMonsters;
    }
}
