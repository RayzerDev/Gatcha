package fr.imt.nord.fisa.ti.gatcha.invocation.service;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.InvocationDTO;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.MonsterResponse;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.PlayerResponse;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.InventoryFullException;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.InvocationFailedException;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.NoTemplateAvailableException;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.TemplateNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.Invocation;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.InvocationStatus;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.repository.InvocationRepository;
import fr.imt.nord.fisa.ti.gatcha.invocation.repository.MonsterTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvocationService {

    private final MonsterTemplateRepository templateRepository;
    private final InvocationRepository invocationRepository;
    private final MonsterClientService monsterClientService;
    private final PlayerClientService playerClientService;
    private final Random random = new Random();

    /**
     * Effectue une invocation pour un joueur
     */
    public InvocationDTO invoke() {
        // Vérifier la place dans l'inventaire
        PlayerResponse player = playerClientService.getPlayer(SecurityContext.getUsername());
        if (player.getMonsters().size() >= player.getMaxMonsters()) {
            throw new InventoryFullException("Player inventory is full");
        }

        // Sélectionner un monstre aléatoirement basé sur les taux de loot
        MonsterTemplate selectedTemplate = selectRandomMonster();

        // Créer l'invocation dans la base tampon
        Invocation invocation = Invocation.create(SecurityContext.getUsername(), selectedTemplate.getId());
        invocation = invocationRepository.save(invocation);
        log.info("Created invocation {} for user {} with template {}",
                invocation.getId(), SecurityContext.getUsername(), selectedTemplate.getId());

        try {
            // Étape 1: Créer le monstre via l'API Monster
            // L'API Monster gère aussi l'ajout du monstre au joueur
            MonsterResponse monsterResponse = monsterClientService.createMonster(selectedTemplate, SecurityContext.getUsername());
            invocation.markMonsterCreated(monsterResponse.getId());
            invocation.markPlayerUpdated(); // Le player est mis à jour par Monster
            invocationRepository.save(invocation);
            log.info("Monster {} created for invocation {}", monsterResponse.getId(), invocation.getId());

            // Étape 2: Marquer comme complétée
            invocation.markCompleted();
            invocation = invocationRepository.save(invocation);
            log.info("Invocation {} completed successfully", invocation.getId());

            return InvocationDTO.fromEntity(invocation);

        } catch (Exception e) {
            log.error("Invocation {} failed: {}", invocation.getId(), e.getMessage());
            invocation.markFailed(e.getMessage());
            invocationRepository.save(invocation);
            throw new InvocationFailedException("Invocation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Crée un nouveau template de monstre
     */
    public MonsterTemplate createTemplate(MonsterTemplate template) {
        // Générer un ID si non fourni
        if (template.getId() == null || template.getId() == 0) {
            int maxId = templateRepository.findAll().stream()
                    .mapToInt(t -> t.getId() != null ? t.getId() : 0)
                    .max().orElse(0);
            template.setId(maxId + 1);
        }

        // Valider les données (basic)
        if (template.getLootRate() <= 0) {
            throw new IllegalArgumentException("Loot rate must be positive");
        }

        return templateRepository.save(template);
    }

    /**
     * Met à jour un template de monstre existant
     */
    public MonsterTemplate updateTemplate(int id, MonsterTemplate template) {
        if (!templateRepository.existsById(id)) {
            throw new TemplateNotFoundException(id);
        }
        template.setId(id);

        // Valider les données
        if (template.getLootRate() <= 0) {
            throw new IllegalArgumentException("Loot rate must be positive");
        }

        return templateRepository.save(template);
    }

    /**
     * Sélectionne un monstre aléatoirement en fonction des taux de loot
     */
    public MonsterTemplate selectRandomMonster() {
        List<MonsterTemplate> templates = templateRepository.findAll();

        if (templates.isEmpty()) {
            throw new NoTemplateAvailableException();
        }

        // Calculer la somme totale des taux de loot
        double totalRate = templates.stream()
                .mapToDouble(MonsterTemplate::getLootRate)
                .sum();

        if (totalRate <= 0) {
            throw new NoTemplateAvailableException("Total loot rate must be positive, found: " + totalRate);
        }

        // Générer un nombre aléatoire entre 0 et la somme totale
        double roll = random.nextDouble() * totalRate;

        // Parcourir les templates et sélectionner celui correspondant
        double cumulative = 0;
        for (MonsterTemplate template : templates) {
            cumulative += template.getLootRate();
            if (roll < cumulative) {
                return template;
            }
        }

        // En cas de problème d'arrondi, retourner le dernier
        return templates.get(templates.size() - 1);
    }

    /**
     * Récupérer l'historique des invocations d'un joueur
     */
    public List<InvocationDTO> getInvocationHistory(String username) {
        return invocationRepository.findByUsername(username)
                .stream()
                .map(InvocationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer tous les templates de monstres
     */
    public List<MonsterTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    /**
     * Rejouer les invocations échouées
     */
    public List<InvocationDTO> retryFailedInvocations() {
        List<InvocationStatus> retryableStatuses = Arrays.asList(
                InvocationStatus.PENDING,
                InvocationStatus.MONSTER_CREATED,
                InvocationStatus.PLAYER_UPDATED,
                InvocationStatus.FAILED
        );

        List<Invocation> pendingInvocations = invocationRepository
                .findByStatusIn(retryableStatuses);

        log.info("Found {} invocations to retry", pendingInvocations.size());

        return pendingInvocations.stream()
                .map(this::retryInvocation)
                .collect(Collectors.toList());
    }

    /**
     * Retente une invocation individuelle
     * Note: L'API Monster gère maintenant l'ajout du monstre au joueur
     */
    private InvocationDTO retryInvocation(Invocation invocation) {
        log.info("Retrying invocation {} with status {}", invocation.getId(), invocation.getStatus());
        invocation.resetForRetry();

        try {
            MonsterTemplate template = templateRepository.findById(invocation.getTemplateId())
                    .orElseThrow(() -> new TemplateNotFoundException(invocation.getTemplateId()));

            switch (invocation.getStatus()) {
                case PENDING:
                case FAILED:
                    // Recommencer depuis le début - Monster gère l'ajout au joueur
                    if (invocation.getMonsterId() == null) {
                        MonsterResponse response = monsterClientService.createMonster(template, invocation.getUsername());
                        invocation.markMonsterCreated(response.getId());
                    }
                    invocation.markPlayerUpdated();
                    invocation.markCompleted();
                    invocationRepository.save(invocation);
                    break;

                case MONSTER_CREATED:
                case PLAYER_UPDATED:
                    // Le monstre existe déjà, marquer comme complété
                    invocation.markPlayerUpdated();
                    invocation.markCompleted();
                    invocationRepository.save(invocation);
                    break;

                default:
                    break;
            }

            log.info("Invocation {} retry successful", invocation.getId());
            return InvocationDTO.fromEntity(invocation);

        } catch (Exception e) {
            log.error("Retry failed for invocation {}: {}", invocation.getId(), e.getMessage());
            invocation.markFailed(e.getMessage());
            invocationRepository.save(invocation);
            return InvocationDTO.fromEntity(invocation);
        }
    }
}
