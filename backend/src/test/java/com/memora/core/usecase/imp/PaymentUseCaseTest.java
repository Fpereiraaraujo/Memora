package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.CheckoutPricing;
import com.memora.core.domain.model.CheckoutResponse;
import com.memora.core.domain.model.Coupon;
import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.CouponValidationResult;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.core.domain.model.CreateCheckoutCommand;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.model.PaymentVerificationCommand;
import com.memora.core.domain.model.PaymentVerificationResult;
import com.memora.core.domain.model.ResolvedEventCheckout;
import com.memora.core.domain.param.ApprovePaymentOrderParam;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.domain.param.GetEventCheckoutStatusParam;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.service.CheckoutPricingService;
import com.memora.core.service.CouponValidationService;
import com.memora.core.service.EventCheckoutPricingResolverService;
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
	@Mock private CouponValidationService couponValidationService;
	@Mock private EventCheckoutPricingResolverService eventCheckoutPricingResolverService;

	private EventPlanService eventPlanService;
	private CheckoutPricingService checkoutPricingService;

	@BeforeEach
	void setUp() {
		eventPlanService = new EventPlanService();
		checkoutPricingService = new CheckoutPricingService();
	}

	@Test
	void createCheckoutCreatesPendingOrderWithoutCouponUsingBackendPlanPrice() {
		when(appProperties.publicBaseUrl()).thenReturn("https://memora-pied.vercel.app");
		when(appProperties.apiBaseUrl()).thenReturn("https://memora.api.br");
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");
		when(eventCheckoutPricingResolverService.resolve(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, null))
			.thenReturn(resolvedCheckout(9990, 0, 9990, null, null));
		when(paymentGateway.createCheckout(any(CreateCheckoutCommand.class)))
			.thenReturn(new CheckoutResponse("https://checkout.infinitepay.io/dynamic", "provider-order-1"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = checkoutUseCase();

		PaymentOrder paymentOrder = useCase.execute(new CreateEventCheckoutParam(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, null));

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.PENDING);
		assertThat(paymentOrder.getOriginalAmountCents()).isEqualTo(9990);
		assertThat(paymentOrder.getDiscountAmountCents()).isZero();
		assertThat(paymentOrder.getFinalAmountCents()).isEqualTo(9990);
		assertThat(paymentOrder.getAmountCents()).isEqualTo(9990);
		assertThat(paymentOrder.getCheckoutUrl()).isEqualTo("https://checkout.infinitepay.io/dynamic");
		assertThat(paymentOrder.getExternalReference()).startsWith("MEMORA-" + EVENT_ID);
		assertThat(paymentOrder.getOrderNsu()).isEqualTo("provider-order-1");
	}

	@Test
	void createCheckoutAppliesValidCouponAndStoresCommissionTracking() {
		when(eventCheckoutPricingResolverService.resolve(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, "noiva10"))
			.thenReturn(resolvedCheckout(9990, 999, 8991, "NOIVA10", 10));
		when(appProperties.publicBaseUrl()).thenReturn("https://memora-pied.vercel.app");
		when(appProperties.apiBaseUrl()).thenReturn("https://memora.api.br");
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");
		when(paymentGateway.createCheckout(any(CreateCheckoutCommand.class)))
			.thenReturn(new CheckoutResponse("https://checkout.infinitepay.io/dynamic", "provider-order-1"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = checkoutUseCase();

		PaymentOrder paymentOrder = useCase.execute(new CreateEventCheckoutParam(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, "noiva10"));

		assertThat(paymentOrder.getOriginalAmountCents()).isEqualTo(9990);
		assertThat(paymentOrder.getDiscountAmountCents()).isEqualTo(999);
		assertThat(paymentOrder.getFinalAmountCents()).isEqualTo(8991);
		assertThat(paymentOrder.getCouponCode()).isEqualTo("NOIVA10");
		assertThat(paymentOrder.getDiscountPercent()).isEqualTo(10);
		assertThat(paymentOrder.getCommissionPercent()).isEqualTo(20);
		assertThat(paymentOrder.getCommissionAmountCents()).isEqualTo(1798);
	}

	@Test
	void createCheckoutRejectsExpiredCoupon() {
		when(eventCheckoutPricingResolverService.resolve(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, "NOIVA10"))
			.thenThrow(new IllegalArgumentException("Cupom expirado."));

		var useCase = checkoutUseCase();

		org.assertj.core.api.Assertions.assertThatThrownBy(
			() -> useCase.execute(new CreateEventCheckoutParam(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, "NOIVA10"))
		)
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessage("Cupom expirado.");
	}

	@Test
	void createCheckoutCancelsPreviousPendingOrderWhenThePlanChanges() {
		PaymentOrderJpaEntity previousOrder = paymentOrderEntity(PaymentOrderStatus.PENDING, 9990, 0, 9990);
		when(eventCheckoutPricingResolverService.resolve(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, null))
			.thenReturn(resolvedCheckout(9990, 0, 9990, null, null));
		when(paymentOrderRepository.findAllByEventIdAndStatus(EVENT_ID, PaymentOrderStatus.PENDING))
			.thenReturn(java.util.List.of(previousOrder));
		when(appProperties.publicBaseUrl()).thenReturn("https://memora-pied.vercel.app");
		when(appProperties.apiBaseUrl()).thenReturn("https://memora.api.br");
		when(appProperties.infinitepayWebhookToken()).thenReturn("secret-token");
		when(paymentGateway.createCheckout(any(CreateCheckoutCommand.class)))
			.thenReturn(new CheckoutResponse("https://checkout.infinitepay.io/new", "provider-order-2"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = checkoutUseCase();

		useCase.execute(new CreateEventCheckoutParam(OWNER_ID, EVENT_ID, EventPlanCode.EVENT, null));

		ArgumentCaptor<PaymentOrderJpaEntity> orderCaptor = ArgumentCaptor.forClass(PaymentOrderJpaEntity.class);
		verify(paymentOrderRepository, org.mockito.Mockito.times(3)).save(orderCaptor.capture());
		assertThat(orderCaptor.getAllValues().get(0).getStatus()).isEqualTo(PaymentOrderStatus.CANCELLED);
		assertThat(orderCaptor.getAllValues().get(1).getStatus()).isEqualTo(PaymentOrderStatus.PENDING);
		assertThat(orderCaptor.getAllValues().get(2).getStatus()).isEqualTo(PaymentOrderStatus.PENDING);
	}

	@Test
	void getCheckoutStatusReturnsLatestPaymentOrder() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.findTopByEventIdOrderByCreatedAtDesc(EVENT_ID))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING, 9990, 999, 8991)));

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
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING, 9990, 999, 8991)));
		when(paymentGateway.verifyPayment(any(PaymentVerificationCommand.class)))
			.thenReturn(new PaymentVerificationResult(true, true, "MEMORA-ORDER-1", "provider-payment-1", 8991, 8991, "approved"));
		when(planRepository.findByCodeAndActiveTrue(EventPlanCode.EVENT)).thenReturn(Optional.of(planEntity(EventPlanCode.EVENT, 9990)));
		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam(8991, 8991));

		ArgumentCaptor<EventJpaEntity> eventCaptor = ArgumentCaptor.forClass(EventJpaEntity.class);
		verify(eventRepository).save(eventCaptor.capture());

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
		assertThat(paymentOrder.getPaidAmountCents()).isEqualTo(8991);
		assertThat(eventCaptor.getValue().getStatus()).isEqualTo(EventStatus.ACTIVE);
		assertThat(eventCaptor.getValue().getPhotoLimit()).isEqualTo(500);
		assertThat(eventCaptor.getValue().getPlanCode()).isEqualTo(EventPlanCode.EVENT);
	}

	@Test
	void handleWebhookIsIdempotentWhenOrderIsAlreadyApproved() {
		when(paymentOrderRepository.findWithLockByExternalReference("MEMORA-ORDER-1"))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.APPROVED, 9990, 999, 8991)));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam(8991, 8991));

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
		verify(paymentGateway, never()).verifyPayment(any());
		verify(eventRepository, never()).save(any());
	}

	@Test
	void handleWebhookRejectsPaymentWithDifferentPaidAmount() {
		when(paymentOrderRepository.findWithLockByExternalReference("MEMORA-ORDER-1"))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING, 9990, 999, 8991)));
		when(paymentGateway.verifyPayment(any(PaymentVerificationCommand.class)))
			.thenReturn(new PaymentVerificationResult(true, true, "MEMORA-ORDER-1", "provider-payment-1", 8991, 100, "approved"));
		when(paymentOrderRepository.save(any(PaymentOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var useCase = new HandleInfinitePayWebhookUseCaseImp(
			paymentOrderRepository,
			eventRepository,
			planRepository,
			paymentGateway,
			eventPlanService
		);

		PaymentOrder paymentOrder = useCase.execute(webhookParam(8991, 8991));

		assertThat(paymentOrder.getStatus()).isEqualTo(PaymentOrderStatus.FAILED);
		verify(eventRepository, never()).save(any());
		verify(planRepository, never()).findByCodeAndActiveTrue(any());
	}

	@Test
	void approvePaymentOrderAppliesPlanInsideTransactionFlow() {
		when(paymentOrderRepository.findWithLockById(PAYMENT_ORDER_ID))
			.thenReturn(Optional.of(paymentOrderEntity(PaymentOrderStatus.PENDING, 9990, 999, 8991)));
		when(planRepository.findByCodeAndActiveTrue(EventPlanCode.EVENT)).thenReturn(Optional.of(planEntity(EventPlanCode.EVENT, 9990)));
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
		assertThat(paymentOrder.getPaidAmountCents()).isEqualTo(8991);
		assertThat(eventCaptor.getValue().getStatus()).isEqualTo(EventStatus.ACTIVE);
		assertThat(eventCaptor.getValue().getPhotoLimit()).isEqualTo(500);
	}

	private CreateEventCheckoutUseCaseImp checkoutUseCase() {
		return new CreateEventCheckoutUseCaseImp(
			paymentOrderRepository,
			paymentGateway,
			appProperties,
			eventCheckoutPricingResolverService
		);
	}

	private ResolvedEventCheckout resolvedCheckout(
		int originalAmountCents,
		int discountAmountCents,
		int finalAmountCents,
		String couponCode,
		Integer discountPercent
	) {
		return ResolvedEventCheckout.builder()
			.event(com.memora.dataprovider.database.mapper.EventDatabaseMapper.toDomain(eventEntity(EventStatus.DRAFT)))
			.plan(com.memora.dataprovider.database.mapper.PlanDatabaseMapper.toDomain(planEntity(EventPlanCode.EVENT, originalAmountCents)))
			.pricing(CheckoutPricing.builder()
				.planCode(EventPlanCode.EVENT)
				.originalAmountCents(originalAmountCents)
				.discountAmountCents(discountAmountCents)
				.finalAmountCents(finalAmountCents)
				.couponCode(couponCode)
				.discountPercent(discountPercent)
				.commissionPercent(couponCode != null ? 20 : null)
				.commissionAmountCents(couponCode != null ? 1798 : null)
				.message(couponCode != null ? "Cupom aplicado com sucesso." : null)
				.build())
			.build();
	}

	private HandleInfinitePayWebhookParam webhookParam(int amountCents, int paidAmountCents) {
		return new HandleInfinitePayWebhookParam(
			"MEMORA-ORDER-1",
			"MEMORA-ORDER-1",
			"provider-payment-1",
			"transaction-1",
			"invoice-1",
			"APPROVED",
			amountCents,
			paidAmountCents,
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

	private PlanJpaEntity planEntity(EventPlanCode code, int priceCents) {
		return PlanJpaEntity.builder()
			.code(code)
			.name("Evento")
			.priceCents(priceCents)
			.photoLimit(500)
			.storageMonths(6)
			.active(true)
			.build();
	}

	private PaymentOrderJpaEntity paymentOrderEntity(PaymentOrderStatus status, int originalAmountCents, int discountAmountCents, int finalAmountCents) {
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
			.amountCents(finalAmountCents)
			.originalAmountCents(originalAmountCents)
			.discountAmountCents(discountAmountCents)
			.finalAmountCents(finalAmountCents)
			.discountPercent(discountAmountCents > 0 ? 10 : null)
			.couponCode(discountAmountCents > 0 ? "NOIVA10" : null)
			.commissionPercent(discountAmountCents > 0 ? 20 : null)
			.commissionAmountCents(discountAmountCents > 0 ? 1798 : null)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
