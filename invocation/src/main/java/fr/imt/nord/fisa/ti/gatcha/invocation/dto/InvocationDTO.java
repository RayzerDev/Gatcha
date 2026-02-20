package fr.imt.nord.fisa.ti.gatcha.invocation.dto;

import fr.imt.nord.fisa.ti.gatcha.invocation.model.Invocation;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.InvocationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Objet de transfert de données pour une invocation")
public class InvocationDTO {
    @Schema(description = "Identifiant unique de l'invocation", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    @Schema(description = "Nom d'utilisateur ayant effectué l'invocation", example = "joueur123")
    private String username;
    @Schema(description = "ID du template de monstre invoqué", example = "5")
    private int templateId;
    @Schema(description = "ID du monstre généré", example = "987e6543-e21b-12d3-a456-426614174000")
    private UUID monsterId;
    @Schema(description = "Statut de l'invocation (PENDING, SUCCESS, FAILED)", example = "SUCCESS")
    private InvocationStatus status;
    @Schema(description = "Date et heure de l'invocation", example = "2023-10-27T10:15:30")
    private LocalDateTime createdAt;

    public static InvocationDTO fromEntity(Invocation invocation) {
        return InvocationDTO.builder()
                .id(invocation.getId())
                .username(invocation.getUsername())
                .templateId(invocation.getTemplateId())
                .monsterId(invocation.getMonsterId())
                .status(invocation.getStatus())
                .createdAt(invocation.getCreatedAt())
                .build();
    }
}
