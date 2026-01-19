package fr.imt.nord.fisa.ti.gatcha.common.service;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.dto.TokenVerifyResponse;
import fr.imt.nord.fisa.ti.gatcha.common.exception.TokenValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Service
public class AuthServiceClient {

    private final WebClient webClient;
    private final String authServiceUrl;

    public AuthServiceClient(@Value("${auth.service.url:http://localhost:8080}") String authServiceUrl) {
        this.authServiceUrl = authServiceUrl;
        this.webClient = WebClient.builder()
                .baseUrl(authServiceUrl)
                .build();
    }

    private void setCurrentTokenAndUsername(String token, String username) {
        SecurityContext.set(token, username);
        log.debug("Current token and username updated for user: {}", username);
    }

    /**
     * Vérifie la validité d'un token auprès de l'API auth
     *
     * @param token Le token à vérifier
     * @return TokenVerifyResponse avec les informations de validation
     * @throws TokenValidationException si le token est invalide ou expiré
     */
    public TokenVerifyResponse verifyToken(String token) {
        log.debug("Verifying token with auth service at: {}", authServiceUrl);

        try {
            TokenVerifyResponse response = webClient.get()
                    .uri("/tokens/verify")
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(TokenVerifyResponse.class)
                    .block();

            if (response == null || !response.isStatus()) {
                throw new TokenValidationException("Token validation failed: " +
                        (response != null ? response.getMessage() : "No response from auth service"));
            }

            setCurrentTokenAndUsername(token, response.getUsername());
            log.info("Token validated successfully for user: {}", response.getUsername());
            return response;

        } catch (WebClientResponseException e) {
            log.error("Auth service error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new TokenValidationException("Auth service error: " + e.getStatusCode(), e);
        } catch (Exception e) {
            log.error("Error connecting to auth service", e);
            throw new TokenValidationException("Failed to connect to auth service", e);
        }
    }

    /**
     * Vérifie si un token est valide (version simplifiée qui retourne juste un booléen)
     *
     * @param token Le token à vérifier
     * @return true si le token est valide, false sinon
     */
    public boolean isTokenValid(String token) {
        try {
            verifyToken(token);
            return true;
        } catch (TokenValidationException e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extrait le username d'un token valide
     *
     * @param token Le token à vérifier
     * @return Le username associé au token
     * @throws TokenValidationException si le token est invalide
     */
    public String getUsernameFromToken(String token) {
        TokenVerifyResponse response = verifyToken(token);
        return response.getUsername();
    }
}