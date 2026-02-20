package fr.imt.nord.fisa.ti.gatcha.combat.service;

import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatLog;
import fr.imt.nord.fisa.ti.gatcha.combat.model.CombatMonsterSnapshot;
import fr.imt.nord.fisa.ti.gatcha.combat.model.SkillSnapshot;
import fr.imt.nord.fisa.ti.gatcha.common.model.ElementType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Simulateur de combat automatique entre deux monstres.
 * Les monstres utilisent leurs compétences dans l'ordre décroissant de leur numéro
 * tant que le cooldown d'utilisation est à 0.
 */
@Slf4j
@Component
public class CombatSimulator {

    private static final int MAX_TURNS = 100;
    private static final double ELEMENT_ADVANTAGE_MULTIPLIER = 1.2;
    private static final double ELEMENT_DISADVANTAGE_MULTIPLIER = 0.8;

    /**
     * Simule un combat automatique entre deux monstres.
     */
    public SimulationResult simulate(CombatMonsterSnapshot monster1, CombatMonsterSnapshot monster2) {
        int m1Hp = monster1.getHp();
        int m2Hp = monster2.getHp();

        // Cooldown trackers : skillNum -> tours restants avant réutilisation
        Map<Integer, Integer> m1Cooldowns = initCooldowns(monster1.getSkills());
        Map<Integer, Integer> m2Cooldowns = initCooldowns(monster2.getSkills());

        List<CombatLog> logs = new ArrayList<>();
        int turn = 0;

        while (m1Hp > 0 && m2Hp > 0 && turn < MAX_TURNS) {
            turn++;

            // Déterminer l'ordre d'attaque par la vitesse (VIT)
            boolean m1First = monster1.getVit() >= monster2.getVit();

            CombatMonsterSnapshot firstAttacker = m1First ? monster1 : monster2;
            CombatMonsterSnapshot firstDefender = m1First ? monster2 : monster1;
            Map<Integer, Integer> firstCooldowns = m1First ? m1Cooldowns : m2Cooldowns;
            int firstAttackerHp = m1First ? m1Hp : m2Hp;
            int firstDefenderHp = m1First ? m2Hp : m1Hp;

            // Premier attaquant agit
            SkillSnapshot skill1 = selectSkill(firstAttacker.getSkills(), firstCooldowns);
            if (skill1 != null) {
                int damage = calculateDamage(firstAttacker, firstDefender, skill1);
                firstDefenderHp = Math.max(0, firstDefenderHp - damage);
                applyCooldown(firstCooldowns, skill1);

                logs.add(CombatLog.builder()
                        .turn(turn)
                        .attackerId(firstAttacker.getId())
                        .defenderId(firstDefender.getId())
                        .skillUsed(skill1.getNum())
                        .damageDealt(damage)
                        .attackerHpRemaining(firstAttackerHp)
                        .defenderHpRemaining(firstDefenderHp)
                        .description(String.format("%s utilise compétence %d et inflige %d dégâts",
                                firstAttacker.getId().toString().substring(0, 8), skill1.getNum(), damage))
                        .build());
            }

            // Mettre à jour les HP
            if (m1First) {
                m2Hp = firstDefenderHp;
            } else {
                m1Hp = firstDefenderHp;
            }

            // Vérifier si le défenseur est KO
            if (firstDefenderHp <= 0) break;

            // Second attaquant agit
            CombatMonsterSnapshot secondAttacker = m1First ? monster2 : monster1;
            CombatMonsterSnapshot secondDefender = m1First ? monster1 : monster2;
            Map<Integer, Integer> secondCooldowns = m1First ? m2Cooldowns : m1Cooldowns;
            int secondAttackerHp = m1First ? m2Hp : m1Hp;
            int secondDefenderHp = m1First ? m1Hp : m2Hp;

            SkillSnapshot skill2 = selectSkill(secondAttacker.getSkills(), secondCooldowns);
            if (skill2 != null) {
                int damage = calculateDamage(secondAttacker, secondDefender, skill2);
                secondDefenderHp = Math.max(0, secondDefenderHp - damage);
                applyCooldown(secondCooldowns, skill2);

                logs.add(CombatLog.builder()
                        .turn(turn)
                        .attackerId(secondAttacker.getId())
                        .defenderId(secondDefender.getId())
                        .skillUsed(skill2.getNum())
                        .damageDealt(damage)
                        .attackerHpRemaining(secondAttackerHp)
                        .defenderHpRemaining(secondDefenderHp)
                        .description(String.format("%s utilise compétence %d et inflige %d dégâts",
                                secondAttacker.getId().toString().substring(0, 8), skill2.getNum(), damage))
                        .build());
            }

            // Mettre à jour les HP
            if (m1First) {
                m1Hp = secondDefenderHp;
            } else {
                m2Hp = secondDefenderHp;
            }

            // Décrémenter les cooldowns en fin de tour
            decrementCooldowns(m1Cooldowns);
            decrementCooldowns(m2Cooldowns);
        }

        // Déterminer le vainqueur
        UUID winnerId;
        String winnerUsername;
        if (m1Hp <= 0) {
            winnerId = monster2.getId();
            winnerUsername = monster2.getOwnerUsername();
        } else if (m2Hp <= 0) {
            winnerId = monster1.getId();
            winnerUsername = monster1.getOwnerUsername();
        } else {
            // Temps écoulé : le monstre avec le plus de HP% restant gagne
            double m1Percent = (double) m1Hp / monster1.getHp();
            double m2Percent = (double) m2Hp / monster2.getHp();
            if (m1Percent >= m2Percent) {
                winnerId = monster1.getId();
                winnerUsername = monster1.getOwnerUsername();
            } else {
                winnerId = monster2.getId();
                winnerUsername = monster2.getOwnerUsername();
            }
        }

        log.info("Combat terminé en {} tours. Vainqueur: {}", turn, winnerId);
        return new SimulationResult(logs, winnerId, winnerUsername, turn);
    }

