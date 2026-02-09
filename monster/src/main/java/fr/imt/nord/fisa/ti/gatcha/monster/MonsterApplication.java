package fr.imt.nord.fisa.ti.gatcha.monster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "fr.imt.nord.fisa.ti.gatcha.monster",
        "fr.imt.nord.fisa.ti.gatcha.common"
})
public class MonsterApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonsterApplication.class, args);
    }

}
