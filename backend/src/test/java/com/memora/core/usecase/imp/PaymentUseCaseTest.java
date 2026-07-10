package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.model.PaymentVerificationCommand;
import com.memora.core.domain.model.PaymentVerificationResult;
import com.memora.core.domain.param.ApprovePaymentOrderParam;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.domain.param.GetEventCheckoutStatusParam;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.service.EventPlanService;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.PaymentOrderJpaEntity;
import com.memora.dataprovider.database.entity.PlanJpaEntity;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentUseCaseTest {

	private static final UUID EVENT_ID = UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1");
	private static final UUID OWNER_ID = UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879");
	private static final UUID PAYMENT_ORDER_ID = UUID.fromString("87553897-2b22-4ed4-a6b9-e3d182669c70");

	@Mock private EventRepository eventRepository;
	@Mock private PlanRepository planRepository;
	@Mock private PaymentOrderRepository paymentOrderRepository;
	@Mock private PaymentGateway paymentGateway;
	@Mock private AppProperties appProperties;

	private EventPlanService eventPlanService;

	@BeforeEach
	void setUp() {
		eventPlanService = new EventPlanService();
	}

	@Test
	void createCheckoutCreatesPendingOrderWithBackendPlanPrice() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(planRepository.findByCodeAndActiveTrue(EventPlanCode.EVENT)).thenReturn(Optional.of(planEntity(EventPlanCode.EVENT)));
		when(appProperties.publicBaseUrl()).thenReturn("https://memora-pied.vercel.app");
		when(appProperties.apiBaseUrl()).thenReturn("https://memora.api.br");
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");
		when(paymentGateway.createCheckout(any(CreateCheckoutCommand.class)))
			.thenReturn(new CheckoutResponse("https://checkout.infinitepay.io/dynamic", "provider-order-1"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new CreateEventCheckoutUseCaseImp(
			eventRepository,
			planRepository,
			paymentOrderRepository,
			paymentGateway,
			appProperties
		);

		PaymentOrder paymentOrder = useCase.execute(new CreateEventCheckoutParam(OWNER_ID, EVENT_ID, EventPlanCode.EVENT));

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.PENDING);
		assertThat(paymentOrder.getAmountCents()).isEqualTo(6990);
		assertThat(paymentOrder.getCheckoutUrl()).isEqualTo("https://checkout.infinitepay.io/dynamic");
		assertThat(paymentOrder.getExternalReference()).startsWith("MEMORA-" + EVENT_ID);
		assertThat(paymentOrder.getOrderNsu()).isEqualTo("provider-order-1");
	}

	@Test
	void getCheckoutStatusReturnsLatestPaymentOrder() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.findTopByEventIdOrderByCreatedAtDesc(EVENT_ID)).thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING)));

		var useCase = new GetEventCheckoutStatusUseCaseImp(eventRepository, paymentOrderRepository);

		var status = useCase.execute(new GetEventCheckoutStatusParam(OWNER_ID, EVENT_ID));

		assertThat(status.getPaymentOrderId()).isEqualTo(PAYMENT_ORDER_ID);
		assertThat(status.getStatus()).isEqualTo(PaymentOrderStatus.PENDING);
		assertThat(status.getPlanCode()).isEqualTo(EventPlanCode.EVENT);
		assertThat(status.getEventStatus()).isEqualTo(EventStatus.DRAFT);
	}

	@Test
	void handleWebhookApprovesOrderAndActivatesEventWhenPaymentIsVerified() {
		when(paymentOrderRepository.findWithLockByExternalReference("MEMORA-ORDER-1"))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING)));
		when(paymentGateway.verifyPayment(any(PaymentVerificationCommand.class)))
			.thenReturn(new PaymentVerificationResult(true, true, "MEMORA-ORDER-1", "provider-payment-1", 6990, 6990, "approved"));
		when(planRepository.findByCodeAndActiveTrue(EventPlanCode.EVENT)).thenReturn(Optional.of(planEntity(EventPlanCode.EVENT)));
		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam());

		ArgumentCaptor<EventJpaEntity> eventCaptor = ArgumentCaptor.forClass(EventJpaEntity.class);
		verify(eventRepository).save(eventCaptor.capture());

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
		assertThat(paymentOrder.getPaidAmountCents()).isEqualTo(6990);
		assertThat(eventCaptor.getValue().getStatus()).isEqualTo(EventStatus.ACTIVE);
		assertThat(eventCaptor.getValue().getPhotoLimit()).isEqualTo(500);
		assertThat(eventCaptor.getValue().getPlanCode()).isEqualTo(EventPlanCode.EVENT);
	}

	@Test
	void handleWebhookIsIdempotentWhenOrderIsAlreadyApproved() {
		when(paymentOrderRepository.findWithLockByExternalReference("MEMORA-ORDER-1"))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.APPROVED)));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam());

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
		verify(paymentGateway, never()).verifyPayment(any());
		verify(eventRepository, never()).save(any());
	}

	@Test
	void handleWebhookRejectsPaymentWithDifferentPaidAmount() {
		when(paymentOrderRepository.findWithLockByExternalReference("MEMORA-ORDER-1"))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING)));
		when(paymentGateway.verifyPayment(any(PaymentVerificationCommand.class)))
			.thenReturn(new PaymentVerificationResult(true, true, "MEMORA-ORDER-1", "provider-payment-1", 6990, 100, "approved"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam());

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.FAILED);
		verify(eventRepository, never()).save(any());
		verify(planRepository, never()).findByCodeAndActiveTrue(any());
	}

	@Test
	void approvePaymentOrderAppliesPlanInsideTransactionFlow() {
		when(paymentOrderRepository.findWithLockById(PAYMENT_ORDER_ID))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING)));
		when(planRepository.findByCodeAndActiveTrue(EventPlanCode.EVENT)).thenReturn(Optional.of(planEntity(EventPlanCode.EVENT)));
		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new ApprovePaymentOrderUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(new ApprovePaymentOrderParam(PAYMENT_ORDER_ID));

		ArgumentCaptor<EventJpaEntity> eventCaptor = ArgumentCaptor.forClass(EventJpaEntity.class);
		verify(eventRepository).save(eventCaptor.capture());

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
		assertThat(eventCaptor.getValue().getStatus()).isEqualTo(EventStatus.ACTIVE);
		assertThat(eventCaptor.getValue().getPhotoLimit()).isEqualTo(500);
	}

	private HandleInfinitePayWebhookParam webhookParam() {
		return new HandleInfinitePayWebhookParam(
			"MEMORA-ORDER-1",
			"MEMORA-ORDER-1",
			"provider-payment-1",
			"transaction-1",
			"invoice-1",
			"APPROVED",
			6990,
			6990,
			"https://receipt.memora.test"
		);
	}

	private EventJpaEntity eventEntity(EventStatus status) {
		LocalDateTime now = LocalDateTime.now();
		return EventJpaEntity.builder()
			.id(EVENT_ID)
			.ownerId(OWNER_ID)
			.type(EventType.WEDDING)
			.title("Isadora & Fernando")
			.slug("isadora-fernando")
			.eventDate(LocalDate.of(2026, 10, 8))
			.location("Campo Largo")
			.status(status)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}

	private PlanJpaEntity planEntity(EventPlanCode code) {
		return PlanJpaEntity.builder()
			.code(code)
			.name("Evento")
			.priceCents(6990)
			.photoLimit(500)
			.storageMonths(6)
			.active(true)
			.build();
	}

	private PaymentOrderJpaEntity paymentOrderEntity(PaymentOrderStatus status) {
		LocalDateTime now = LocalDateTime.now();
		return PaymentOrderJpaEntity.builder()
			.id(PAYMENT_ORDER_ID)
			.eventId(EVENT_ID)
			.userId(OWNER_ID)
			.planCode(EventPlanCode.EVENT)
			.provider(PaymentProvider.INFINITEPAY)
			.status(status)
			.externalReference("MEMORA-ORDER-1")
			.orderNsu("MEMORA-ORDER-1")
			.checkoutUrl("https://checkout.infinitepay.io/dynamic")
			.amountCents(6990)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
