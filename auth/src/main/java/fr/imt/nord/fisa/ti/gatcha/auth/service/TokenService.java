package fr.imt.nord.fisa.ti.gatcha.auth.service;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.token.OutputVerifyDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenExpiredException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.auth.model.Token;
import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.TokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@AllArgsConstructor
@Service
public class TokenService {
    private final TokenRepository tokenRepository;
    private final EncryptService encryptService;

    /**
     * Génère un token au format : username-date(YYYY/MM/DD)-heure(HH:mm:ss)
     * puis l'encrypte et le sauvegarde en base avec une expiration d'1 heure.
     *
     * @param user L'utilisateur pour lequel générer le token
     * @return Le token encrypté
     */
    public String generateToken(User user) {
        log.info("Generating token for user: {}", user.getUsername());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = now.plusHours(1);

        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String timeStr = now.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        String rawToken = user.getUsername() + "-" + dateStr + "-" + timeStr;

        log.debug("Raw token format: {}", rawToken);

        String encryptedToken = encryptService.encrypt(rawToken);

        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setToken(encryptedToken);
        token.setUser(user);
        token.setExpiryDate(expiryDate);
        tokenRepository.save(token);

        log.info("Token generated successfully for user: {}, expires at: {}", user.getUsername(), expiryDate);

        return encryptedToken;
    }

    /**
     * Vérifie si un token est valide et non expiré.
     * Si valide, met à jour la date d'expiration à maintenant + 1 heure.
     *
     * @param tokenStr Le token à vérifier
     * @return OutputVerifyDTO contenant le statut, le username et un message
     * @throws TokenNotFoundException si le token n'existe pas en base
     * @throws TokenExpiredException  si le token a expiré
     */
    public OutputVerifyDTO verifyToken(String tokenStr) throws TokenNotFoundException, TokenExpiredException {
        log.debug("Verifying token");

        Optional<Token> tokenOptional = tokenRepository.findByToken(tokenStr);

        if (tokenOptional.isEmpty()) {
            log.warn("Token not found in database");
            throw new TokenNotFoundException();
        }

        Token token = tokenOptional.get();
        LocalDateTime now = LocalDateTime.now();

        // Vérifier si le token est expiré
        if (token.getExpiryDate().isBefore(now)) {
            log.warn("Token expired for user: {}, expired at: {}", token.getUser().getUsername(), token.getExpiryDate());
            // Token expiré, le supprimer de la base
            tokenRepository.delete(token);
            throw new TokenExpiredException();
        }

        // Token valide, mettre à jour l'expiration
        LocalDateTime newExpiryDate = now.plusHours(1);
        token.setExpiryDate(newExpiryDate);
        tokenRepository.save(token);

        log.info("Token verified successfully for user: {}, new expiry: {}", token.getUser().getUsername(), newExpiryDate);

        // Construire et retourner le DTO
        OutputVerifyDTO outputVerifyDTO = new OutputVerifyDTO();
        outputVerifyDTO.setStatus(true);
        outputVerifyDTO.setUsername(token.getUser().getUsername());
        outputVerifyDTO.setMessage("Token valid");

        return outputVerifyDTO;
    }
}
