package fr.imt.nord.fisa.ti.gatcha.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;

@Document(collection = "tokens")
@Getter
@Setter
public class Token {
    private String token;

    @DocumentReference
    private User user;

    private LocalDateTime expiryDate;
}
