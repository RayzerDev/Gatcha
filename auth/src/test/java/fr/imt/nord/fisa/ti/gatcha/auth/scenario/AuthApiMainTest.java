package fr.imt.nord.fisa.ti.gatcha.auth.scenario;

import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * E2E léger contre le gateway docker (http://localhost:8000).
 * <p>
 * Objectif: tester le comportement "réel" HTTP (gateway + service auth + Mongo) sans MockMvc.
 * <p>
 * Pré-requis:
 * - docker compose up -d (dans /docker)
 */
class AuthApiMainTest {

    private static final String BASE = "http://localhost:8000/api/auth";

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    @Test
    void register_login_verify_happyPath() throws Exception {
        String username = "e2e_" + UUID.randomUUID();
        String password = "pwd";

        // register
        HttpResponse<String> reg = postJson("/users/register", "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}");
        assertEquals(200, reg.statusCode(), reg.body());
        assertTrue(reg.body().contains("token"), reg.body());

        // login
        HttpResponse<String> login = postJson("/users/login", "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}");
        assertEquals(200, login.statusCode(), login.body());
        assertTrue(login.body().contains("token"), login.body());

        String token = extractJsonStringField(login.body());
        assertNotNull(token);
        assertFalse(token.isBlank());

        HttpResponse<String> verifyGet = get(token);

        assertEquals(200, verifyGet.statusCode(), verifyGet.body());
        assertTrue(verifyGet.body().contains("\"status\":true"), verifyGet.body());
    }

    @Test
    void register_duplicate_shouldReturn409() throws Exception {
        String username = "e2e_dup_" + UUID.randomUUID();

        HttpResponse<String> r1 = postJson("/users/register", "{\"username\":\"" + username + "\",\"password\":\"pwd\"}");
        assertEquals(200, r1.statusCode(), r1.body());

        HttpResponse<String> r2 = postJson("/users/register", "{\"username\":\"" + username + "\",\"password\":\"pwd\"}");
        assertEquals(409, r2.statusCode(), r2.body());
    }

    @Test
    void login_wrongPassword_shouldReturn401() throws Exception {
        String username = "e2e_badpwd_" + UUID.randomUUID();

        HttpResponse<String> r1 = postJson("/users/register", "{\"username\":\"" + username + "\",\"password\":\"pwd1\"}");
        assertEquals(200, r1.statusCode(), r1.body());

        HttpResponse<String> login = postJson("/users/login", "{\"username\":\"" + username + "\",\"password\":\"pwd2\"}");
        assertEquals(401, login.statusCode(), login.body());
    }

    @Test
    void verify_missingToken_shouldReturn401() throws Exception {
        // GET sans query param => 400
        HttpResponse<String> r = get(null);
        assertEquals(401, r.statusCode(), r.body());
    }

    @Test
    void register_validation_shouldReturn400() throws Exception {
        // username vide => 400
        HttpResponse<String> r = postJson("/users/register", "{\"username\":\"\",\"password\":\"pwd\"}");
        assertEquals(400, r.statusCode(), r.body());
    }

    @Test
    void login_validation_shouldReturn400() throws Exception {
        // password vide => 400
        HttpResponse<String> r = postJson("/users/login", "{\"username\":\"john\",\"password\":\"\"}");
        assertEquals(400, r.statusCode(), r.body());
    }

    private HttpResponse<String> get(String token) throws Exception {
        HttpRequest.Builder req = HttpRequest.newBuilder()
                .uri(URI.create(BASE + "/tokens/verify"))
                .timeout(Duration.ofSeconds(10))
                .GET();
        if (token != null) {
            req.header("Authorization", "Bearer " + token);
        }
        return client.send(req.build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> postJson(String path, String json) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(BASE + path))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();
        return client.send(req, HttpResponse.BodyHandlers.ofString());
    }

    // Extraction JSON minimaliste (suffisant pour nos réponses simples)
    private static String extractJsonStringField(String json) {
        // cherche "field":"..."
        String needle = "\"" + "token" + "\":";
        int i = json.indexOf(needle);
        if (i < 0) return null;
        int start = json.indexOf('"', i + needle.length());
        if (start < 0) return null;
        int end = json.indexOf('"', start + 1);
        if (end < 0) return null;
        return json.substring(start + 1, end);
    }

}
