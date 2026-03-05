package fr.imt.nord.fisa.ti.gatcha.monster.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requête de renommage d'un monstre")
public class RenameMonsterDTO {
    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 1, max = 30, message = "Le nom doit contenir entre 1 et 30 caractères")
    @Schema(description = "Nouveau nom du monstre", example = "Flamby")
    private String name;
}
