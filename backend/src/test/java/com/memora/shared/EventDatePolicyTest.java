package com.memora.shared;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class EventDatePolicyTest {

    @Test
    void acceptsTodayFutureAndUnspecifiedEventDates() {
        assertThatCode(() -> EventDatePolicy.validateNotPast(null)).doesNotThrowAnyException();
        assertThatCode(() -> EventDatePolicy.validateNotPast(LocalDate.now())).doesNotThrowAnyException();
        assertThatCode(() -> EventDatePolicy.validateNotPast(LocalDate.now().plusDays(1))).doesNotThrowAnyException();
    }

    @Test
    void rejectsPastEventDate() {
        assertThatThrownBy(() -> EventDatePolicy.validateNotPast(LocalDate.now().minusDays(1)))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("nao pode estar no passado");
    }
}
