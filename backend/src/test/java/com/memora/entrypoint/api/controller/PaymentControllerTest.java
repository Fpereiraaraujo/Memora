package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.AppProperties;
import com.memora.core.usecase.HandleInfinitePayWebhookUseCase;
import com.memora.entrypoint.api.dto.InfinitePayWebhookRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

	@Mock
	private HandleInfinitePayWebhookUseCase handleInfinitePayWebhookUseCase;

	@Mock
	private AppProperties appProperties;

	private PaymentController controller;

	@BeforeEach
	void setUp() {
		controller = new PaymentController(handleInfinitePayWebhookUseCase, appProperties);
	}

	@Test
	void infinitePayWebhookProcessesValidRequest() {
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");

		ResponseEntity<?> response = controller.infinitePayWebhook(
			"secret-token",
			new InfinitePayWebhookRequestDto("external-1", "order-1", "provider-1", "transaction-1", "invoice-1", "APPROVED", 4990, 4990, "https://receipt")
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		verify(handleInfinitePayWebhookUseCase).execute(any());
	}

	@Test
	void infinitePayWebhookRejectsInvalidToken() {
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");

		assertThatThrownBy(() -> controller.infinitePayWebhook(
			"wrong-token",
			new InfinitePayWebhookRequestDto("external-1", "order-1", "provider-1", "transaction-1", "invoice-1", "APPROVED", 4990, 4990, "https://receipt")
		)).isInstanceOf(SecurityException.class);

		verify(handleInfinitePayWebhookUseCase, never()).execute(any());
	}
}
