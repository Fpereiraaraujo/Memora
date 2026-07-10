package com.memora.shared;

import java.time.LocalDate;
import java.time.ZoneId;

public final class EventDatePolicy {
    private static final ZoneId BUSINESS_TIME_ZONE = ZoneId.of("America/Sao_Paulo");

    private EventDatePolicy() {
    }

    public static void validateNotPast(LocalDate eventDate) {
        if (eventDate != null && eventDate.isBefore(today())) {
            throw new IllegalArgumentException("A data do evento nao pode estar no passado.");
        }
    }

    public static LocalDate today() {
        return LocalDate.now(BUSINESS_TIME_ZONE);
    }
}
