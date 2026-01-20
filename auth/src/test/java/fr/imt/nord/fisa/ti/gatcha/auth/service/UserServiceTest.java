package fr.imt.nord.fisa.ti.gatcha.auth.service;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputRegisterDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.OutputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.InvalidCredentialsException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.UserAlreadyExistsException;
import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private EncryptService encryptService;

    @InjectMocks
    private UserService userService;

    @Test
    void login_WithValidCredentials_ShouldReturnTokenAndMessage_AndGenerateTokenOnce() throws Exception {
        User user = new User();
        user.setUsername("john");
        user.setPassword("encryptedPwd");

        InputLoginDTO input = new InputLoginDTO();
        input.setUsername("john");
        input.setPassword("pwd");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(encryptService.matches("pwd", "encryptedPwd")).thenReturn(true);
        when(tokenService.generateToken(user)).thenReturn("token123");

        OutputLoginDTO out = userService.login(input);

        assertNotNull(out);
        assertEquals("token123", out.getToken());
        assertEquals("Login successful", out.getMessage());

        verify(userRepository, times(1)).findByUsername("john");
        verify(encryptService, times(1)).matches("pwd", "encryptedPwd");
        verify(tokenService, times(1)).generateToken(user);
        verifyNoMoreInteractions(tokenService);
    }

    @Test
    void login_WithUnknownUser_ShouldThrowInvalidCredentials_AndNotGenerateToken() {
        InputLoginDTO input = new InputLoginDTO();
        input.setUsername("ghost");
        input.setPassword("pwd");

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> userService.login(input));
        verify(tokenService, never()).generateToken(any());
    }

    @Test
    void login_WithWrongPassword_ShouldThrowInvalidCredentials_AndNotGenerateToken() {
        User user = new User();
        user.setUsername("john");
        user.setPassword("encryptedCorrect");

        InputLoginDTO input = new InputLoginDTO();
        input.setUsername("john");
        input.setPassword("wrong");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(encryptService.matches("wrong", "encryptedCorrect")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> userService.login(input));
        verify(encryptService, times(1)).matches("wrong", "encryptedCorrect");
        verify(tokenService, never()).generateToken(any());
    }

    @Test
    void register_WhenUsernameAlreadyExists_ShouldThrow409_AndNotSaveOrGenerateToken() {
        InputRegisterDTO input = new InputRegisterDTO();
        input.setUsername("john");
        input.setPassword("pwd");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> userService.register(input));

        verify(userRepository, never()).save(any(User.class));
        verify(tokenService, never()).generateToken(any());
    }

    @Test
    void register_WhenNewUser_ShouldSaveUser_AndGenerateToken() throws Exception {
        InputRegisterDTO input = new InputRegisterDTO();
        input.setUsername("alice");
        input.setPassword("pwd");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.empty());
        when(encryptService.encrypt("pwd")).thenReturn("encryptedPwd");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tokenService.generateToken(any(User.class))).thenReturn("tokenABC");

        OutputLoginDTO out = userService.register(input);

        assertNotNull(out);
        assertEquals("tokenABC", out.getToken());
        assertEquals("Registration successful", out.getMessage());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User saved = userCaptor.getValue();

        assertNotNull(saved.getId());
        assertEquals("alice", saved.getUsername());
        assertEquals("encryptedPwd", saved.getPassword());

        verify(encryptService, times(1)).encrypt("pwd");
        verify(tokenService, times(1)).generateToken(saved);
    }
}
