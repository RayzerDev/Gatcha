package fr.imt.nord.fisa.ti.gatcha.auth.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EncryptServiceTest {

    private final EncryptService encryptService = new EncryptService();

    @Test
    void encrypt_WithNull_ShouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> encryptService.encrypt(null));
    }

    @Test
    void encrypt_ShouldReturnDifferentHashEachTime_AndMatchesShouldWork() {
        String raw = "hello";

        String h1 = encryptService.encrypt(raw);
        String h2 = encryptService.encrypt(raw);

        assertNotNull(h1);
        assertNotNull(h2);
        assertNotEquals(h1, h2, "BCrypt should produce different hashes due to salt");

        assertTrue(encryptService.matches(raw, h1));
        assertTrue(encryptService.matches(raw, h2));
        assertFalse(encryptService.matches("other", h1));
    }

    @Test
    void matches_WithNullEncrypted_ShouldReturnFalse() {
        assertFalse(encryptService.matches("a", null));
    }

    @Test
    void matches_WithNullRaw_ShouldReturnFalse() {
        assertFalse(encryptService.matches(null, encryptService.encrypt("a")));
    }
}
