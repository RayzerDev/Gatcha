package fr.imt.nord.fisa.ti.gatcha.combat.controller;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.InputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatSummaryDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.service.CombatService;
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
@RequestMapping("/combats")
@RequiredArgsConstructor
@Tag(name = "Combats", description = "API de gestion des combats entre monstres")
public class CombatController {

    private final CombatService combatService;

    @PostMapping
    @Operation(summary = "Lancer un combat", description = "Démarre une simulation de combat tour par tour entre deux monstres spécifiés par leur ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Combat créé et simulé avec succès",
                    content = @Content(schema = @Schema(implementation = OutputCombatDTO.class))),
            @ApiResponse(responseCode = "400", description = "Données d'entrée invalides (ex: ID manquants)"),
            @ApiResponse(responseCode = "404", description = "Un ou plusieurs monstres non trouvés")
    })
    public ResponseEntity<OutputCombatDTO> startCombat(@Valid @RequestBody InputCombatDTO input) {
        OutputCombatDTO result = combatService.startCombat(input.getMonster1Id(), input.getMonster2Id());
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @Operation(summary = "Historique global", description = "Récupère la liste de tous les combats ayant eu lieu sur le serveur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des combats récupérée",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = OutputCombatSummaryDTO.class))))
    })
    public ResponseEntity<List<OutputCombatSummaryDTO>> getCombatHistory() {
        return ResponseEntity.ok(combatService.getCombatHistory());
    }

    @GetMapping("/me")
    @Operation(summary = "Historique personnel", description = "Récupère l'historique des combats impliquant le joueur connecté.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historique personnel récupéré",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = OutputCombatSummaryDTO.class)))),
            @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié")
    })
    public ResponseEntity<List<OutputCombatSummaryDTO>> getMyCombatHistory() {
        return ResponseEntity.ok(combatService.getMyCombatHistory());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un combat", description = "Récupère les détails complets d'un combat spécifique, incluant les logs tour par tour, pour permettre une rediffusion.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détails du combat trouvés",
                    content = @Content(schema = @Schema(implementation = OutputCombatDTO.class))),
            @ApiResponse(responseCode = "404", description = "Combat non trouvé")
    })
    public ResponseEntity<OutputCombatDTO> getCombatById(
            @Parameter(description = "ID unique du combat", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        return ResponseEntity.ok(combatService.getCombatById(id));
    }
}
