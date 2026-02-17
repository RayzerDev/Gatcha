package fr.imt.nord.fisa.ti.gatcha.combat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "fr.imt.nord.fisa.ti.gatcha.combat",
        "fr.imt.nord.fisa.ti.gatcha.common"
})
public class CombatApplication {

    public static void main(String[] args) {
        SpringApplication.run(CombatApplication.class, args);
    }

}
