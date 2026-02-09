package fr.imt.nord.fisa.ti.gatcha.invocation.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.PlayerResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service pour la communication avec l'API Player via HttpClient.
 */
@Slf4j
@Service
public class PlayerClientService {

    private final HttpClient httpClient;
    private final String playerServiceUrl;

    public PlayerClientService(
            HttpClient httpClient,
            @Value("${player.service.url:http://localhost:8082}") String playerServiceUrl) {
        this.httpClient = httpClient;
        this.playerServiceUrl = playerServiceUrl;
    }

    public PlayerResponse addMonsterToPlayer(String username, UUID monsterId) {
        log.debug("Adding monster {} to player {}", monsterId, username);

        PlayerResponse response = httpClient.post(
                playerServiceUrl,
                "/players/" + username + "/monsters?monsterId=" + monsterId,
                PlayerResponse.class
        );

        log.info("Monster {} added to player {}", monsterId, username);
        return response;
    }
}
