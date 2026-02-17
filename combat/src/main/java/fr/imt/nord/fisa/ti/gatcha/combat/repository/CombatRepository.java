package fr.imt.nord.fisa.ti.gatcha.combat.repository;

import fr.imt.nord.fisa.ti.gatcha.combat.model.Combat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CombatRepository extends MongoRepository<Combat, UUID> {

    List<Combat> findByInitiatorUsernameOrderByCreatedAtDesc(String username);

    List<Combat> findAllByOrderByCreatedAtDesc();
}
