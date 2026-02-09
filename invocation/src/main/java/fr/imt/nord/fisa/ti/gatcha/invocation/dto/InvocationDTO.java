package fr.imt.nord.fisa.ti.gatcha.invocation.dto;

import fr.imt.nord.fisa.ti.gatcha.invocation.model.Invocation;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.InvocationStatus;
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
public class InvocationDTO {
    private UUID id;
    private String username;
    private int templateId;
    private UUID monsterId;
    private InvocationStatus status;
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
