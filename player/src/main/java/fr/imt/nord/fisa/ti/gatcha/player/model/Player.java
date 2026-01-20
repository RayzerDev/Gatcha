package fr.imt.nord.fisa.ti.gatcha.player.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "players")
public class Player {
    @Id
    private UUID id;
    private int level;
    private double experience;
    private double experienceStep;
    private List<String> monsters;

    public Player() {
        this.id = UUID.randomUUID();
        this.level = 0;
        this.experience = 0.0;
        this.experienceStep = 50.0;
        this.monsters = new ArrayList<>();
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

    public List<String> getMonsters() {
        return monsters;
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

    public void setMonsters(List<String> monsters) {
        this.monsters = monsters;
    }

    public int getMaxMonsters() {
        return 10 + this.level;
    }

    public void addMonster(String monsterId) {
        if (this.monsters == null) {
            this.monsters = new ArrayList<>();
        }
        this.monsters.add(monsterId);
    }

    public boolean removeMonster(String monsterId) {
        if (this.monsters == null) {
            return false;
        }
        return this.monsters.remove(monsterId);
    }
}
