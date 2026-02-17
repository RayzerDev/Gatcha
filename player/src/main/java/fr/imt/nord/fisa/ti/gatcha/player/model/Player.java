package fr.imt.nord.fisa.ti.gatcha.player.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "players")
public class Player {
    @Id
    private UUID id;

    @Indexed(unique = true)
    private String username;
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

    public Player(String username) {
        this();
        this.username = username;
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
