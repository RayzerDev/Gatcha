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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;
    private final PlayerClientService playerClientService;

    public List<MonsterDTO> getMonstersByOwner(String ownerUsername) {
        return monsterRepository.findByOwnerUsername(ownerUsername)
                .stream()
                .map(MonsterDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public MonsterDTO getMonsterById(UUID id, String ownerUsername) {
        Monster monster = monsterRepository.findById(id)
                .orElseThrow(() -> new MonsterNotFoundException(id.toString()));

        if (!monster.getOwnerUsername().equals(ownerUsername)) {
            throw new MonsterNotOwnedException(id.toString(), ownerUsername);
        }

        return MonsterDTO.fromEntity(monster);
    }

    public MonsterDTO createMonster(CreateMonsterRequest request) {
        List<Skill> skills = request.getSkills().stream()
                .map(s -> Skill.createFromBase(
                        s.getNum(),
                        s.getDmg(),
                        new Ratio(StatType.fromValue(s.getRatio().getStat()), s.getRatio().getPercent()),
                        s.getCooldown(),
                        s.getLvlMax()
                ))
                .collect(Collectors.toList());

        Monster monster = Monster.createFromTemplate(
                request.getTemplateId(),
                SecurityContext.getUsername(),
                ElementType.valueOf(request.getElement().name()),
                request.getHp(),
                request.getAtk(),
                request.getDef(),
                request.getVit(),
                skills
        );

        Monster saved = monsterRepository.save(monster);
        log.info("Created monster {} for user {}", saved.getId(), SecurityContext.getUsername());

        // Ajouter le monstre à la liste du joueur
        try {
            playerClientService.addMonsterToPlayer(SecurityContext.getUsername(), saved.getId());
        } catch (Exception e) {
            log.error("Failed to add monster {} to player service. Rolling back monster creation.", saved.getId(), e);
            monsterRepository.delete(saved);
            throw e;
        }

        return MonsterDTO.fromEntity(saved);
    }

    public MonsterDTO addExperience(UUID monsterId, String ownerUsername, double xp) {
        if (xp <= 0) {
            throw new InvalidValueException("Experience must be positive");
        }

        Monster monster = getMonsterByIdAndOwner(monsterId, ownerUsername);
        return addExperience(monsterId, xp, monster);
    }

    public MonsterDTO upgradeSkill(UUID monsterId, String ownerUsername, int skillNum) {
        Monster monster = getMonsterByIdAndOwner(monsterId, ownerUsername);

        if (monster.getSkillPoints() <= 0) {
            throw new SkillUpgradeException("No skill points available");
        }

        boolean upgraded = monster.upgradeSkill(skillNum);
        if (!upgraded) {
            throw new SkillUpgradeException(
                    "Cannot upgrade skill " + skillNum + ". Either it doesn't exist or is at max level");
        }

        Monster saved = monsterRepository.save(monster);
        log.info("Monster {} upgraded skill {}", monsterId, skillNum);
        return MonsterDTO.fromEntity(saved);
    }

    public void deleteMonster(UUID monsterId, String ownerUsername) {
        Monster monster = getMonsterByIdAndOwner(monsterId, ownerUsername);
        monsterRepository.delete(monster);
        log.info("Deleted monster {} owned by {}", monsterId, ownerUsername);

        // Retirer le monstre de la liste du joueur
        playerClientService.removeMonsterFromPlayer(ownerUsername, monsterId);
    }

    private Monster getMonsterByIdAndOwner(UUID monsterId, String ownerUsername) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new MonsterNotFoundException(monsterId.toString()));

        if (!monster.getOwnerUsername().equals(ownerUsername)) {
            throw new MonsterNotOwnedException(monsterId.toString(), ownerUsername);
        }

        return monster;
    }

    /**
     * Récupère un monstre par son ID (pour les appels internes, sans vérification de propriétaire)
     */
    public MonsterDTO getMonsterByIdInternal(UUID id) {
        Monster monster = monsterRepository.findById(id)
                .orElseThrow(() -> new MonsterNotFoundException(id.toString()));
        return MonsterDTO.fromEntity(monster);
    }

    /**
     * Récupère plusieurs monstres par leurs IDs (pour les appels internes)
     */
    public List<MonsterDTO> getMonstersByIds(List<UUID> ids) {
        return monsterRepository.findAllByIdInAndOwnerUsername(ids, SecurityContext.getUsername())
                .stream()
                .map(MonsterDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Ajoute de l'expérience à un monstre (pour les appels internes, sans vérification de propriétaire)
     */
    public MonsterDTO addExperienceInternal(UUID monsterId, double xp) {
        if (xp <= 0) {
            throw new InvalidValueException("Experience must be positive");
        }

        Monster monster = monsterRepository.findByIdAndOwnerUsername(monsterId, SecurityContext.getUsername())
                .orElseThrow(() -> new MonsterNotFoundException(monsterId.toString()));
        return addExperience(monsterId, xp, monster);
    }

    private MonsterDTO addExperience(UUID monsterId, double xp, Monster monster) {
        int previousLevel = monster.getLevel();
        monster.addExperience(xp);
        Monster saved = monsterRepository.save(monster);

        if (saved.getLevel() > previousLevel) {
            log.info("Monster {} leveled up from {} to {}", monsterId, previousLevel, saved.getLevel());
        }

        return MonsterDTO.fromEntity(saved);
    }
}
