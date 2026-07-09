package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;

class HealthControllerTest {

	@Test
	void healthReturnsBackendStatus() {
		HealthController controller = new HealthController();

		Map<String, String> response = controller.health();

		assertThat(response).containsEntry("status", "ok");
		assertThat(response).containsEntry("service", "memora-backend");
	}
}
