package fr.imt.nord.fisa.ti.gatcha.monster.repository;

import fr.imt.nord.fisa.ti.gatcha.monster.model.Monster;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MonsterRepository extends MongoRepository<Monster, UUID> {
    List<Monster> findByOwnerUsername(String ownerUsername);
    boolean existsByIdAndOwnerUsername(UUID id, String ownerUsername);
}
