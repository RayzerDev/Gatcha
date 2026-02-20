package fr.imt.nord.fisa.ti.gatcha.invocation.controller;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.InvocationDTO;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.service.InvocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invocations")
@RequiredArgsConstructor
@Tag(name = "Invocations", description = "API d'invocation de monstres")
public class InvocationController {

    private final InvocationService invocationService;

    @PostMapping
    @Operation(summary = "Invoquer un monstre", description = "Lance une invocation aléatoire basée sur les templates disponibles et attribue un nouveau monstre au joueur connecté.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Invocation réussie",
                    content = @Content(schema = @Schema(implementation = InvocationDTO.class))),
            @ApiResponse(responseCode = "400", description = "Erreur lors de l'invocation (ex: crédits insuffisants)"),
            @ApiResponse(responseCode = "404", description = "Aucun template de monstre disponible")
    })
    public ResponseEntity<InvocationDTO> invoke() {
        InvocationDTO result = invocationService.invoke();
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @Operation(summary = "Historique d'invocations", description = "Récupère la liste complète des invocations effectuées par le joueur connecté.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = InvocationDTO.class))))
    })
    public ResponseEntity<List<InvocationDTO>> getInvocationHistory() {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(invocationService.getInvocationHistory(username));
    }

    @GetMapping("/templates")
    @Operation(summary = "Liste des templates", description = "Retourne la liste de tous les modèles de monstres disponibles dans le jeu.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des templates récupérée",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MonsterTemplate.class))))
    })
    public ResponseEntity<List<MonsterTemplate>> getTemplates() {
        return ResponseEntity.ok(invocationService.getAllTemplates());
    }

    @PostMapping("/templates")
    @Operation(summary = "Créer un template", description = "Ajoute un nouveau modèle de monstre à la base de données (Admin seulement).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Template créé avec succès",
                    content = @Content(schema = @Schema(implementation = MonsterTemplate.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<MonsterTemplate> createTemplate(@RequestBody MonsterTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invocationService.createTemplate(template));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "Modifier un template", description = "Met à jour les caractéristiques d'un modèle de monstre existant.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Template mis à jour",
                    content = @Content(schema = @Schema(implementation = MonsterTemplate.class))),
            @ApiResponse(responseCode = "404", description = "Template non trouvé")
    })
    public ResponseEntity<MonsterTemplate> updateTemplate(
            @Parameter(description = "ID du template à modifier", required = true, example = "5")
            @org.springframework.web.bind.annotation.PathVariable int id,
            @RequestBody MonsterTemplate template) {
        return ResponseEntity.ok(invocationService.updateTemplate(id, template));
    }

    @PostMapping("/retry")
    @Operation(summary = "Relancer les échecs", description = "Tente de relancer toutes les invocations en statut échoué ou en attente pour le joueur.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tentatives de relance effectuées",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = InvocationDTO.class))))
    })
    public ResponseEntity<List<InvocationDTO>> retryFailedInvocations() {
        return ResponseEntity.ok(invocationService.retryFailedInvocations());
    }
}
