package fr.imt.nord.fisa.ti.gatcha.invocation.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;
import fr.imt.nord.fisa.ti.gatcha.common.dto.CreateMonsterRequest;
import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.common.service.BaseClientService;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.MonsterResponse;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.SkillTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * Service pour la communication avec l'API Monster via HttpClient.
 */
@Slf4j
@Service
public class MonsterClientService extends BaseClientService {

    public MonsterClientService(
            HttpClient httpClient,
            @Value("${monster.service.url:http://localhost:8083}") String monsterServiceUrl) {
        super(httpClient, monsterServiceUrl);
    }

    public MonsterResponse createMonster(MonsterTemplate template, String ownerUsername) {
        CreateMonsterRequest request = CreateMonsterRequest.builder()
                .templateId(template.getId())
                .ownerUsername(ownerUsername)
                .element(ElementType.fromValue(template.getElement().getValue()))
                .hp(template.getHp())
                .atk(template.getAtk())
                .def(template.getDef())
                .vit(template.getVit())
                .skills(template.getSkills().stream()
                        .map(this::convertSkill)
                        .collect(Collectors.toList()))
                .build();

        log.debug("Creating monster from template {} for user {}", template.getId(), ownerUsername);

        MonsterResponse response = httpClient.post(
                serviceUrl,
                "/monsters",
                request,
                MonsterResponse.class
        );

        log.info("Monster created with ID {} for user {}", response.getId(), ownerUsername);
        return response;
    }

    private CreateMonsterRequest.SkillDTO convertSkill(SkillTemplate skill) {
        return CreateMonsterRequest.SkillDTO.builder()
                .num(skill.getNum())
                .dmg(skill.getDmg())
                .ratio(CreateMonsterRequest.RatioDTO.builder()
                        .stat(skill.getRatio().getStat().getValue())
                        .percent(skill.getRatio().getPercent())
                        .build())
                .cooldown(skill.getCooldown())
                .lvl(1) // Niveau initial de la compétence
                .lvlMax(skill.getLvlMax())
                .build();
    }
}
