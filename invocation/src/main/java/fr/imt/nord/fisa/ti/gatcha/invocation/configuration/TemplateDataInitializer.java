package fr.imt.nord.fisa.ti.gatcha.invocation.configuration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.ElementType;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.Ratio;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.SkillTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.StatType;
import fr.imt.nord.fisa.ti.gatcha.invocation.repository.MonsterTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TemplateDataInitializer implements CommandLineRunner {

    private final MonsterTemplateRepository templateRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (templateRepository.count() > 0) {
            log.info("Monster templates already exist, skipping initialization");
            return;
        }

        log.info("Initializing monster templates from template.json");

        try {
            ClassPathResource resource = new ClassPathResource("template.json");
            InputStream inputStream = resource.getInputStream();

            List<Map<String, Object>> rawTemplates = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            List<MonsterTemplate> templates = rawTemplates.stream()
                    .map(this::convertToMonsterTemplate)
                    .collect(Collectors.toList());

            templateRepository.saveAll(templates);
            log.info("Successfully loaded {} monster templates", templates.size());

        } catch (Exception e) {
            log.error("Failed to initialize monster templates", e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private MonsterTemplate convertToMonsterTemplate(Map<String, Object> raw) {
        List<Map<String, Object>> rawSkills = (List<Map<String, Object>>) raw.get("skills");

        List<SkillTemplate> skills = rawSkills.stream()
                .map(this::convertToSkillTemplate)
                .collect(Collectors.toList());

        return MonsterTemplate.builder()
                .id(((Number) raw.get("_id")).intValue())
                .element(ElementType.fromValue((String) raw.get("element")))
                .hp(((Number) raw.get("hp")).intValue())
                .atk(((Number) raw.get("atk")).intValue())
                .def(((Number) raw.get("def")).intValue())
                .vit(((Number) raw.get("vit")).intValue())
                .skills(skills)
                .lootRate(((Number) raw.get("lootRate")).doubleValue())
                .build();
    }

    @SuppressWarnings("unchecked")
    private SkillTemplate convertToSkillTemplate(Map<String, Object> raw) {
        Map<String, Object> rawRatio = (Map<String, Object>) raw.get("ratio");

        Ratio ratio = Ratio.builder()
                .stat(StatType.fromValue((String) rawRatio.get("stat")))
                .percent(((Number) rawRatio.get("percent")).doubleValue())
                .build();

        return SkillTemplate.builder()
                .num(((Number) raw.get("num")).intValue())
                .dmg(((Number) raw.get("dmg")).intValue())
                .ratio(ratio)
                .cooldown(((Number) raw.get("cooldown")).intValue())
                .lvlMax(((Number) raw.get("lvlMax")).intValue())
                .build();
    }
}
