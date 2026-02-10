package fr.imt.nord.fisa.ti.gatcha.invocation.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.common.service.BaseClientService;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.PlayerResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PlayerClientService extends BaseClientService {

    public PlayerClientService(
            HttpClient httpClient,
            @Value("${player.service.url:http://localhost:8081}") String playerServiceUrl) {
        super(httpClient, playerServiceUrl);
    }

    public PlayerResponse getPlayer(String username) {
        return httpClient.get(
                serviceUrl,
                "/players/" + username,
                PlayerResponse.class
        );
    }
}

