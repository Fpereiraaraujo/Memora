package com.memora.dataprovider.infinitepay;

import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.PaymentVerificationResult;
import com.memora.core.gateway.PaymentGateway;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InfinitePayPaymentGateway implements PaymentGateway {

	private final InfinitePayCheckoutClient infinitePayCheckoutClient;

	public InfinitePayPaymentGateway(InfinitePayCheckoutClient infinitePayCheckoutClient) {
		this.infinitePayCheckoutClient = infinitePayCheckoutClient;
	}

	@Override
	public CheckoutResponse createCheckout(CreateCheckoutCommand command) {
		if (command.plan().getCheckoutUrl() != null && !command.plan().getCheckoutUrl().isBlank()) {
			return new CheckoutResponse(command.plan().getCheckoutUrl(), command.externalReference());
		}

		InfinitePayCheckoutClient.CreateCheckoutLinkResponse response = infinitePayCheckoutClient.createCheckoutLink(
			new InfinitePayCheckoutClient.CreateCheckoutLinkRequest(
				infinitePayCheckoutClient.handle(),
				List.of(new InfinitePayCheckoutClient.CheckoutItem(
					command.plan().getName(),
					1,
					command.plan().getPriceCents()
				)),
				command.externalReference(),
				command.redirectUrl(),
				command.webhookUrl()
			)
		);

		return new CheckoutResponse(
			response != null ? response.checkoutUrl() : null,
			response != null && response.orderNsu() != null ? response.orderNsu() : command.externalReference()
		);
	}

	@Override
	public PaymentVerificationResult verifyPayment(String externalReference, String providerPaymentId, Integer amountCents) {
		if (externalReference == null || externalReference.isBlank()) {
			return new PaymentVerificationResult(false, false, null, providerPaymentId, amountCents, null, "missing_reference");
		}

		InfinitePayCheckoutClient.PaymentCheckResponse response = infinitePayCheckoutClient.paymentCheck(
			new InfinitePayCheckoutClient.PaymentCheckRequest(
				infinitePayCheckoutClient.handle(),
				externalReference,
				providerPaymentId,
				null
			)
		);

		if (response == null) {
			return new PaymentVerificationResult(false, false, externalReference, providerPaymentId, amountCents, null, "empty_response");
		}

		return new PaymentVerificationResult(
			response.success(),
			response.success() && response.paid(),
			externalReference,
			response.transactionNsu() != null ? response.transactionNsu() : providerPaymentId,
			response.amount() != null ? response.amount() : amountCents,
			response.paidAmount(),
			response.paid() ? "approved" : "pending"
		);
	}
}
