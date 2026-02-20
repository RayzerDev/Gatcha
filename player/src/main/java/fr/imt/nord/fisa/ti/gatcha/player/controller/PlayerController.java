package fr.imt.nord.fisa.ti.gatcha.player.controller;


import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.service.PlayerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/players")
@Tag(name = "Players", description = "API de gestion des joueurs et de leurs statistiques")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    @Operation(summary = "Liste des joueurs", description = "Récupère la liste de tous les joueurs enregistrés.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste récupérée",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = PlayerDTO.class))))
    })
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @PostMapping
    @Operation(summary = "Créer un joueur (Interne/Admin)", description = "Crée un nouveau profil joueur associé à un utilisateur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Joueur créé",
                    content = @Content(schema = @Schema(implementation = PlayerDTO.class))),
            @ApiResponse(responseCode = "400", description = "Erreur de création")
    })
    public ResponseEntity<PlayerDTO> createPlayer(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.createPlayer(username));
    }

    @GetMapping("/{username}")
    @Operation(summary = "Profil joueur", description = "Récupère les informations d'un joueur par son nom d'utilisateur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profil trouvé",
                    content = @Content(schema = @Schema(implementation = PlayerDTO.class))),
            @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
    })
    public ResponseEntity<PlayerDTO> getPlayerByUsername(
            @Parameter(description = "Nom d'utilisateur", required = true)
            @PathVariable String username) {
        PlayerDTO playerDTO = playerService.getPlayerByUsername(username, SecurityContext.getUsername() != null && SecurityContext.getUsername().equals(username));
        return ResponseEntity.ok(playerDTO);
    }

    @GetMapping("/{username}/level")
    @Operation(summary = "Niveau du joueur", description = "Récupère uniquement le niveau d'un joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Niveau récupéré",
                    content = @Content(schema = @Schema(implementation = Integer.class)))
    })
    public ResponseEntity<Integer> getPlayerLevel(@PathVariable String username) {
        return ResponseEntity.ok(playerService.getPlayerLevel(username));
    }

    @GetMapping("/{username}/monsters")
    @Operation(summary = "Monstres du joueur", description = "Récupère la liste des IDs des monstres d'un joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des IDs récupérée",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UUID.class))))
    })
    public ResponseEntity<List<UUID>> getPlayerMonsters(@PathVariable String username) {
        return ResponseEntity.ok(playerService.getPlayerWithMonsters(username));
    }

    @PostMapping("/{username}/experience")
    @Operation(summary = "Ajouter XP Joueur", description = "Ajoute de l'expérience au joueur (Cheat/Admin/Récompense).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "XP ajoutée",
                    content = @Content(schema = @Schema(implementation = PlayerDTO.class)))
    })
    public ResponseEntity<PlayerDTO> addExperience(@PathVariable String username, @RequestParam double amount) {
        return ResponseEntity.ok(playerService.addExperience(username, amount));
    }

    @PostMapping("/{username}/level-up")
    @Operation(summary = "Monter de niveau", description = "Force le passage de niveau si l'XP est suffisante.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Niveau augmenté",
                    content = @Content(schema = @Schema(implementation = PlayerDTO.class)))
    })
    public ResponseEntity<PlayerDTO> levelUp(@PathVariable String username) {
        return ResponseEntity.ok(playerService.levelUp(username));
    }

    @PostMapping("/{username}/monsters")
    @Operation(summary = "Ajouter monstre (Interne)", description = "Associe un monstre existant au joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Monstre ajouté au joueur",
                    content = @Content(schema = @Schema(implementation = PlayerDTO.class)))
    })
    public ResponseEntity<PlayerDTO> addMonster(@PathVariable String username, @RequestParam UUID monsterId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.addMonster(username, monsterId));
    }

    @DeleteMapping("/{username}/monsters/{monsterId}")
    @Operation(summary = "Retirer monstre (Interne)", description = "Dissocie un monstre du joueur.")
    public ResponseEntity<PlayerDTO> removeMonster(@PathVariable String username, @PathVariable UUID monsterId) {
        return ResponseEntity.ok(playerService.removeMonster(username, monsterId));
    }
}
