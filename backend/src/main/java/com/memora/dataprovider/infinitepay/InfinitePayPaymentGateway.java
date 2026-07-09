package com.memora.dataprovider.infinitepay;

import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.PaymentVerificationCommand;
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
	public PaymentVerificationResult verifyPayment(PaymentVerificationCommand command) {
		if (command.externalReference() == null || command.externalReference().isBlank()) {
			return new PaymentVerificationResult(
				false,
				false,
				null,
				command.providerPaymentId(),
				command.amountCents(),
				null,
				"missing_reference"
			);
		}

		InfinitePayCheckoutClient.PaymentCheckResponse response = infinitePayCheckoutClient.paymentCheck(
			new InfinitePayCheckoutClient.PaymentCheckRequest(
				infinitePayCheckoutClient.handle(),
				command.externalReference(),
				command.transactionNsu() != null ? command.transactionNsu() : command.providerPaymentId(),
				command.invoiceSlug()
			)
		);

		if (response == null) {
			return new PaymentVerificationResult(
				false,
				false,
				command.externalReference(),
				command.providerPaymentId(),
				command.amountCents(),
				null,
				"empty_response"
			);
		}

		return new PaymentVerificationResult(
			response.success(),
			response.success() && response.paid(),
			command.externalReference(),
			response.transactionNsu() != null ? response.transactionNsu() : command.providerPaymentId(),
			response.amount() != null ? response.amount() : command.amountCents(),
			response.paidAmount(),
			response.paid() ? "approved" : "pending"
		);
	}
}
