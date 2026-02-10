package fr.imt.nord.fisa.ti.gatcha.player.service;

import fr.imt.nord.fisa.ti.gatcha.player.dto.entity.PlayerDTO;
import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import fr.imt.nord.fisa.ti.gatcha.player.repository.PlayerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Player Service - Tests Complets")
class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private PlayerService playerService;

    private Player testPlayer;
    private UUID monster1Id;
    private UUID monster2Id;

    @BeforeEach
    void setUp() {
        monster1Id = UUID.randomUUID();
        monster2Id = UUID.randomUUID();

        testPlayer = new Player("TestPlayer");
        testPlayer.addMonster(monster1Id);
        testPlayer.addMonster(monster2Id);
        testPlayer.setLevel(5);
        testPlayer.setExperience(100.0);
        testPlayer.setExperienceStep(50.0);
    }

    // ========== Tests createPlayer ==========

    @Test
    @DisplayName("createPlayer - Doit créer un nouveau joueur avec succès")
    void createPlayer_Success() {
        // Arrange
        when(playerRepository.existsByUsername("NewPlayer")).thenReturn(false);
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.createPlayer("NewPlayer");

        // Assert
        assertNotNull(result);
        assertEquals("NewPlayer", result.getUsername());
        assertEquals(0, result.getLevel());
        verify(playerRepository).save(any(Player.class));
        verify(playerRepository).existsByUsername("NewPlayer");
    }

    @Test
    @DisplayName("createPlayer - Doit lever une exception si le username est null")
    void createPlayer_NullUsername() {
        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> playerService.createPlayer(null));

        assertEquals(400, exception.getStatusCode().value());
        assertTrue(exception.getReason().contains("Username is required"));
        verify(playerRepository, never()).save(any(Player.class));
    }

    @Test
    @DisplayName("createPlayer - Doit lever une exception si le joueur existe déjà")
    void createPlayer_AlreadyExists() {
        // Arrange
        when(playerRepository.existsByUsername("ExistingPlayer")).thenReturn(true);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> playerService.createPlayer("ExistingPlayer"));

        assertEquals(409, exception.getStatusCode().value());
        assertTrue(exception.getReason().contains("already exists"));
        verify(playerRepository, never()).save(any(Player.class));
    }

    @Test
    @DisplayName("getPlayerByUsername - Doit retourner le joueur s'il existe")
    void getPlayer_Found() {
        // Arrange
        when(playerRepository.findByUsername("TestPlayer")).thenReturn(Optional.of(testPlayer));

        // Act
        PlayerDTO result = playerService.getPlayerByUsername("TestPlayer", false);

        // Assert
        assertNotNull(result);
        assertEquals("TestPlayer", result.getUsername());
        assertEquals(5, result.getLevel());
        assertEquals(2, result.getMonsters().size());
    }

    @Test
    @DisplayName("getPlayerByUsername - Doit créer le joueur si createIfNotFound=true")
    void getPlayer_CreateIfNotFound() {
        // Arrange
        when(playerRepository.findByUsername("NewPlayer")).thenReturn(Optional.empty());
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.getPlayerByUsername("NewPlayer", true);

        // Assert
        assertNotNull(result);
        assertEquals("NewPlayer", result.getUsername());
        verify(playerRepository).save(any(Player.class));
    }

    @Test
    @DisplayName("getAllPlayers - Doit retourner tous les joueurs")
    void getAllPlayers_Success() {
        // Arrange
        Player player2 = new Player("Player2");
        when(playerRepository.findAll()).thenReturn(Arrays.asList(testPlayer, player2));

        // Act
        List<PlayerDTO> result = playerService.getAllPlayers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("addExperience - Doit ajouter de l'XP au joueur")
    void addExperience_Success() {
        // Arrange
        when(playerRepository.findByUsername("TestPlayer")).thenReturn(Optional.of(testPlayer));
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.addExperience("TestPlayer", 50.0);

        // Assert
        assertNotNull(result);
        assertEquals(150.0, result.getExperience());
        verify(playerRepository).save(testPlayer);
    }

    @Test
    @DisplayName("levelUp - Doit augmenter le niveau avec assez d'XP")
    void levelUp_Success() {
        // Arrange
        testPlayer.setExperience(100.0);
        testPlayer.setExperienceStep(50.0);
        when(playerRepository.findByUsername("TestPlayer")).thenReturn(Optional.of(testPlayer));
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.levelUp("TestPlayer");

        // Assert
        assertNotNull(result);
        assertTrue(result.getLevel() > 5);
        verify(playerRepository).save(testPlayer);
    }

    @Test
    @DisplayName("addMonster - Doit ajouter un monstre au joueur")
    void addMonster_Success() {
        // Arrange
        UUID newMonsterId = UUID.randomUUID();
        when(playerRepository.findByUsername("TestPlayer")).thenReturn(Optional.of(testPlayer));
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.addMonster("TestPlayer", newMonsterId);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getMonsters().size());
        assertTrue(result.getMonsters().contains(newMonsterId));
        verify(playerRepository).save(testPlayer);
    }

    @Test
    @DisplayName("removeMonster - Doit retirer un monstre du joueur")
    void removeMonster_Success() {
        // Arrange
        when(playerRepository.findByUsername("TestPlayer")).thenReturn(Optional.of(testPlayer));
        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlayerDTO result = playerService.removeMonster("TestPlayer", monster1Id);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getMonsters().size());
        assertFalse(result.getMonsters().contains(monster1Id));
        verify(playerRepository).save(testPlayer);
    }
}

