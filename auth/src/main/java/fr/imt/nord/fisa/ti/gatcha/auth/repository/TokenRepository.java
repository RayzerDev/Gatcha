package fr.imt.nord.fisa.ti.gatcha.auth.repository;

import fr.imt.nord.fisa.ti.gatcha.auth.model.Token;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TokenRepository extends MongoRepository<Token, UUID> {
    Optional<Token> findByToken(String token);
}
