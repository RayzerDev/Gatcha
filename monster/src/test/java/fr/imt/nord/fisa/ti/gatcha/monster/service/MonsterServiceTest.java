package fr.imt.nord.fisa.ti.gatcha.monster.service;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.dto.CreateMonsterRequest;
import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.common.model.StatType;
import fr.imt.nord.fisa.ti.gatcha.monster.dto.MonsterDTO;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.InvalidValueException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.MonsterNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.MonsterNotOwnedException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.SkillUpgradeException;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Monster;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Ratio;
import fr.imt.nord.fisa.ti.gatcha.monster.model.Skill;
import fr.imt.nord.fisa.ti.gatcha.monster.repository.MonsterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Monster Service - Tests Complets")
class MonsterServiceTest {

    @Mock
    private MonsterRepository monsterRepository;

    @Mock
    private PlayerClientService playerClientService;

    @InjectMocks
    private MonsterService monsterService;

    private Monster testMonster;
    private UUID monsterId;
    private String ownerUsername;

    @BeforeEach
    void setUp() {
        monsterId = UUID.randomUUID();
        ownerUsername = "TestOwner";
        SecurityContext.set("token", ownerUsername);

        List<Skill> skills = createDefaultSkills();
        testMonster = Monster.createFromTemplate(
                1,
                ownerUsername,
                ElementType.FIRE,
                1000,
                500,
                300,
                80,
                skills
        );
        testMonster.setId(monsterId);
    }

    private List<Skill> createDefaultSkills() {
        List<Skill> skills = new ArrayList<>();
        skills.add(Skill.createFromBase(1, 100, new Ratio(StatType.ATK, 25), 0, 5));
        skills.add(Skill.createFromBase(2, 200, new Ratio(StatType.ATK, 30), 2, 5));
        skills.add(Skill.createFromBase(3, 400, new Ratio(StatType.ATK, 40), 5, 5));
        return skills;
    }

    private List<CreateMonsterRequest.SkillDTO> createDefaultSkillDTOs() {
        List<CreateMonsterRequest.SkillDTO> skills = new ArrayList<>();
        skills.add(CreateMonsterRequest.SkillDTO.builder()
                .num(1)
                .dmg(100)
                .ratio(CreateMonsterRequest.RatioDTO.builder().stat("ATK").percent(25).build())
                .cooldown(0)
                .lvl(1)
                .lvlMax(5)
                .build());
        skills.add(CreateMonsterRequest.SkillDTO.builder()
                .num(2)
                .dmg(200)
                .ratio(CreateMonsterRequest.RatioDTO.builder().stat("ATK").percent(30).build())
                .cooldown(2)
                .lvl(1)
                .lvlMax(5)
                .build());
        return skills;
    }

    // ========== Tests getMonstersByOwner ==========

    @Test
    @DisplayName("getMonstersByOwner - Doit retourner les monstres d'un joueur")
    void getMonstersByOwner_Success() {
        Monster monster2 = Monster.createFromTemplate(2, ownerUsername, ElementType.WATER, 1500, 400, 500, 70, createDefaultSkills());
        when(monsterRepository.findByOwnerUsername(ownerUsername)).thenReturn(Arrays.asList(testMonster, monster2));

        List<MonsterDTO> result = monsterService.getMonstersByOwner(ownerUsername);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(monsterRepository).findByOwnerUsername(ownerUsername);
    }

    @Test
    @DisplayName("getMonstersByOwner - Doit retourner une liste vide si aucun monstre")
    void getMonstersByOwner_Empty() {
        when(monsterRepository.findByOwnerUsername("NoMonsterUser")).thenReturn(Collections.emptyList());

        List<MonsterDTO> result = monsterService.getMonstersByOwner("NoMonsterUser");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ========== Tests getMonsterById ==========

    @Test
    @DisplayName("getMonsterById - Doit retourner le monstre si le joueur en est propriétaire")
    void getMonsterById_Success() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        MonsterDTO result = monsterService.getMonsterById(monsterId, ownerUsername);

        assertNotNull(result);
        assertEquals(monsterId, result.getId());
        assertEquals(ElementType.FIRE, result.getElement());
        verify(monsterRepository).findById(monsterId);
    }

    @Test
    @DisplayName("getMonsterById - Doit lever une exception si le monstre n'existe pas")
    void getMonsterById_NotFound() {
        UUID unknownId = UUID.randomUUID();
        when(monsterRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(MonsterNotFoundException.class,
                () -> monsterService.getMonsterById(unknownId, ownerUsername));
    }

    @Test
    @DisplayName("getMonsterById - Doit lever une exception si le joueur n'est pas le propriétaire")
    void getMonsterById_NotOwned() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        assertThrows(MonsterNotOwnedException.class,
                () -> monsterService.getMonsterById(monsterId, "WrongOwner"));
    }

    // ========== Tests createMonster ==========

    @Test
    @DisplayName("createMonster - Doit créer un nouveau monstre")
    void createMonster_Success() {
        CreateMonsterRequest request = new CreateMonsterRequest();
        request.setTemplateId(1);
        request.setElement(ElementType.WIND);
        request.setHp(1200);
        request.setAtk(450);
        request.setDef(350);
        request.setVit(85);
        request.setSkills(createDefaultSkillDTOs());

        when(monsterRepository.save(any(Monster.class))).thenAnswer(invocation -> {
            Monster m = invocation.getArgument(0);
            m.setId(UUID.randomUUID());
            return m;
        });
        org.mockito.Mockito.lenient().doNothing().when(playerClientService).addMonsterToPlayer(any(), any());

        MonsterDTO result = monsterService.createMonster(request);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(ElementType.WIND, result.getElement());
        assertEquals("TestOwner", result.getOwnerUsername());
        verify(monsterRepository).save(any(Monster.class));
        verify(playerClientService).addMonsterToPlayer(eq("TestOwner"), any(UUID.class));
    }


