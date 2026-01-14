package fr.imt.nord.fisa.ti.gatcha.auth.controller;

import fr.imt.nord.fisa.ti.gatcha.auth.dto.InputLoginDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.InputRegisterDTO;
import fr.imt.nord.fisa.ti.gatcha.auth.dto.OutputLoginDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
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
