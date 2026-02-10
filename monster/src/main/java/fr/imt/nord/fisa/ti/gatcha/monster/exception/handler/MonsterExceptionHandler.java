package fr.imt.nord.fisa.ti.gatcha.monster.exception.handler;

import fr.imt.nord.fisa.ti.gatcha.monster.dto.ErrorResponseDTO;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.InvalidValueException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.MonsterNotFoundException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.MonsterNotOwnedException;
import fr.imt.nord.fisa.ti.gatcha.monster.exception.SkillUpgradeException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler pour les exceptions liées aux monstres.
 */
@Slf4j
@RestControllerAdvice
public class MonsterExceptionHandler {

    @ExceptionHandler(MonsterNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleMonsterNotFound(
            MonsterNotFoundException ex,
            HttpServletRequest request) {

        log.warn("Monster not found at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MonsterNotOwnedException.class)
    public ResponseEntity<ErrorResponseDTO> handleMonsterNotOwned(
            MonsterNotOwnedException ex,
            HttpServletRequest request) {

        log.warn("Access denied at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.FORBIDDEN.value(),
                "Forbidden",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(InvalidValueException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidValue(
            InvalidValueException ex,
            HttpServletRequest request) {

        log.warn("Invalid value at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(SkillUpgradeException.class)
    public ResponseEntity<ErrorResponseDTO> handleSkillUpgrade(
            SkillUpgradeException ex,
            HttpServletRequest request) {

        log.warn("Skill upgrade failed at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
