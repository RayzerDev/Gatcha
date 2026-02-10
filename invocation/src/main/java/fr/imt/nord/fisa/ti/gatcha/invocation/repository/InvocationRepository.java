package fr.imt.nord.fisa.ti.gatcha.invocation.repository;

import fr.imt.nord.fisa.ti.gatcha.invocation.model.Invocation;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.InvocationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvocationRepository extends MongoRepository<Invocation, UUID> {
    List<Invocation> findByUsername(String username);
    List<Invocation> findByStatus(InvocationStatus status);
    List<Invocation> findByStatusIn(List<InvocationStatus> statuses);
}
