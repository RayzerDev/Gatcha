package fr.imt.nord.fisa.ti.gatcha.combat.exception.handler;

import fr.imt.nord.fisa.ti.gatcha.combat.dto.ErrorResponseDTO;
import fr.imt.nord.fisa.ti.gatcha.combat.exception.CombatNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.combat.exception.InvalidCombatException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler pour les exceptions liées aux combats.
 */
@Slf4j
@RestControllerAdvice
public class CombatExceptionHandler {

    @ExceptionHandler(CombatNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleCombatNotFound(
            CombatNotFoundException ex,
            HttpServletRequest request) {

        log.warn("Combat not found at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidCombatException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidCombat(
            InvalidCombatException ex,
            HttpServletRequest request) {

        log.warn("Invalid combat at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
