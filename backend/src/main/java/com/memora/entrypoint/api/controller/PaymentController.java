package com.memora.entrypoint.api.controller;

import com.memora.core.usecase.HandleInfinitePayWebhookUseCase;
import com.memora.entrypoint.api.controller.definition.PaymentControllerApi;
import com.memora.entrypoint.api.dto.InfinitePayWebhookRequestDto;
import com.memora.entrypoint.api.dto.InfinitePayWebhookResponseDto;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.config.AppProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController implements PaymentControllerApi {

	private final HandleInfinitePayWebhookUseCase handleInfinitePayWebhookUseCase;
	private final AppProperties appProperties;

	public PaymentController(
		HandleInfinitePayWebhookUseCase handleInfinitePayWebhookUseCase,
		AppProperties appProperties
	) {
		this.handleInfinitePayWebhookUseCase = handleInfinitePayWebhookUseCase;
		this.appProperties = appProperties;
	}

	@Override
	public ResponseEntity<InfinitePayWebhookResponseDto> infinitePayWebhook(
		String token,
		InfinitePayWebhookRequestDto request
	) {
		if (appProperties.infinitepayWebhookToken() == null || appProperties.infinitepayWebhookToken().isBlank()) {
			throw new IllegalStateException("InfinitePay webhook token is not configured");
		}

		if (!appProperties.infinitepayWebhookToken().equals(token)) {
			throw new SecurityException("Invalid webhook token");
		}

		handleInfinitePayWebhookUseCase.execute(new HandleInfinitePayWebhookParam(
			request.orderNsu(),
			request.transactionNsu(),
			request.invoiceSlug(),
			request.amount(),
			request.paidAmount(),
			request.receiptUrl()
		));

		return ResponseEntity.ok(new InfinitePayWebhookResponseDto(true, "Webhook processed"));
	}
}
