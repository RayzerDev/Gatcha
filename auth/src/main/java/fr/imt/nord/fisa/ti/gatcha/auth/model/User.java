package fr.imt.nord.fisa.ti.gatcha.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "users")
@Getter
@Setter
public class User {

    @Id
    private UUID id;

    @Indexed(unique = true)
    private String username;

    private String password;
}
