package fr.imt.nord.fisa.ti.gatcha.combat.service;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.MonsterResponse;
import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.common.service.BaseClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Service pour la communication avec l'API Monster.
 */
@Slf4j
@Service
public class MonsterClientService extends BaseClientService {

    public MonsterClientService(
            HttpClient httpClient,
            @Value("${monster.service.url:http://localhost:8083}") String monsterServiceUrl) {
        super(httpClient, monsterServiceUrl);
    }

    /**
     * Récupère plusieurs monstres par leurs IDs via le batch endpoint.
     */
    public List<MonsterResponse> getMonstersByIds(List<UUID> ids) {
        log.debug("Fetching monsters by IDs: {}", ids);
        MonsterResponse[] response = httpClient.post(
                serviceUrl,
                "/monsters/batch",
                ids,
                MonsterResponse[].class
        );
        return response != null ? Arrays.asList(response) : List.of();
    }

    /**
     * Ajoute de l'expérience à un monstre (récompense de combat, sans vérification propriétaire).
     */
    public void addExperienceReward(UUID monsterId, double amount) {
        try {
            httpClient.post(
                    serviceUrl,
                    "/monsters/" + monsterId + "/experience/reward?amount=" + amount,
                    null,
                    Void.class
            );
            log.info("Added {} XP reward to monster {}", amount, monsterId);
        } catch (Exception e) {
            log.error("Failed to add XP reward to monster {}: {}", monsterId, e.getMessage());
        }
    }
}
