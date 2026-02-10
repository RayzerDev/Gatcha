package fr.imt.nord.fisa.ti.gatcha.invocation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "invocations")
public class Invocation {
    @Id
    private UUID id;

    private String username;
    private int templateId;
    private UUID monsterId;
    private InvocationStatus status;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int retryCount;

    public static Invocation create(String username, int templateId) {
        return Invocation.builder()
                .id(UUID.randomUUID())
                .username(username)
                .templateId(templateId)
                .status(InvocationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .retryCount(0)
                .build();
    }

    public void markMonsterCreated(UUID monsterId) {
        this.monsterId = monsterId;
        this.status = InvocationStatus.MONSTER_CREATED;
        this.updatedAt = LocalDateTime.now();
    }

    public void markPlayerUpdated() {
        this.status = InvocationStatus.PLAYER_UPDATED;
        this.updatedAt = LocalDateTime.now();
    }

    public void markCompleted() {
        this.status = InvocationStatus.COMPLETED;
        this.updatedAt = LocalDateTime.now();
    }

    public void markFailed(String errorMessage) {
        this.status = InvocationStatus.FAILED;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
        this.retryCount++;
    }

    public void resetForRetry() {
        this.errorMessage = null;
        this.updatedAt = LocalDateTime.now();
    }
}
