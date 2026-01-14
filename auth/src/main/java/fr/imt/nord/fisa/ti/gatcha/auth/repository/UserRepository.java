package fr.imt.nord.fisa.ti.gatcha.auth.repository;

import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}
