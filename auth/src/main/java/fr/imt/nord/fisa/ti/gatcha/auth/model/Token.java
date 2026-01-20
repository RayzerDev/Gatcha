package fr.imt.nord.fisa.ti.gatcha.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "tokens")
@Getter
@Setter
public class Token {
    @Id
    private UUID id;

    @Indexed(unique = true)
    private String token;

    @DocumentReference
    private User user;

    private LocalDateTime expiryDate;
}
