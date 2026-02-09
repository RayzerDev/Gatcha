package fr.imt.nord.fisa.ti.gatcha.invocation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "fr.imt.nord.fisa.ti.gatcha.invocation",
        "fr.imt.nord.fisa.ti.gatcha.common"
})
public class InvocationApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvocationApplication.class, args);
    }

}
