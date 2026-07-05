package com.memora.dataprovider.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.memora.config.InfinitePayProperties;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class InfinitePayCheckoutClient {

	private final RestClient restClient;
	private final InfinitePayProperties infinitePayProperties;

	public InfinitePayCheckoutClient(InfinitePayProperties infinitePayProperties) {
		this.infinitePayProperties = infinitePayProperties;
		this.restClient = RestClient.builder()
			.baseUrl(normalizeBaseUrl(infinitePayProperties.apiBaseUrl()))
			.defaultHeaders(this::applyAuthHeader)
			.build();
	}

	public CreateCheckoutLinkResponse createCheckoutLink(CreateCheckoutLinkRequest request) {
		return restClient.post()
			.uri("/links")
			.contentType(MediaType.APPLICATION_JSON)
			.body(request)
			.retrieve()
			.body(CreateCheckoutLinkResponse.class);
	}

	public PaymentCheckResponse paymentCheck(PaymentCheckRequest request) {
		return restClient.post()
			.uri("/payment_check")
			.contentType(MediaType.APPLICATION_JSON)
			.body(request)
			.retrieve()
			.body(PaymentCheckResponse.class);
	}

	public String handle() {
		if (infinitePayProperties.handle() == null || infinitePayProperties.handle().isBlank()) {
			throw new IllegalStateException("InfinitePay handle is not configured");
		}

		return infinitePayProperties.handle();
	}

	private void applyAuthHeader(HttpHeaders headers) {
		if (infinitePayProperties.authHeaderName() == null || infinitePayProperties.authHeaderName().isBlank()) {
			return;
		}

		if (infinitePayProperties.authHeaderValue() == null || infinitePayProperties.authHeaderValue().isBlank()) {
			return;
		}

		headers.set(infinitePayProperties.authHeaderName(), infinitePayProperties.authHeaderValue());
		headers.setAccept(List.of(MediaType.APPLICATION_JSON));
	}

	private String normalizeBaseUrl(String apiBaseUrl) {
		if (apiBaseUrl == null || apiBaseUrl.isBlank()) {
			return "https://api.checkout.infinitepay.io";
		}

		return apiBaseUrl.endsWith("/") ? apiBaseUrl.substring(0, apiBaseUrl.length() - 1) : apiBaseUrl;
	}

	public record CreateCheckoutLinkRequest(
		String handle,
		List<CheckoutItem> items,
		@JsonProperty("order_nsu") String orderNsu,
		@JsonProperty("redirect_url") String redirectUrl,
		@JsonProperty("webhook_url") String webhookUrl
	) {
	}

	public record CheckoutItem(
		String name,
		int quantity,
		int price
	) {
	}

	public record CreateCheckoutLinkResponse(
		@JsonProperty("checkout_url") String checkoutUrl,
		@JsonProperty("order_nsu") String orderNsu
	) {
	}

	public record PaymentCheckRequest(
		String handle,
		@JsonProperty("order_nsu") String orderNsu,
		@JsonProperty("transaction_nsu") String transactionNsu,
		String slug
	) {
	}

	public record PaymentCheckResponse(
		boolean success,
		boolean paid,
		Integer amount,
		@JsonProperty("paid_amount") Integer paidAmount,
		@JsonProperty("transaction_nsu") String transactionNsu,
		String slug
	) {
	}
}
