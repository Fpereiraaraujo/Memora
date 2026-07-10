package com.memora.core.usecase.imp;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CreateEventCheckoutUseCaseImp implements CreateEventCheckoutUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(CreateEventCheckoutUseCaseImp.class);

	private final EventRepository eventRepository;
	private final PlanRepository planRepository;
	private final PaymentOrderRepository paymentOrderRepository;
	private final PaymentGateway paymentGateway;
	private final AppProperties appProperties;

	public CreateEventCheckoutUseCaseImp(
		EventRepository eventRepository,
		PlanRepository planRepository,
		PaymentOrderRepository paymentOrderRepository,
		PaymentGateway paymentGateway,
		AppProperties appProperties
	) {
		this.eventRepository = eventRepository;
		this.planRepository = planRepository;
		this.paymentOrderRepository = paymentOrderRepository;
		this.paymentGateway = paymentGateway;
		this.appProperties = appProperties;
	}

	@Override
	public PaymentOrder execute(CreateEventCheckoutParam param) {
		if (param.planCode() == null) {
			throw new IllegalArgumentException("Plan code is required");
		}

		Event event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		if (event.getPaidAt() != null && event.getPlanCode() != null) {
			throw new IllegalArgumentException("Este evento já possui um plano aprovado.");
		}

		Plan plan = planRepository.findByCodeAndActiveTrue(param.planCode())
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano inválido."));

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
			.amountCents(plan.getPriceCents())
			.createdAt(now)
			.updatedAt(now)
			.build();

		paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(pendingOrder));
		LOGGER.info("Checkout order created paymentOrderId={} eventId={} planCode={}",
			paymentOrderId, event.getId(), plan.getCode());

		String redirectUrl = normalizeBaseUrl(appProperties.publicBaseUrl()) + "/app/events/" + event.getId() + "/checkout";
		String webhookUrl = normalizeBaseUrl(appProperties.apiBaseUrl())
			+ "/api/payments/infinitepay/webhook?token=" + appProperties.infinitepayWebhookToken();

		CheckoutResponse checkoutResponse = paymentGateway.createCheckout(
			new CreateCheckoutCommand(
				plan,
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
		LOGGER.info("Checkout link created paymentOrderId={} providerReferencePresent={}",
			paymentOrderId, checkoutResponse != null && checkoutResponse.providerReference() != null);
		return savedOrder;
	}

	private String normalizeBaseUrl(String baseUrl) {
		if (baseUrl == null || baseUrl.isBlank()) {
			throw new IllegalStateException("Application base URL is not configured");
		}

		return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
	}
}
