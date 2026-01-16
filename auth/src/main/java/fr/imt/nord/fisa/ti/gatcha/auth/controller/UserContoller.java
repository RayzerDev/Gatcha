package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputRegisterDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.OutputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.InvalidCredentialsException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.UserAlreadyExistsException;
import fr.imt.nord.fisa.ti.gatcha.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
@Tag(name = "Authentication", description = "API d'authentification des utilisateurs")
public class UserContoller {

    private final UserService userService;

    @Operation(
            summary = "Connexion utilisateur",
            description = "Authentifie un utilisateur avec son identifiant et mot de passe, puis retourne un token valide pendant 1 heure"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentification réussie",
                    content = @Content(schema = @Schema(implementation = OutputLoginDTO.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Identifiants invalides"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Données de requête invalides"
            )
    })
    @PostMapping("/login")
    public OutputLoginDTO login(@Valid @RequestBody InputLoginDTO userLoginDTO) throws InvalidCredentialsException {
        return userService.login(userLoginDTO);
    }

    @Operation(
            summary = "Enregistrement utilisateur",
            description = "Crée un nouvel utilisateur et retourne un token d'authentification"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Enregistrement réussi",
                    content = @Content(schema = @Schema(implementation = OutputLoginDTO.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Le nom d'utilisateur existe déjà"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Données de requête invalides"
            )
    })
    @PostMapping("/register")
    public OutputLoginDTO register(@Valid @RequestBody InputRegisterDTO inputRegisterDTO) throws UserAlreadyExistsException {
        return userService.register(inputRegisterDTO);
    }
}
