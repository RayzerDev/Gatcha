package fr.imt.nord.fisa.ti.gatcha.player.repository;

import fr.imt.nord.fisa.ti.gatcha.player.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlayerRepository extends MongoRepository<Player, UUID> {
    Optional<Player> findByUsername(String username);

    boolean existsByUsername(String username);
}
