package fr.imt.nord.fisa.ti.gatcha.common.client;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.exception.ServiceCommunicationException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Client HTTP générique pour la communication inter-services.
 * Utilise RestClient de Spring Boot 4 et transmet automatiquement le token d'authentification.
 */
@Component
public class HttpClient {

    private final RestClient.Builder restClientBuilder;

    public HttpClient() {
        this.restClientBuilder = RestClient.builder();
    }

    /**
     * Effectue une requête GET
     */
    public <T> T get(String baseUrl, String uri, Class<T> responseType) {
        return createClient(baseUrl)
                .get()
                .uri(uri)
                .headers(this::addAuthHeader)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new ServiceCommunicationException(
                            "GET " + uri + " failed: " + response.getStatusCode(),
                            response.getStatusCode().value()
                    );
                })
                .body(responseType);
    }

    /**
     * Effectue une requête POST avec body
     */
    public <T, R> T post(String baseUrl, String uri, R body, Class<T> responseType) {
        RestClient.RequestBodySpec request = createClient(baseUrl)
                .post()
                .uri(uri)
                .headers(this::addAuthHeader)
                .contentType(MediaType.APPLICATION_JSON);

        if (body != null) {
            request.body(body);
        }

        return request
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, response) -> {
                    throw new ServiceCommunicationException(
                            "POST " + uri + " failed: " + response.getStatusCode(),
                            response.getStatusCode().value()
                    );
                })
                .body(responseType);
    }

    /**
     * Effectue une requête POST sans body
     */
    public <T> T post(String baseUrl, String uri, Class<T> responseType) {
        return post(baseUrl, uri, null, responseType);
    }

    /**
     * Effectue une requête DELETE
     */
    public <T> T delete(String baseUrl, String uri, Class<T> responseType) {
        return createClient(baseUrl)
                .delete()
                .uri(uri)
                .headers(this::addAuthHeader)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new ServiceCommunicationException(
                            "DELETE " + uri + " failed: " + response.getStatusCode(),
                            response.getStatusCode().value()
                    );
                })
                .body(responseType);
    }

    private RestClient createClient(String baseUrl) {
        return restClientBuilder.baseUrl(baseUrl).build();
    }

    private void addAuthHeader(org.springframework.http.HttpHeaders headers) {
        String token = SecurityContext.getToken();
        if (token != null && !token.isEmpty()) {
            headers.setBearerAuth(token);
        }
    }
}
