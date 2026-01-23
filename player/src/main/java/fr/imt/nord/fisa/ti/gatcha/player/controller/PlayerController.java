package fr.imt.nord.fisa.ti.gatcha.player.controller;


import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/players")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @PostMapping
    public ResponseEntity<PlayerDTO> createPlayer(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.createPlayer(username));
    }

    @GetMapping("/{username}")
    public ResponseEntity<PlayerDTO> getPlayerByUsername(@PathVariable String username) {
        PlayerDTO playerDTO = playerService.getPlayerByUsername(username, false);
        return ResponseEntity.ok(playerDTO);
    }

    @GetMapping("/{username}/level")
    public ResponseEntity<Integer> getPlayerLevel(@PathVariable String username) {
        return ResponseEntity.ok(playerService.getPlayerLevel(username));
    }

    @GetMapping("/{username}/monsters")
    public ResponseEntity<List<UUID>> getPlayerMonsters(@PathVariable String username) {
        return ResponseEntity.ok(playerService.getPlayerWithMonsters(username));
    }

    @PostMapping("/{username}/experience")
    public ResponseEntity<PlayerDTO> addExperience(@PathVariable String username, @RequestParam double amount) {
        return ResponseEntity.ok(playerService.addExperience(username, amount));
    }

    @PostMapping("/{username}/level-up")
    public ResponseEntity<PlayerDTO> levelUp(@PathVariable String username) {
        return ResponseEntity.ok(playerService.levelUp(username));
    }

    @PostMapping("/{username}/monsters")
    public ResponseEntity<PlayerDTO> addMonster(@PathVariable String username, @RequestParam UUID monsterId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.addMonster(username, monsterId));
    }

    @DeleteMapping("/{username}/monsters/{monsterId}")
    public ResponseEntity<PlayerDTO> removeMonster(@PathVariable String username, @PathVariable UUID monsterId) {
        return ResponseEntity.ok(playerService.removeMonster(username, monsterId));
    }
}
