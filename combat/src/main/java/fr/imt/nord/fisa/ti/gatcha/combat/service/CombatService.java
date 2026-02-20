package fr.imt.nord.fisa.ti.gatcha.combat.service;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.MonsterResponse;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatSummaryDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.exception.CombatNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.combat.exception.InvalidCombatException;
import fr.imt.nord.fisa.ti.gatcha.combat.model.Combat;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatMonsterSnapshot;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatStatus;
import fr.imt.nord.fisa.ti.gatcha.combat.model.SkillSnapshot;
import fr.imt.nord.fisa.ti.gatcha.combat.repository.CombatRepository;
import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service principal de gestion des combats.
 * Orchestre la récupération des monstres, la simulation et la distribution des récompenses.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CombatService {

    private static final double WINNER_MONSTER_XP = 100.0;
    private static final double LOSER_MONSTER_XP = 30.0;
    private static final double PLAYER_COMBAT_XP = 25.0;

    private final CombatRepository combatRepository;
    private final MonsterClientService monsterClientService;
    private final PlayerClientService playerClientService;
    private final CombatSimulator combatSimulator;

    /**
     * Lance un combat entre deux monstres.
     */
    public OutputCombatDTO startCombat(UUID monster1Id, UUID monster2Id) {
        String username = SecurityContext.getUsername();

        if (monster1Id.equals(monster2Id)) {
            throw new InvalidCombatException("Un monstre ne peut pas combattre contre lui-même");
        }

        // Récupérer les monstres via l'API Monster (batch endpoint, vérifie la propriété)
        List<MonsterResponse> monsters = monsterClientService.getMonstersByIds(List.of(monster1Id, monster2Id));

        if (monsters == null || monsters.size() < 2) {
            throw new InvalidCombatException(
                    "Impossible de récupérer les deux monstres. Vérifiez qu'ils existent et vous appartiennent.");
        }

        MonsterResponse m1Response = monsters.stream()
                .filter(m -> m.getId().equals(monster1Id))
                .findFirst()
                .orElseThrow(() -> new InvalidCombatException("Monstre 1 introuvable: " + monster1Id));

        MonsterResponse m2Response = monsters.stream()
                .filter(m -> m.getId().equals(monster2Id))
                .findFirst()
                .orElseThrow(() -> new InvalidCombatException("Monstre 2 introuvable: " + monster2Id));

        // Créer les snapshots pour le combat
        CombatMonsterSnapshot snapshot1 = toSnapshot(m1Response);
        CombatMonsterSnapshot snapshot2 = toSnapshot(m2Response);

        // Simuler le combat
        CombatSimulator.SimulationResult result = combatSimulator.simulate(snapshot1, snapshot2);

        // Sauvegarder le combat
        Combat combat = Combat.builder()
                .id(UUID.randomUUID())
                .initiatorUsername(username)
                .monster1(snapshot1)
                .monster2(snapshot2)
                .winnerId(result.winnerId())
                .winnerUsername(result.winnerUsername())
                .status(CombatStatus.COMPLETED)
                .logs(result.logs())
                .totalTurns(result.totalTurns())
                .createdAt(LocalDateTime.now())
                .build();

        Combat saved = combatRepository.save(combat);
        log.info("Combat {} terminé. Vainqueur: {} ({})", saved.getId(), result.winnerId(), result.winnerUsername());

        // Distribuer les récompenses (asynchrone, ne bloque pas le résultat)
        distributeRewards(result.winnerId(), monster1Id, monster2Id, username);

        return OutputCombatDTO.fromEntity(saved);
    }

    /**
     * Récupère l'historique de tous les combats.
     */
    public List<OutputCombatSummaryDTO> getCombatHistory() {
        return combatRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OutputCombatSummaryDTO::fromEntity)
                .toList();
    }

    /**
     * Récupère l'historique des combats du joueur connecté.
     */
    public List<OutputCombatSummaryDTO> getMyCombatHistory() {
        String username = SecurityContext.getUsername();
        return combatRepository.findByInitiatorUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(OutputCombatSummaryDTO::fromEntity)
                .toList();
    }

    /**
     * Récupère un combat par son ID (pour la rediffusion).
     */
    public OutputCombatDTO getCombatById(UUID combatId) {
        Combat combat = combatRepository.findById(combatId)
                .orElseThrow(() -> new CombatNotFoundException(combatId.toString()));
        return OutputCombatDTO.fromEntity(combat);
    }

    /**
     * Distribue les récompenses d'XP après un combat.
     */
    private void distributeRewards(UUID winnerId, UUID monster1Id, UUID monster2Id, String playerUsername) {
        try {
            UUID loserId = winnerId.equals(monster1Id) ? monster2Id : monster1Id;

            // XP monstre vainqueur
            monsterClientService.addExperienceReward(winnerId, WINNER_MONSTER_XP);
            // XP monstre perdant
            monsterClientService.addExperienceReward(loserId, LOSER_MONSTER_XP);
            // XP joueur
            playerClientService.addExperience(playerUsername, PLAYER_COMBAT_XP);

            log.info("Récompenses distribuées pour le combat. Vainqueur: {}, Perdant: {}, Joueur: {}",
                    winnerId, loserId, playerUsername);
        } catch (Exception e) {
            log.error("Erreur lors de la distribution des récompenses: {}", e.getMessage());
            // Les récompenses sont best-effort, ne pas faire échouer le combat
        }
    }

    /**
     * Convertit une réponse de l'API Monster en snapshot de combat.
     */
    private CombatMonsterSnapshot toSnapshot(MonsterResponse response) {
        List<SkillSnapshot> skills = response.getSkills().stream()
                .map(s -> SkillSnapshot.builder()
                        .num(s.getNum())
                        .dmg(s.getDmg())
                        .ratioStat(s.getRatio().getStat())
                        .ratioPercent(s.getRatio().getPercent())
                        .cooldown(s.getCooldown())
                        .lvl(s.getLvl())
                        .build())
                .toList();

        return CombatMonsterSnapshot.builder()
                .id(response.getId())
                .ownerUsername(response.getOwnerUsername())
                .element(response.getElement())
                .hp(response.getHp())
                .atk(response.getAtk())
                .def(response.getDef())
                .vit(response.getVit())
                .level(response.getLevel())
                .skills(skills)
                .build();
    }
}
