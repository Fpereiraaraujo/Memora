package com.memora.core.usecase.imp;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.service.EventCheckoutPricingResolverService;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CreateEventCheckoutUseCaseImp implements CreateEventCheckoutUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(CreateEventCheckoutUseCaseImp.class);

	private final PaymentOrderRepository paymentOrderRepository;
	private final PaymentGateway paymentGateway;
	private final AppProperties appProperties;
	private final EventCheckoutPricingResolverService eventCheckoutPricingResolverService;

	public CreateEventCheckoutUseCaseImp(
		PaymentOrderRepository paymentOrderRepository,
		PaymentGateway paymentGateway,
		AppProperties appProperties,
		EventCheckoutPricingResolverService eventCheckoutPricingResolverService
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.paymentGateway = paymentGateway;
		this.appProperties = appProperties;
		this.eventCheckoutPricingResolverService = eventCheckoutPricingResolverService;
	}

	@Override
	public PaymentOrder execute(CreateEventCheckoutParam param) {
		var resolvedCheckout = eventCheckoutPricingResolverService.resolve(
			param.ownerId(),
			param.eventId(),
			param.planCode(),
			param.couponCode(),
			param.referralCode()
		);
		var event = resolvedCheckout.getEvent();
		var plan = resolvedCheckout.getPlan();
		var pricing = resolvedCheckout.getPricing();

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		paymentOrderRepository.findAllByEventIdAndStatus(event.getId(), PaymentOrderStatus.PENDING)
			.forEach(previousOrder -> paymentOrderRepository.save(previousOrder.toBuilder()
				.status(PaymentOrderStatus.CANCELLED)
				.updatedAt(now)
				.build()));

		UUID paymentOrderId = UUID.randomUUID();
		String externalReference = "MEMORA-" + event.getId() + "-" + paymentOrderId;

		PaymentOrder pendingOrder = PaymentOrder.builder()
			.id(paymentOrderId)
			.eventId(event.getId())
			.userId(event.getOwnerId())
			.planCode(plan.getCode())
			.provider(PaymentProvider.INFINITEPAY)
			.status(PaymentOrderStatus.PENDING)
			.externalReference(externalReference)
			.orderNsu(externalReference)
			.amountCents(pricing.getFinalAmountCents())
			.originalAmountCents(pricing.getOriginalAmountCents())
			.discountAmountCents(pricing.getDiscountAmountCents())
			.finalAmountCents(pricing.getFinalAmountCents())
			.discountPercent(pricing.getDiscountPercent())
			.couponId(pricing.getCouponId())
			.couponCode(pricing.getCouponCode())
			.influencerId(pricing.getInfluencerId())
			.commissionPercent(pricing.getCommissionPercent())
			.commissionAmountCents(pricing.getCommissionAmountCents())
			.createdAt(now)
			.updatedAt(now)
			.build();

		paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(pendingOrder));
		LOGGER.info(
			"Checkout order created paymentOrderId={} eventId={} planCode={} couponCode={}",
			paymentOrderId,
			event.getId(),
			plan.getCode(),
			pricing.getCouponCode()
		);

		String redirectUrl = normalizeBaseUrl(appProperties.publicBaseUrl()) + "/app/events/" + event.getId() + "/checkout";
		String webhookUrl = normalizeBaseUrl(appProperties.apiBaseUrl())
			+ "/api/payments/infinitepay/webhook?token=" + appProperties.infinitepayWebhookToken();

		CheckoutResponse checkoutResponse = paymentGateway.createCheckout(
			new CreateCheckoutCommand(
				plan,
				pricing.getFinalAmountCents(),
				externalReference,
				redirectUrl,
				webhookUrl
			)
		);

		PaymentOrder orderWithCheckout = pendingOrder.toBuilder()
			.orderNsu(
				checkoutResponse != null && checkoutResponse.providerReference() != null
					? checkoutResponse.providerReference()
					: externalReference
			)
			.checkoutUrl(checkoutResponse != null ? checkoutResponse.checkoutUrl() : null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		PaymentOrder savedOrder = PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(orderWithCheckout))
		);
		LOGGER.info(
			"Checkout link created paymentOrderId={} providerReferencePresent={}",
			paymentOrderId,
			checkoutResponse != null && checkoutResponse.providerReference() != null
		);
		return savedOrder;
	}

	private String normalizeBaseUrl(String baseUrl) {
		if (baseUrl == null || baseUrl.isBlank()) {
			throw new IllegalStateException("Application base URL is not configured");
		}

		return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
	}
}
