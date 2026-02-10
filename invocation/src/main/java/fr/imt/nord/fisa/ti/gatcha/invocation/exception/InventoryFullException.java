package fr.imt.nord.fisa.ti.gatcha.invocation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InventoryFullException extends RuntimeException {
    public InventoryFullException(String message) {
        super(message);
    }
}

