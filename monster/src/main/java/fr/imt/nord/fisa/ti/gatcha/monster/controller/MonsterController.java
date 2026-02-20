package fr.imt.nord.fisa.ti.gatcha.monster.controller;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.dto.CreateMonsterRequest;
import fr.imt.nord.fisa.ti.gatcha.monster.dto.MonsterDTO;
import fr.imt.nord.fisa.ti.gatcha.monster.service.MonsterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/monsters")
@RequiredArgsConstructor
@Tag(name = "Monsters", description = "API de gestion des monstres")
public class MonsterController {

    private final MonsterService monsterService;

    @GetMapping
    @Operation(summary = "Mes monstres", description = "Retourne la liste complète des monstres possédés par le joueur connecté.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste de monstres récupérée",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MonsterDTO.class))))
    })
    public ResponseEntity<List<MonsterDTO>> getMyMonsters() {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.getMonstersByOwner(username));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un monstre", description = "Récupère les informations détaillées d'un monstre spécifique s'il appartient au joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monstre trouvé",
                    content = @Content(schema = @Schema(implementation = MonsterDTO.class))),
            @ApiResponse(responseCode = "404", description = "Monstre non trouvé ou non autorisé")
    })
    public ResponseEntity<MonsterDTO> getMonster(
            @Parameter(description = "ID unique du monstre", required = true)
            @PathVariable UUID id) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.getMonsterById(id, username));
    }

    @PostMapping
    @Operation(summary = "Créer un monstre (Interne)", description = "Endpoint utilisé par le service d'Invocation pour créer un nouveau monstre.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Monstre créé",
                    content = @Content(schema = @Schema(implementation = MonsterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<MonsterDTO> createMonster(@Valid @RequestBody CreateMonsterRequest request) {
        MonsterDTO created = monsterService.createMonster(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/batch")
    @Operation(summary = "Récupération par lot (Interne)", description = "Récupère plusieurs monstres par leurs IDs. Utilisé par le service de Combat.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des monstres",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MonsterDTO.class))))
    })
    public ResponseEntity<List<MonsterDTO>> getMonstersByIds(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(monsterService.getMonstersByIds(ids));
    }

    @PostMapping("/{id}/experience")
    @Operation(summary = "Ajouter XP", description = "Ajoute de l'expérience à un monstre (Cheat/Admin).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "XP ajoutée",
                    content = @Content(schema = @Schema(implementation = MonsterDTO.class)))
    })
    public ResponseEntity<MonsterDTO> addExperience(
            @PathVariable UUID id,
            @Parameter(description = "Montant d'XP à ajouter", required = true)
            @RequestParam double amount) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.addExperience(id, username, amount));
    }

    @PostMapping("/{id}/experience/reward")
    @Operation(summary = "Ajouter XP (Récompense)", description = "Ajoute de l'expérience suite à un combat. Pas de vérification de propriétaire.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "XP ajoutée",
                    content = @Content(schema = @Schema(implementation = MonsterDTO.class)))
    })
    public ResponseEntity<MonsterDTO> addExperienceReward(
            @PathVariable UUID id,
            @RequestParam double amount) {
        return ResponseEntity.ok(monsterService.addExperienceInternal(id, amount));
    }

    @PostMapping("/{id}/skills/{skillNum}/upgrade")
    @Operation(summary = "Améliorer compétence", description = "Dépense un point de compétence pour améliorer une attaque spécifique.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Compétence améliorée",
                    content = @Content(schema = @Schema(implementation = MonsterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Points insuffisants ou niveau max atteint")
    })
    public ResponseEntity<MonsterDTO> upgradeSkill(
            @PathVariable UUID id,
            @Parameter(description = "Numéro de la compétence (0-3)", required = true)
            @PathVariable int skillNum) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.upgradeSkill(id, username, skillNum));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Libérer un monstre", description = "Supprime définitivement un monstre de la collection du joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Monstre supprimé"),
            @ApiResponse(responseCode = "404", description = "Monstre non trouvé")
    })
    public ResponseEntity<Void> deleteMonster(@PathVariable UUID id) {
        String username = SecurityContext.getUsername();
        monsterService.deleteMonster(id, username);
        return ResponseEntity.noContent().build();
    }
}