    /**
     * Initialise les cooldowns de toutes les compétences à 0 (disponibles).
     */
    private Map<Integer, Integer> initCooldowns(List<SkillSnapshot> skills) {
        Map<Integer, Integer> cooldowns = new HashMap<>();
        for (SkillSnapshot skill : skills) {
            cooldowns.put(skill.getNum(), 0);
        }
        return cooldowns;
    }

    /**
     * Sélectionne la compétence à utiliser : ordre décroissant du numéro,
     * première dont le cooldown restant est à 0.
     */
    private SkillSnapshot selectSkill(List<SkillSnapshot> skills, Map<Integer, Integer> cooldowns) {
        return skills.stream()
                .sorted(Comparator.comparingInt(SkillSnapshot::getNum).reversed())
                .filter(s -> cooldowns.getOrDefault(s.getNum(), 0) == 0)
                .findFirst()
                .orElse(null);
    }

    /**
     * Applique le cooldown après utilisation d'une compétence.
     */
    private void applyCooldown(Map<Integer, Integer> cooldowns, SkillSnapshot skill) {
        cooldowns.put(skill.getNum(), skill.getCooldown());
    }

    /**
     * Décrémente tous les cooldowns de 1 (minimum 0).
     */
    private void decrementCooldowns(Map<Integer, Integer> cooldowns) {
        cooldowns.replaceAll((num, cd) -> Math.max(0, cd - 1));
    }

    /**
     * Calcule les dégâts infligés par une compétence.
     * Formule : (dégâts de base × bonus niveau) + (ratio × stat) → multiplicateur élémentaire → - DEF défenseur
     */
    private int calculateDamage(CombatMonsterSnapshot attacker, CombatMonsterSnapshot defender, SkillSnapshot skill) {
        // Dégâts de base avec bonus de niveau de compétence (+10% par niveau au-dessus de 1)
        double baseDmg = skill.getDmg() * (1.0 + 0.1 * (skill.getLvl() - 1));

        // Bonus ratio : pourcentage d'une stat de l'attaquant
        double ratioDmg = attacker.getStatValue(skill.getRatioStat()) * skill.getRatioPercent() / 100.0;

        double rawDmg = baseDmg + ratioDmg;

        // Multiplicateur élémentaire
        double elementMult = getElementMultiplier(attacker.getElement(), defender.getElement());
        rawDmg *= elementMult;

        return Math.max(1, (int) rawDmg - defender.getDef());
    }

    /**
     * Retourne le multiplicateur élémentaire.
     * Feu > Vent > Eau > Feu (triangle classique).
     */
    private double getElementMultiplier(ElementType attacker, ElementType defender) {
        if (attacker == defender) return 1.0;
        return switch (attacker) {
            case FIRE -> defender == ElementType.WIND ? ELEMENT_ADVANTAGE_MULTIPLIER : ELEMENT_DISADVANTAGE_MULTIPLIER;
            case WATER -> defender == ElementType.FIRE ? ELEMENT_ADVANTAGE_MULTIPLIER : ELEMENT_DISADVANTAGE_MULTIPLIER;
            case WIND -> defender == ElementType.WATER ? ELEMENT_ADVANTAGE_MULTIPLIER : ELEMENT_DISADVANTAGE_MULTIPLIER;
        };
    }

    /**
     * Résultat de la simulation contenant les logs et le vainqueur.
     */
    public record SimulationResult(
            List<CombatLog> logs,
            UUID winnerId,
            String winnerUsername,
            int totalTurns
    ) {
    }
}
