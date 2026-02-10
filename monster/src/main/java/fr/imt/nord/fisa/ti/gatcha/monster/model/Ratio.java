package fr.imt.nord.fisa.ti.gatcha.monster.model;

import fr.imt.nord.fisa.ti.gatcha.common.model.StatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ratio {
    private StatType stat;
    private double percent;
}
