package fr.imt.nord.fisa.ti.gatcha.common.filter;

import fr.imt.nord.fisa.ti.gatcha.common.context.SecurityContext;
import fr.imt.nord.fisa.ti.gatcha.common.service.AuthServiceClient;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class TokenValidationFilter extends OncePerRequestFilter {

    private final AuthServiceClient authServiceClient;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final List<String> excludedPaths;

    private static final List<String> DEFAULT_EXCLUDED_PATHS = Arrays.asList(
            "/tokens/**",
            "/users/**",
            "/actuator/health",
            "/swagger-ui/**",
            "/api-docs/**",
            "/health"
    );

    public TokenValidationFilter(
            AuthServiceClient authServiceClient,
            @Value("${auth.filter.excluded.paths:}") String excludedPathsConfig) {
        this.authServiceClient = authServiceClient;
        if (excludedPathsConfig != null && !excludedPathsConfig.trim().isEmpty()) {
            this.excludedPaths = Arrays.asList(excludedPathsConfig.split(","));
        } else {
            this.excludedPaths = List.of();
        }
        log.info("TokenValidationFilter initialized with excluded paths: {}", this.excludedPaths);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String token = extractToken(request);

        log.debug("Processing request: {} {}", request.getMethod(), path);

        if (token == null || token.isEmpty()) {
            log.warn("No token provided for path: {}", path);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"No token provided\"}");
            return;
        }

        if (!authServiceClient.isTokenValid(token)) {
            log.warn("Invalid token for path: {}", path);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Invalid token\"}");
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            SecurityContext.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return excludedPaths.stream().anyMatch(pattern -> pathMatcher.match(pattern, path)) ||
                DEFAULT_EXCLUDED_PATHS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}