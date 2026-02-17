package fr.imt.nord.fisa.ti.gatcha.combat.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.common.service.BaseClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service pour la communication avec l'API Player.
 */
@Slf4j
@Service
public class PlayerClientService extends BaseClientService {

    public PlayerClientService(
            HttpClient httpClient,
            @Value("${player.service.url:http://localhost:8082}") String playerServiceUrl) {
        super(httpClient, playerServiceUrl);
    }

    /**
     * Ajoute de l'expérience au joueur (récompense de combat).
     */
    public void addExperience(String username, double amount) {
        try {
            httpClient.post(
                    serviceUrl,
                    "/players/" + username + "/experience?amount=" + amount,
                    null,
                    Void.class
            );
            log.info("Added {} XP to player {}", amount, username);
        } catch (Exception e) {
            log.error("Failed to add XP to player {}: {}", username, e.getMessage());
        }
    }
}
