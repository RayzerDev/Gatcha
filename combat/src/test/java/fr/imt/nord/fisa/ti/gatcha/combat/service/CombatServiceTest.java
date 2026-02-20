package fr.imt.nord.fisa.ti.gatcha.combat.service;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.MonsterResponse;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.dto.OutputCombatSummaryDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.exception.CombatNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.combat.model.Combat;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatMonsterSnapshot;
import fr.imt.nord.fisa.ti.gatcha.combat.repository.CombatRepository;
import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Combat Service - Tests")
class CombatServiceTest {

    @Mock
    private CombatRepository combatRepository;

    @Mock
    private MonsterClientService monsterClientService;

    @Mock
    private PlayerClientService playerClientService;

    @Mock
    private CombatSimulator combatSimulator;

    @InjectMocks
    private CombatService combatService;

    private UUID combatId;
    private UUID monster1Id;
    private UUID monster2Id;
    private String initiatorUsername;
    private Combat testCombat;

    @BeforeEach
    void setUp() {
        combatId = UUID.randomUUID();
        monster1Id = UUID.randomUUID();
        monster2Id = UUID.randomUUID();
        initiatorUsername = "Player1";

        SecurityContext.set("token", initiatorUsername);

        testCombat = new Combat();
        testCombat.setId(combatId);
        testCombat.setInitiatorUsername(initiatorUsername);
        testCombat.setCreatedAt(LocalDateTime.now());
        testCombat.setMonster1(mockMonsterSnapshot(monster1Id, initiatorUsername));
        testCombat.setMonster2(mockMonsterSnapshot(monster2Id, "Player2"));
        testCombat.setLogs(new ArrayList<>());
    }

    private CombatMonsterSnapshot mockMonsterSnapshot(UUID id, String owner) {
        CombatMonsterSnapshot snap = new CombatMonsterSnapshot();
        snap.setId(id);
        snap.setOwnerUsername(owner);
        return snap;
    }

    @Test
    @DisplayName("getCombatHistory - Retourner tous les combats")
    void getCombatHistory_Success() {
        // Arrange
        when(combatRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(testCombat));

        // Act
        List<OutputCombatSummaryDTO> result = combatService.getCombatHistory();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(combatId, result.getFirst().getId());
        verify(combatRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    @DisplayName("getMyCombatHistory - Retourner les combats du joueur")
    void getMyCombatHistory_Success() {
        // Arrange
        when(combatRepository.findByInitiatorUsernameOrderByCreatedAtDesc(initiatorUsername))
                .thenReturn(Collections.singletonList(testCombat));

        // Act
        List<OutputCombatSummaryDTO> result = combatService.getMyCombatHistory();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(initiatorUsername, result.getFirst().getInitiatorUsername());
    }

    @Test
    @DisplayName("getCombatById - Retourner un combat existant")
    void getCombatById_Success() {
        // Arrange
        when(combatRepository.findById(combatId)).thenReturn(Optional.of(testCombat));

        // Act
        OutputCombatDTO result = combatService.getCombatById(combatId);

        // Assert
        assertNotNull(result);
        assertEquals(combatId, result.getId());
    }

    @Test
    @DisplayName("getCombatById - Exception si combat non trouvé")
    void getCombatById_NotFound() {
        // Arrange
        when(combatRepository.findById(combatId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CombatNotFoundException.class, () -> combatService.getCombatById(combatId));
    }

    @Test
    @DisplayName("startCombat - Succès du lancement")
    void startCombat_Success() {
        // Arrange
        List<MonsterResponse> monsters = Arrays.asList(
                createMockMonsterResponse(monster1Id, initiatorUsername),
                createMockMonsterResponse(monster2Id, "Player2")
        );

        when(monsterClientService.getMonstersByIds(anyList())).thenReturn(monsters);
        when(combatSimulator.simulate(any(), any())).thenReturn(new CombatSimulator.SimulationResult(new ArrayList<>(), monster1Id, initiatorUsername, 5)); // Logs
        when(combatRepository.save(any(Combat.class))).thenAnswer(i -> {
            Combat c = i.getArgument(0);
            c.setId(combatId);
            return c;
        });

        // Lenient stubs because logic might be complex inside verifyCombatEligibility
        Mockito.lenient().doNothing().when(monsterClientService).addExperienceReward(any(), anyDouble());

        // Act
        OutputCombatDTO result = combatService.startCombat(monster1Id, monster2Id);

        // Assert
        assertNotNull(result);
        verify(combatRepository).save(any(Combat.class));
        verify(combatSimulator).simulate(any(), any());
    }

    private MonsterResponse createMockMonsterResponse(UUID id, String owner) {
        return MonsterResponse.builder()
                .id(id)
                .ownerUsername(owner)
                .element(ElementType.FIRE)
                .hp(100).atk(10).def(10).vit(10)
                .skills(new ArrayList<>())
                .build();
    }
}



