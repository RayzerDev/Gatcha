package fr.imt.nord.fisa.ti.gatcha.monster.controller;

import fr.imt.nord.fisa.ti.gatcha.monster.dto.CreateMonsterRequest;
import fr.imt.nord.fisa.ti.gatcha.monster.dto.MonsterDTO;
import fr.imt.nord.fisa.ti.gatcha.monster.service.MonsterService;
import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    @Operation(summary = "Récupérer tous les monstres du joueur connecté")
    public ResponseEntity<List<MonsterDTO>> getMyMonsters() {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.getMonstersByOwner(username));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un monstre par son ID")
    public ResponseEntity<MonsterDTO> getMonster(@PathVariable UUID id) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.getMonsterById(id, username));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau monstre (utilisé par l'API Invocation)")
    public ResponseEntity<MonsterDTO> createMonster(@RequestBody CreateMonsterRequest request) {
        MonsterDTO created = monsterService.createMonster(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/batch")
    @Operation(summary = "Récupérer plusieurs monstres par leurs IDs (utilisé par l'API Combat)")
    public ResponseEntity<List<MonsterDTO>> getMonstersByIds(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(monsterService.getMonstersByIds(ids));
    }

    @PostMapping("/{id}/experience")
    @Operation(summary = "Ajouter de l'expérience à un monstre")
    public ResponseEntity<MonsterDTO> addExperience(
            @PathVariable UUID id,
            @RequestParam double amount) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.addExperience(id, username, amount));
    }

    @PostMapping("/{id}/experience/reward")
    @Operation(summary = "Ajouter de l'expérience à un monstre (utilisé par l'API Combat, sans vérification propriétaire)")
    public ResponseEntity<MonsterDTO> addExperienceReward(
            @PathVariable UUID id,
            @RequestParam double amount) {
        return ResponseEntity.ok(monsterService.addExperienceInternal(id, amount));
    }

    @PostMapping("/{id}/skills/{skillNum}/upgrade")
    @Operation(summary = "Améliorer une compétence d'un monstre")
    public ResponseEntity<MonsterDTO> upgradeSkill(
            @PathVariable UUID id,
            @PathVariable int skillNum) {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(monsterService.upgradeSkill(id, username, skillNum));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un monstre")
    public ResponseEntity<Void> deleteMonster(@PathVariable UUID id) {
        String username = SecurityContext.getUsername();
        monsterService.deleteMonster(id, username);
        return ResponseEntity.noContent().build();
    }
}
