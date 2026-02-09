package fr.imt.nord.fisa.ti.gatcha.invocation.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatType {
    HP("hp"),
    ATK("atk"),
    DEF("def"),
    VIT("vit");

    private final String value;

    StatType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static StatType fromValue(String value) {
        for (StatType type : StatType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown stat type: " + value);
    }
}
