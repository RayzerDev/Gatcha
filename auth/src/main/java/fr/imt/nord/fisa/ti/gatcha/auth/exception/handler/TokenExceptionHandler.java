package fr.imt.nord.fisa.ti.gatcha.auth.exception.handler;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.error.ErrorResponseDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenExpiredException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.TokenNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler pour les exceptions liées à la gestion des tokens.
 */
@Slf4j
@RestControllerAdvice
public class TokenExceptionHandler {

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponseDTO> handleTokenExpired(
            TokenExpiredException ex,
            HttpServletRequest request) {

        log.warn("Token expired at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleTokenNotFound(
            TokenNotFoundException ex,
            HttpServletRequest request) {

        log.warn("Token not found at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
