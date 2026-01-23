package fr.imt.nord.fisa.ti.gatcha.player.service;

import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import fr.imt.nord.fisa.ti.gatcha.player.repository.PlayerRepository;
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

    public PlayerDTO createPlayer() {
        Player player = playerRepository.save(new Player());
        return new PlayerDTO(player);
    }

    private Player getPlayerOrCreate(UUID id) {
        return playerRepository.findById(id).orElseGet(() -> {
            Player newPlayer = new Player();
            newPlayer.setId(id);
            return playerRepository.save(newPlayer);
        });
    }

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream().map(PlayerDTO::new).toList();
    }

    public PlayerDTO getPlayerById(UUID id) {
        Player player = getPlayerOrCreate(id);
        return new PlayerDTO(player);
    }

    public int getPlayerLevel(UUID id) {
        return getPlayerOrCreate(id).getLevel();
    }

    public PlayerDTO addExperience(UUID id, double experience) {
        if (experience <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Experience must be positive");
        }
        Player player = getPlayerOrCreate(id);
        player.setExperience(player.getExperience() + experience);
        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public PlayerDTO levelUp(UUID id) {
        Player player = getPlayerOrCreate(id);
        if (player.getLevel() >= 50) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The selected player is already at the maximum level");
        }
        if (player.getExperience() < player.getExperienceStep()) {
            double required = player.getExperienceStep();
            double current = player.getExperience();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Not enough experience to level up: " + current + " / " + required);
        }
        player.setLevel(player.getLevel() + 1);
        player.setExperience(0.0);
        player.setExperienceStep(player.getExperienceStep() * 1.1);
        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public PlayerDTO addMonster(UUID id, UUID monsterId) {
        if (monsterId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The monster ID can't be null or empty");
        }
        Player player = getPlayerOrCreate(id);
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

    public PlayerDTO removeMonster(UUID id, UUID monsterId) {
        Player player = getPlayerOrCreate(id);
        if (!player.removeMonster(monsterId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The monster is not owned by the player");
        }
        playerRepository.save(player);
        return new PlayerDTO(player);
    }

    public List<UUID> getPlayerWithMonsters(UUID id) {
        return new ArrayList<>(getPlayerOrCreate(id).getMonsters());
    }
}
