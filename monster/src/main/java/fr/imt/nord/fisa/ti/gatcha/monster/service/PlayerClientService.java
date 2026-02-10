package fr.imt.nord.fisa.ti.gatcha.monster.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.common.service.BaseClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.UUID;

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
     * Ajoute un monstre à la liste des monstres du joueur.
     */
    public void addMonsterToPlayer(String username, UUID monsterId) {
        try {
            String path = UriComponentsBuilder.fromPath("/players/{username}/monsters")
                    .queryParam("monsterId", monsterId)
                    .buildAndExpand(username)
                    .encode()
                    .toUriString();

            httpClient.post(
                    serviceUrl,
                    path,
                    null,
                    Void.class
            );
            log.info("Added monster {} to player {}", monsterId, username);
        } catch (Exception e) {
            log.error("Failed to add monster {} to player {}: {}", monsterId, username, e.getMessage());
            throw new RuntimeException("Failed to add monster to player: " + e.getMessage(), e);
        }
    }

    /**
     * Retire un monstre de la liste des monstres du joueur.
     */
    public void removeMonsterFromPlayer(String username, UUID monsterId) {
        try {
            String path = UriComponentsBuilder.fromPath("/players/{username}/monsters/{monsterId}")
                    .buildAndExpand(username, monsterId)
                    .encode()
                    .toUriString();

            httpClient.delete(
                    serviceUrl,
                    path,
                    Void.class
            );
            log.info("Removed monster {} from player {}", monsterId, username);
        } catch (Exception e) {
            log.error("Failed to remove monster {} from player {}: {}", monsterId, username, e.getMessage());
            // On ne fait pas échouer la suppression du monstre si le player n'est pas joignable
            // Le monstre sera supprimé de la base Monster, le player sera désynchronisé temporairement
        }
    }
}
