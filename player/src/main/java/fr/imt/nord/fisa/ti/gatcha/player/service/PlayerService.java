package fr.imt.nord.fisa.ti.gatcha.player.service;

import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import fr.imt.nord.fisa.ti.gatcha.player.repository.PlayerRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public PlayerDTO createPlayer(String username) {
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (playerRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        Player player = playerRepository.save(new Player(username));
        return new PlayerDTO(player);
    }

    private Player getPlayerOrCreate(String username) {
        return playerRepository.findByUsername(username).orElseGet(() -> {
            Player newPlayer = new Player(username);
            return playerRepository.save(newPlayer);
        });
    }

    private Player getPlayerByUsername(String username) {
        return playerRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
    }

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream().map(PlayerDTO::new).toList();
    }

    public PlayerDTO getPlayerByUsername(String username, boolean createIfNotFound) {
        if (createIfNotFound) {
            return new PlayerDTO(getPlayerOrCreate(username));
        }
        return new PlayerDTO(getPlayerByUsername(username));
    }

    public int getPlayerLevel(String username) {
        return getPlayerByUsername(username).getLevel();
    }

    public PlayerDTO addExperience(String username, double experience) {
        if (experience <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Experience must be positive");
        }
        Player player = getPlayerByUsername(username);
        player.setExperience(player.getExperience() + experience);

        // Check for level up immediately
        return handleLevelUp(player);
    }

    @NonNull
    private PlayerDTO handleLevelUp(Player player) {
        double currentExp = player.getExperience();
        double step = player.getExperienceStep();
        int level = player.getLevel();

        while (currentExp >= step && level < 50) {
            currentExp -= step;
            level += 1;
            step *= 1.1;
        }

        player.setLevel(level);
        player.setExperience(currentExp);
        player.setExperienceStep(step);

        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public PlayerDTO levelUp(String username) {
        Player player = getPlayerByUsername(username);
        if (player.getLevel() >= 50) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The selected player is already at the maximum level");
        }
        if (player.getExperience() < player.getExperienceStep()) {
            double required = player.getExperienceStep();
            double current = player.getExperience();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Not enough experience to level up: " + current + " / " + required);
        }

        return handleLevelUp(player);
    }

    public PlayerDTO addMonster(String username, UUID monsterId) {
        if (monsterId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The monster ID can't be null or empty");
        }
        Player player = getPlayerByUsername(username);
        if (player.getMonsters().size() >= player.getMaxMonsters()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The monster limit has been reached");
        }
        if (player.getMonsters().contains(monsterId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The monster is already owned by the player");
        }
        player.addMonster(monsterId);
        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public PlayerDTO removeMonster(String username, UUID monsterId) {
        Player player = getPlayerByUsername(username);
        if (!player.removeMonster(monsterId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The monster is not owned by the player");
        }
        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public List<UUID> getPlayerWithMonsters(String username) {
        Player player = getPlayerByUsername(username);
        return player.getMonsters() != null ? player.getMonsters() : new ArrayList<>();
    }
}
