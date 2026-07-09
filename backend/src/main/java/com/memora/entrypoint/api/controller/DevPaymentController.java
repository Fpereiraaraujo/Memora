package com.memora.entrypoint.api.controller;

import com.memora.core.domain.param.ApprovePaymentOrderParam;
import com.memora.core.usecase.ApprovePaymentOrderUseCase;
import java.util.Map;
import java.util.UUID;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
@RequestMapping("/api/dev/payment-orders")
public class DevPaymentController {

	private final ApprovePaymentOrderUseCase approvePaymentOrderUseCase;

	public DevPaymentController(ApprovePaymentOrderUseCase approvePaymentOrderUseCase) {
		this.approvePaymentOrderUseCase = approvePaymentOrderUseCase;
	}

	@PostMapping("/{paymentOrderId}/approve")
	public ResponseEntity<Map<String, String>> approve(@PathVariable UUID paymentOrderId) {
		approvePaymentOrderUseCase.execute(new ApprovePaymentOrderParam(paymentOrderId));
		return ResponseEntity.ok(Map.of("message", "Pagamento aprovado em modo de desenvolvimento."));
	}
}
