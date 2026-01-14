package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.InputRegisterDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.user.OutputLoginDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("api/users")
public class UserContoller {

    @PostMapping("/login")
    public OutputLoginDTO login(@RequestBody InputLoginDTO userLoginDTO) {
        return null;
    }

    @PostMapping("/register")
    public OutputLoginDTO register(@RequestBody InputRegisterDTO inputRegisterDTO) {
        return null;
    }
}
