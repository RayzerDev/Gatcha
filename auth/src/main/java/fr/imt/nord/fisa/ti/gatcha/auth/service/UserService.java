package fr.imt.nord.fisa.ti.gatcha.auth.service;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputRegisterDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.OutputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.InvalidCredentialsException;
import fr.imt.nord.fisa.ti.gatcha.auth.exception.UserAlreadyExistsException;
import fr.imt.nord.fisa.ti.gatcha.auth.model.User;
import fr.imt.nord.fisa.ti.gatcha.auth.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TokenService tokenService;

    /**
     * Authentifie un utilisateur et génère un token.
     *
     * @param inputLoginDTO DTO contenant username et password
     * @return OutputLoginDTO contenant le token généré
     * @throws InvalidCredentialsException si les identifiants sont invalides
     */
    public OutputLoginDTO login(InputLoginDTO inputLoginDTO) {
        log.info("Login attempt for user: {}", inputLoginDTO.getUsername());

        Optional<User> userOptional = userRepository.findByUsername(inputLoginDTO.getUsername());

        if (userOptional.isEmpty()) {
            log.warn("Login failed: user not found - {}", inputLoginDTO.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(inputLoginDTO.getPassword())) {
            log.warn("Login failed: invalid password for user - {}", inputLoginDTO.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        log.info("User authenticated successfully: {}", user.getUsername());

        String token = tokenService.generateToken(user);
        OutputLoginDTO outputLoginDTO = new OutputLoginDTO();
        outputLoginDTO.setToken(token);
        outputLoginDTO.setMessage("Login successful");
        return outputLoginDTO;
    }

    /**
     * Enregistre un nouvel utilisateur et génère un token.
     *
     * @param inputRegisterDTO DTO contenant username et password
     * @return OutputLoginDTO contenant le token généré
     * @throws UserAlreadyExistsException si le username existe déjà
     */
    public OutputLoginDTO register(InputRegisterDTO inputRegisterDTO) {
        log.info("Registration attempt for username: {}", inputRegisterDTO.getUsername());

        Optional<User> userOptional = userRepository.findByUsername(inputRegisterDTO.getUsername());

        if (userOptional.isPresent()) {
            log.warn("Registration failed: username already exists - {}", inputRegisterDTO.getUsername());
            throw new UserAlreadyExistsException(inputRegisterDTO.getUsername());
        }

        User newUser = new User();
        newUser.setId(UUID.randomUUID());
        newUser.setUsername(inputRegisterDTO.getUsername());
        newUser.setPassword(inputRegisterDTO.getPassword());
        userRepository.save(newUser);

        log.info("User registered successfully: {}", newUser.getUsername());

        String token = tokenService.generateToken(newUser);
        OutputLoginDTO outputLoginDTO = new OutputLoginDTO();
        outputLoginDTO.setToken(token);
        outputLoginDTO.setMessage("Registration successful");
        return outputLoginDTO;
    }

}
