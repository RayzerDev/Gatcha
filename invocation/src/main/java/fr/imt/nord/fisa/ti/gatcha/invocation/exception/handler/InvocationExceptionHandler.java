package fr.imt.nord.fisa.ti.gatcha.invocation.exception.handler;

import fr.imt.nord.fisa.ti.gatcha.common.exception.ServiceCommunicationException;
import fr.imt.nord.fisa.ti.gatcha.invocation.dto.ErrorResponseDTO;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.InvocationFailedException;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.NoTemplateAvailableException;
import fr.imt.nord.fisa.ti.gatcha.invocation.exception.TemplateNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler pour les exceptions liées aux invocations.
 */
@Slf4j
@RestControllerAdvice
public class InvocationExceptionHandler {

    @ExceptionHandler(NoTemplateAvailableException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoTemplateAvailable(
            NoTemplateAvailableException ex,
            HttpServletRequest request) {

        log.error("No templates available at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(TemplateNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleTemplateNotFound(
            TemplateNotFoundException ex,
            HttpServletRequest request) {

        log.warn("Template not found at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvocationFailedException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvocationFailed(
            InvocationFailedException ex,
            HttpServletRequest request) {

        log.error("Invocation failed at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ServiceCommunicationException.class)
    public ResponseEntity<ErrorResponseDTO> handleServiceCommunication(
            ServiceCommunicationException ex,
            HttpServletRequest request) {

        log.error("Service communication error at {}: {}", request.getRequestURI(), ex.getMessage());

        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode());
        if (ex.getStatusCode() < 400 || ex.getStatusCode() >= 600) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        ErrorResponseDTO error = new ErrorResponseDTO(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(error);
    }
}