    @Test
    @DisplayName("addExperience - Doit ajouter de l'XP au monstre")
    void addExperience_Success() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));
        when(monsterRepository.save(any(Monster.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MonsterDTO result = monsterService.addExperience(monsterId, ownerUsername, 100.0);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(monsterId, result.getId());
        verify(monsterRepository).save(testMonster);
    }

    @Test
    @DisplayName("addExperience - Doit lever une exception si l'XP est négative ou nulle")
    void addExperience_InvalidXp() {
        assertThrows(InvalidValueException.class,
                () -> monsterService.addExperience(monsterId, ownerUsername, -10.0));

        assertThrows(InvalidValueException.class,
                () -> monsterService.addExperience(monsterId, ownerUsername, 0.0));

        verify(monsterRepository, never()).save(any(Monster.class));
    }

    @Test
    @DisplayName("addExperience - Doit faire monter de niveau le monstre")
    void addExperience_LevelUp() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));
        when(monsterRepository.save(any(Monster.class))).thenAnswer(invocation -> invocation.getArgument(0));

        int initialLevel = testMonster.getLevel();

        MonsterDTO result = monsterService.addExperience(monsterId, ownerUsername, 5000.0);

        assertNotNull(result);
        assertTrue(result.getLevel() > initialLevel);
        verify(monsterRepository).save(testMonster);
    }

    // ========== Tests upgradeSkill ==========

    @Test
    @DisplayName("upgradeSkill - Doit améliorer une compétence")
    void upgradeSkill_Success() {
        testMonster.setSkillPoints(1);
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));
        when(monsterRepository.save(any(Monster.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MonsterDTO result = monsterService.upgradeSkill(monsterId, ownerUsername, 1);

        assertNotNull(result);
        assertEquals(0, result.getSkillPoints());
        verify(monsterRepository).save(testMonster);
    }

    @Test
    @DisplayName("upgradeSkill - Doit lever une exception si aucun point de compétence")
    void upgradeSkill_NoPoints() {
        testMonster.setSkillPoints(0);
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        assertThrows(SkillUpgradeException.class,
                () -> monsterService.upgradeSkill(monsterId, ownerUsername, 1));

        verify(monsterRepository, never()).save(any(Monster.class));
    }

    @Test
    @DisplayName("upgradeSkill - Doit lever une exception si la compétence est au niveau max")
    void upgradeSkill_MaxLevel() {
        testMonster.setSkillPoints(1);
        testMonster.getSkills().getFirst().setLvl(5);
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        assertThrows(SkillUpgradeException.class,
                () -> monsterService.upgradeSkill(monsterId, ownerUsername, 1));
    }

    // ========== Tests deleteMonster ==========

    @Test
    @DisplayName("deleteMonster - Doit supprimer le monstre")
    void deleteMonster_Success() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));
        doNothing().when(monsterRepository).delete(testMonster);
        doNothing().when(playerClientService).removeMonsterFromPlayer(ownerUsername, monsterId);

        monsterService.deleteMonster(monsterId, ownerUsername);

        verify(monsterRepository).delete(testMonster);
        verify(playerClientService).removeMonsterFromPlayer(ownerUsername, monsterId);
    }

    @Test
    @DisplayName("deleteMonster - Doit lever une exception si le joueur n'est pas le propriétaire")
    void deleteMonster_NotOwned() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        assertThrows(MonsterNotOwnedException.class,
                () -> monsterService.deleteMonster(monsterId, "WrongOwner"));

        verify(monsterRepository, never()).delete(any(Monster.class));
    }

    // ========== Tests getMonsterByIdInternal ==========

    @Test
    @DisplayName("getMonsterByIdInternal - Doit retourner le monstre sans vérifier le propriétaire")
    void getMonsterByIdInternal_Success() {
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(testMonster));

        MonsterDTO result = monsterService.getMonsterByIdInternal(monsterId);

        assertNotNull(result);
        assertEquals(monsterId, result.getId());
    }

    // ========== Tests getMonstersByIds ==========

    @Test
    @DisplayName("getMonstersByIds - Doit retourner plusieurs monstres")
    void getMonstersByIds_Success() {
        Monster monster2 = Monster.createFromTemplate(2, "TestOwner", ElementType.WATER, 1500, 400, 500, 70, createDefaultSkills());
        UUID monster2Id = UUID.randomUUID();
        monster2.setId(monster2Id);

        when(monsterRepository.findAllByIdInAndOwnerUsername(anyList(), eq("TestOwner")))
                .thenReturn(Arrays.asList(testMonster, monster2));

        List<MonsterDTO> result = monsterService.getMonstersByIds(Arrays.asList(monsterId, monster2Id));

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    // ========== Tests addExperienceInternal ==========

    @Test
    @DisplayName("addExperienceInternal - Doit ajouter de l'XP sans vérifier le propriétaire")
    void addExperienceInternal_Success() {
        when(monsterRepository.findByIdAndOwnerUsername(eq(monsterId), org.mockito.ArgumentMatchers.anyString())).thenReturn(Optional.of(testMonster));
        when(monsterRepository.save(any(Monster.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MonsterDTO result = monsterService.addExperienceInternal(monsterId, 200.0);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(monsterId, result.getId());
        verify(monsterRepository).save(testMonster);
    }
}
