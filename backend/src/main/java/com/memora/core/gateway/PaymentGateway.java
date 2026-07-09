package com.memora.core.gateway;

import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.PaymentVerificationCommand;
import com.memora.core.domain.model.PaymentVerificationResult;

public interface PaymentGateway {
	CheckoutResponse createCheckout(CreateCheckoutCommand command);
	PaymentVerificationResult verifyPayment(PaymentVerificationCommand command);
}
