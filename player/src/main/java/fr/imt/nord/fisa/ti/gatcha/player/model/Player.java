package fr.imt.nord.fisa.ti.gatcha.player.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "players")
public class Player {
    @Id
    private UUID id;
    private int level;
    private double experience;
    private double experienceStep;
    private List<UUID> monsters;

    public Player() {
        this.id = UUID.randomUUID();
        this.level = 0;
        this.experience = 0.0;
        this.experienceStep = 50.0;
        this.monsters = new ArrayList<>();
    }

    public int getMaxMonsters() {
        return 10 + this.level;
    }

    public void addMonster(UUID monsterId) {
        if (this.monsters == null) {
            this.monsters = new ArrayList<>();
        }
        this.monsters.add(monsterId);
    }

    public boolean removeMonster(UUID monsterId) {
        if (this.monsters == null) {
            return false;
        }
        return this.monsters.remove(monsterId);
    }
}
