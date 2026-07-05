package com.memora.entrypoint.api.controller.definition;

import com.memora.entrypoint.api.dto.InfinitePayWebhookRequestDto;
import com.memora.entrypoint.api.dto.InfinitePayWebhookResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "payments", description = "Payment provider webhooks")
@Validated
public interface PaymentControllerApi {

	@PostMapping("/api/payments/infinitepay/webhook")
	@Operation(
		summary = "InfinitePay webhook",
		description = "Receives payment confirmation callbacks from InfinitePay.",
		responses = {
			@ApiResponse(responseCode = "200", description = "Webhook processed"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Invalid token")
		}
	)
	ResponseEntity<InfinitePayWebhookResponseDto> infinitePayWebhook(
		@RequestParam String token,
		@Valid @RequestBody InfinitePayWebhookRequestDto request
	);
}
