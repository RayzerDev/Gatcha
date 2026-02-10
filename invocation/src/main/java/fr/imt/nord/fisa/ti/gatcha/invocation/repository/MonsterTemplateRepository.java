package fr.imt.nord.fisa.ti.gatcha.invocation.repository;

import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonsterTemplateRepository extends MongoRepository<MonsterTemplate, Integer> {
}
