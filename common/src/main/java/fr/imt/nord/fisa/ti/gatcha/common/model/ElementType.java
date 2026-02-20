package fr.imt.nord.fisa.ti.gatcha.common.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ElementType {
    FIRE("fire"),
    WATER("water"),
    WIND("wind");

    private final String value;

    ElementType(String value) {
        this.value = value;
    }

    @JsonCreator
    public static ElementType fromValue(String value) {
        for (ElementType type : ElementType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum type " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}

