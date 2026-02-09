package fr.imt.nord.fisa.ti.gatcha.invocation.controller;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.InvocationDTO;
import fr.imt.nord.fisa.ti.gatcha.invocation.model.MonsterTemplate;
import fr.imt.nord.fisa.ti.gatcha.invocation.service.InvocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invocations")
@RequiredArgsConstructor
@Tag(name = "Invocations", description = "API d'invocation de monstres")
public class InvocationController {

    private final InvocationService invocationService;

    @PostMapping
    @Operation(summary = "Effectuer une invocation pour obtenir un nouveau monstre")
    public ResponseEntity<InvocationDTO> invoke() {
        String username = SecurityContext.getUsername();
        InvocationDTO result = invocationService.invoke(username);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @Operation(summary = "Récupérer l'historique des invocations du joueur connecté")
    public ResponseEntity<List<InvocationDTO>> getInvocationHistory() {
        String username = SecurityContext.getUsername();
        return ResponseEntity.ok(invocationService.getInvocationHistory(username));
    }

    @GetMapping("/templates")
    @Operation(summary = "Récupérer tous les templates de monstres disponibles")
    public ResponseEntity<List<MonsterTemplate>> getTemplates() {
        return ResponseEntity.ok(invocationService.getAllTemplates());
    }

    @PostMapping("/retry")
    @Operation(summary = "Rejouer les invocations échouées ou en attente")
    public ResponseEntity<List<InvocationDTO>> retryFailedInvocations() {
        return ResponseEntity.ok(invocationService.retryFailedInvocations());
    }
}
