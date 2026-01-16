package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.token.InputVerifyDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.token.OutputVerifyDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tokens")
@AllArgsConstructor
@Tag(name = "Token Verification", description = "API de vérification des tokens d'authentification")
public class TokenController {

    private final TokenService tokenService;

    @Operation(
        summary = "Vérification de token (POST)",
        description = "Vérifie la validité d'un token. Si valide, retourne le username et prolonge la durée de validité d'1 heure."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Token valide",
            content = @Content(schema = @Schema(implementation = OutputVerifyDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Token expiré ou invalide"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données de requête invalides"
        )
    })
    @PostMapping("/verify")
    public OutputVerifyDTO verifyToken(@Valid @RequestBody InputVerifyDTO inputVerifyDTO) {
        return tokenService.verifyToken(inputVerifyDTO.getToken());
    }

    @Operation(
        summary = "Vérification de token (GET avec header)",
        description = "Vérifie la validité d'un token passé dans le header Authorization. Format: 'Bearer <token>' ou '<token>'"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Token valide",
            content = @Content(schema = @Schema(implementation = OutputVerifyDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Token expiré ou invalide"
        )
    })
    @GetMapping("/verify")
    public OutputVerifyDTO verifyTokenHeader(
        @Parameter(description = "Token d'authentification (format: 'Bearer <token>' ou '<token>')", required = true)
        @RequestHeader("Authorization") String authHeader) {

        // Extraire le token du header (format: "Bearer token" ou juste "token")
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        return tokenService.verifyToken(token);
    }
}
