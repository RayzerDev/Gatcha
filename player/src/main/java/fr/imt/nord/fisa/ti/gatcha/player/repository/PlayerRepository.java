package fr.imt.nord.fisa.ti.gatcha.player.repository;

import java.util.UUID;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import fr.imt.nord.fisa.ti.gatcha.player.model.Player;

@Repository
public interface PlayerRepository extends MongoRepository<Player, UUID> {
}
