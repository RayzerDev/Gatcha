package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.token.OutputVerifyDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenExpiredException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.auth.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tokens")
@AllArgsConstructor
@Tag(name = "Token Verification", description = "API de vérification des tokens d'authentification")
public class TokenController {

    private final TokenService tokenService;

    @Operation(
            summary = "Vérification de token via Authorization header",
            description = "Vérifie la validité d'un token passé dans le header Authorization: Bearer <token>. Si valide, retourne le username et prolonge la durée de validité d'1 heure.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Token valide",
                    content = @Content(schema = @Schema(implementation = OutputVerifyDTO.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token expiré, invalide ou manquant"
            )
    })
    @GetMapping("/verify")
    public OutputVerifyDTO verifyToken(
            @Parameter(hidden = true)
            @RequestHeader(value = "Authorization", required = false) String authHeader) throws TokenExpiredException, TokenNotFoundException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new TokenNotFoundException("Token manquant ou format invalide. Utilisez: Authorization: Bearer <token>");
        }

        String token = authHeader.substring(7); // Enlever "Bearer "
        return tokenService.verifyToken(token);
    }
}
