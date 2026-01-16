package fr.imt.nord.fisa.ti.gatcha.auth.service;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.token.OutputVerifyDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.model.Token;
import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.TokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private EncryptService encryptService;

    @InjectMocks
    private TokenService tokenService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
    }

    @Test
    void generateToken_ShouldCreateTokenWithCorrectFormat() {
        // Arrange
        String expectedEncryptedToken = "$2a$10$encrypted_token";
        when(encryptService.encrypt(any(String.class))).thenReturn(expectedEncryptedToken);
        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        String actualToken = tokenService.generateToken(testUser);

        // Assert
        assertEquals(expectedEncryptedToken, actualToken);

        // Vérifier que le token a été sauvegardé
        ArgumentCaptor<Token> tokenCaptor = ArgumentCaptor.forClass(Token.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        Token savedToken = tokenCaptor.getValue();
        assertEquals(expectedEncryptedToken, savedToken.getToken());
        assertEquals(testUser, savedToken.getUser());
        assertNotNull(savedToken.getExpiryDate());

        // Vérifier que la date d'expiration est dans environ 1 heure
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = savedToken.getExpiryDate();
        assertTrue(expiryDate.isAfter(now.plusMinutes(59)));
        assertTrue(expiryDate.isBefore(now.plusMinutes(61)));
    }

    @Test
    void verifyToken_WithValidToken_ShouldReturnDTOAndUpdateExpiry() throws Exception {
        // Arrange
        String tokenString = "$2a$10$valid_token";
        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setToken(tokenString);
        token.setUser(testUser);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(30));

        when(tokenRepository.findByToken(tokenString)).thenReturn(Optional.of(token));
        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        OutputVerifyDTO result = tokenService.verifyToken(tokenString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isStatus());
        assertEquals("testuser", result.getUsername());
        assertEquals("Token valid", result.getMessage());

        // Vérifier que l'expiration a été mise à jour
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void verifyToken_WithExpiredToken_ShouldThrowExceptionAndDeleteToken() {
        // Arrange
        String tokenString = "$2a$10$expired_token";
        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setToken(tokenString);
        token.setUser(testUser);
        token.setExpiryDate(LocalDateTime.now().minusMinutes(10)); // Token expiré

        when(tokenRepository.findByToken(tokenString)).thenReturn(Optional.of(token));
        doNothing().when(tokenRepository).delete(token);

        // Act & Assert
        assertThrows(
                fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenExpiredException.class,
                () -> tokenService.verifyToken(tokenString)
        );

        // Vérifier que le token a été supprimé
        verify(tokenRepository).delete(token);
    }

    @Test
    void verifyToken_WithNonExistentToken_ShouldThrowException() {
        // Arrange
        String tokenString = "$2a$10$nonexistent_token";
        when(tokenRepository.findByToken(tokenString)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
                fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenNotFoundException.class,
                () -> tokenService.verifyToken(tokenString)
        );

        // Vérifier qu'aucune suppression n'a été effectuée
        verify(tokenRepository, never()).delete(any(Token.class));
    }
}
