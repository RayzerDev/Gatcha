package fr.imt.nord.fisa.ti.gatcha.combat.controller;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.InputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatSummaryDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.service.CombatService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Lancer un combat entre deux monstres")
    public ResponseEntity<OutputCombatDTO> startCombat(@Valid @RequestBody InputCombatDTO input) {
        OutputCombatDTO result = combatService.startCombat(input.getMonster1Id(), input.getMonster2Id());
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @Operation(summary = "Récupérer l'historique de tous les combats")
    public ResponseEntity<List<OutputCombatSummaryDTO>> getCombatHistory() {
        return ResponseEntity.ok(combatService.getCombatHistory());
    }

    @GetMapping("/me")
    @Operation(summary = "Récupérer l'historique des combats du joueur connecté")
    public ResponseEntity<List<OutputCombatSummaryDTO>> getMyCombatHistory() {
        return ResponseEntity.ok(combatService.getMyCombatHistory());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un combat par son ID (rediffusion)")
    public ResponseEntity<OutputCombatDTO> getCombatById(@PathVariable UUID id) {
        return ResponseEntity.ok(combatService.getCombatById(id));
    }
}
