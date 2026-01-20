package fr.imt.nord.fisa.ti.gatcha.auth.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EncryptService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Encrypte (hachage) une valeur en utilisant BCrypt.
     *
     * @param rawValue valeur en clair (mot de passe, token, etc.)
     * @return valeur hachée
     */
    public String encrypt(String rawValue) {
        if (rawValue == null) {
            throw new IllegalArgumentException("Raw value cannot be null");
        }
        return passwordEncoder.encode(rawValue);
    }

    /**
     * Vérifie si une valeur en clair correspond à une valeur hachée.
     *
     * @param rawValue       valeur en clair
     * @param encryptedValue valeur hachée
     * @return \`true\` si ça matche, sinon \`false\`
     */
    public boolean matches(String rawValue, String encryptedValue) {
        return passwordEncoder.matches(rawValue, encryptedValue);
    }
}
