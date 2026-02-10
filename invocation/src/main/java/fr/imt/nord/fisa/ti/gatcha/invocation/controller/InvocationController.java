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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        InvocationDTO result = invocationService.invoke();
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

    @PostMapping("/templates")
    @Operation(summary = "Ajouter un nouveau template de monstre")
    public ResponseEntity<MonsterTemplate> createTemplate(@RequestBody MonsterTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invocationService.createTemplate(template));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "Mettre à jour un template de monstre existant")
    public ResponseEntity<MonsterTemplate> updateTemplate(@org.springframework.web.bind.annotation.PathVariable int id, @RequestBody MonsterTemplate template) {
        return ResponseEntity.ok(invocationService.updateTemplate(id, template));
    }

    @PostMapping("/retry")
    @Operation(summary = "Rejouer les invocations échouées ou en attente")
    public ResponseEntity<List<InvocationDTO>> retryFailedInvocations() {
        return ResponseEntity.ok(invocationService.retryFailedInvocations());
    }
}
