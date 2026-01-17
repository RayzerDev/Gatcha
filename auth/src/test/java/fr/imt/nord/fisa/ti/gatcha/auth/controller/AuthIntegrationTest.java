package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.model.Token;
import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.TokenRepository;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.UserRepository;
import fr.imt.nord.fisa.ti.gatcha.auth.service.EncryptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@org.springframework.boot.test.context.SpringBootTest
@org.springframework.test.context.junit.jupiter.web.SpringJUnitWebConfig
class AuthIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private TokenRepository tokenRepository;

    @MockitoBean
    private EncryptService encryptService;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        Mockito.reset(userRepository, tokenRepository, encryptService);
    }

    @Test
    void register_WhenUserAlreadyExists_ShouldReturn409() throws Exception {
        Mockito.when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"john\",\"password\":\"pwd\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void login_WithUnknownUser_ShouldReturn401() throws Exception {
        Mockito.when(userRepository.findByUsername("ghost"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ghost\",\"password\":\"pwd\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void verifyToken_GetWithoutTokenParam_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/tokens/verify"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void verifyToken_WithExpiredToken_ShouldReturn401() throws Exception {
        String tokenString = "expired";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("bob");

        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setToken(tokenString);
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().minusMinutes(1));

        Mockito.when(tokenRepository.findByToken(tokenString))
                .thenReturn(Optional.of(token));

        mockMvc.perform(get("/tokens/verify")
                        .param("token", tokenString))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void register_WhenNewUser_ShouldReturn200() throws Exception {
        Mockito.when(userRepository.findByUsername("alice"))
                .thenReturn(Optional.empty());

        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Mockito.when(encryptService.encrypt(Mockito.anyString())).thenReturn("encrypted-token");
        Mockito.when(tokenRepository.save(Mockito.any(Token.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"pwd\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("encrypted-token"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void register_WhenSameUserTwice_ShouldReturn409() throws Exception {
        Mockito.when(userRepository.findByUsername("alice"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(new User()));

        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Mockito.when(encryptService.encrypt(Mockito.anyString())).thenReturn("encrypted-token");
        Mockito.when(tokenRepository.save(Mockito.any(Token.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"pwd\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"pwd\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void verifyToken_WithNonExistentToken_ShouldReturn401() throws Exception {
        Mockito.when(tokenRepository.findByToken("nope"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/tokens/verify")
                        .param("token", "nope"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void verifyToken_WithValidToken_ShouldReturn200_AndExtendExpiry() throws Exception {
        String tokenString = "valid";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("bob");

        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setUser(user);
        token.setToken(tokenString);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        Mockito.when(tokenRepository.findByToken(tokenString)).thenReturn(Optional.of(token));
        Mockito.when(tokenRepository.save(Mockito.any(Token.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(get("/tokens/verify")
                        .header("Authorization", "Bearer " + tokenString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.username").value("bob"))
                .andExpect(jsonPath("$.message").value("Token valid"));

        // expiry must be extended
        org.mockito.ArgumentCaptor<Token> captor = org.mockito.ArgumentCaptor.forClass(Token.class);
        Mockito.verify(tokenRepository).save(captor.capture());
        assertTrue(captor.getValue().getExpiryDate().isAfter(LocalDateTime.now().plusMinutes(55)));
    }

    @Test
    void login_WithWrongPassword_ShouldReturn401() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("bob");
        user.setPassword("correct");

        Mockito.when(userRepository.findByUsername("bob"))
                .thenReturn(Optional.of(user));

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"bob\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void register_WithBlankUsername_ShouldReturn400() throws Exception {
        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"pwd\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void register_WithBlankPassword_ShouldReturn400() throws Exception {
        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void login_WithBlankUsername_ShouldReturn400() throws Exception {
        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"pwd\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void verifyToken_WithValidToken_ShouldReturn200() throws Exception {
        String tokenString = "valid-post";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("bob");

        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setUser(user);
        token.setToken(tokenString);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        Mockito.when(tokenRepository.findByToken(tokenString)).thenReturn(Optional.of(token));
        Mockito.when(tokenRepository.save(Mockito.any(Token.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(get("/tokens/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + tokenString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.username").value("bob"))
                .andExpect(jsonPath("$.message").value("Token valid"));
    }
}
