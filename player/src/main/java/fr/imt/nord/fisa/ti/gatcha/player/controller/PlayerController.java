package fr.imt.nord.fisa.ti.gatcha.player.controller;


import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/players")
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @PostMapping("/players")
    public ResponseEntity<PlayerDTO> createPlayer() {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.createPlayer());
    }

    @GetMapping("/players/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable UUID id) {
        PlayerDTO playerDTO = playerService.getPlayerById(id);
        return playerDTO != null ? ResponseEntity.ok(playerDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping("/players/{id}/level")
    public ResponseEntity<Integer> getPlayerLevel(@PathVariable UUID id) {
        return ResponseEntity.ok(playerService.getPlayerLevel(id));
    }

    @GetMapping("/players/{id}/monsters")
    public ResponseEntity<PlayerDTO> getPlayerMonsters(@PathVariable UUID id) {
        return ResponseEntity.ok(playerService.getPlayerWithMonsters(id));
    }

    @PostMapping("/players/{id}/experience")
    public ResponseEntity<PlayerDTO> addExperience(@PathVariable UUID id, @RequestParam double amount) {
        return ResponseEntity.status(HttpStatus.OK).body(playerService.addExperience(id, amount));
    }

    @PostMapping("/players/{id}/level-up")
    public ResponseEntity<PlayerDTO> levelUp(@PathVariable UUID id) {
        return ResponseEntity.ok(playerService.levelUp(id));
    }

    @PostMapping("/players/{id}/monsters")
    public ResponseEntity<PlayerDTO> addMonster(@PathVariable UUID id, @RequestParam String monsterId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.addMonster(id, monsterId));
    }

    @DeleteMapping("/players/{id}/monsters/{monsterId}")
    public ResponseEntity<PlayerDTO> removeMonster(@PathVariable UUID id, @PathVariable String monsterId) {
        return ResponseEntity.ok(playerService.removeMonster(id, monsterId));
    }
}
