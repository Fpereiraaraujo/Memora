package com.memora.core.usecase.imp;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.infinitepay.InfinitePayCheckoutClient;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CreateEventCheckoutUseCaseImp implements CreateEventCheckoutUseCase {

	private final EventRepository eventRepository;
	private final PaymentOrderRepository paymentOrderRepository;
	private final InfinitePayCheckoutClient infinitePayCheckoutClient;
	private final AppProperties appProperties;

	public CreateEventCheckoutUseCaseImp(
		EventRepository eventRepository,
		PaymentOrderRepository paymentOrderRepository,
		InfinitePayCheckoutClient infinitePayCheckoutClient,
		AppProperties appProperties
	) {
		this.eventRepository = eventRepository;
		this.paymentOrderRepository = paymentOrderRepository;
		this.infinitePayCheckoutClient = infinitePayCheckoutClient;
		this.appProperties = appProperties;
	}

	@Override
	public PaymentOrder execute(CreateEventCheckoutParam param) {
		if (param.planCode() == null) {
			throw new IllegalArgumentException("Plan code is required");
		}

		Event event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (event.getPaidAt() != null && event.getPlanCode() != null) {
			throw new IllegalArgumentException("Event already has an approved plan");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		String orderNsu = "memora-" + event.getId() + "-" + UUID.randomUUID();

		PaymentOrder pendingOrder = PaymentOrder.builder()
			.id(UUID.randomUUID())
			.eventId(event.getId())
			.userId(event.getOwnerId())
			.planCode(param.planCode())
			.provider(PaymentProvider.INFINITEPAY)
			.status(PaymentOrderStatus.PENDING)
			.orderNsu(orderNsu)
			.amountCents(param.planCode().getAmountCents())
			.createdAt(now)
			.updatedAt(now)
			.build();

		String redirectUrl = normalizeBaseUrl(appProperties.publicBaseUrl()) + "/app/events/" + event.getId();
		String webhookUrl = normalizeBaseUrl(appProperties.apiBaseUrl())
			+ "/api/payments/infinitepay/webhook?token=" + appProperties.infinitepayWebhookToken();

		InfinitePayCheckoutClient.CreateCheckoutLinkResponse response = infinitePayCheckoutClient.createCheckoutLink(
			new InfinitePayCheckoutClient.CreateCheckoutLinkRequest(
				infinitePayCheckoutClient.handle(),
				List.of(new InfinitePayCheckoutClient.CheckoutItem(
					param.planCode().getDisplayName(),
					1,
					param.planCode().getAmountCents()
				)),
				orderNsu,
				redirectUrl,
				webhookUrl
			)
		);

		PaymentOrder orderWithCheckout = pendingOrder.toBuilder()
			.checkoutUrl(response != null ? response.checkoutUrl() : null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		return PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(orderWithCheckout))
		);
	}

	private String normalizeBaseUrl(String baseUrl) {
		if (baseUrl == null || baseUrl.isBlank()) {
			throw new IllegalStateException("Application base URL is not configured");
		}

		return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
	}
}
