package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.model.ReferralCommissionStatus;
import com.memora.dataprovider.database.entity.CouponJpaEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.PaymentOrderJpaEntity;
import com.memora.dataprovider.database.entity.ReferralCommissionJpaEntity;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.ReferralCommissionRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ApprovedPaymentFinalizationServiceTest {

	private static final UUID EVENT_ID = UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1");
	private static final UUID OWNER_ID = UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879");
	private static final UUID COUPON_ID = UUID.fromString("f7df5956-6a12-4516-9ca6-b6eeaf0f2420");
	private static final UUID INFLUENCER_ID = UUID.fromString("f1ed1c55-cd52-40c9-96f9-5440f609aaec");
	private static final UUID PAYMENT_ORDER_ID = UUID.fromString("87553897-2b22-4ed4-a6b9-e3d182669c70");

	@Mock private PaymentOrderRepository paymentOrderRepository;
	@Mock private EventRepository eventRepository;
	@Mock private CouponRepository couponRepository;
	@Mock private ReferralCommissionRepository referralCommissionRepository;

	@Test
	void finalizeApprovedPaymentCreatesCommissionAndIncrementsCouponUsage() {
		var service = service();
		var paymentOrder = paymentOrder();
		var plan = plan();
		var coupon = coupon(0, 5);
		var event = eventEntity(EventStatus.DRAFT);
		LocalDateTime now = LocalDateTime.now();

		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(event));
		when(paymentOrderRepository.save(org.mockito.ArgumentMatchers.any(PaymentOrderJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));
		when(couponRepository.findWithLockById(COUPON_ID)).thenReturn(Optional.of(coupon));
		when(couponRepository.save(org.mockito.ArgumentMatchers.any(CouponJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));
		when(referralCommissionRepository.findByPaymentOrderId(PAYMENT_ORDER_ID)).thenReturn(Optional.empty());
		when(referralCommissionRepository.save(org.mockito.ArgumentMatchers.any(ReferralCommissionJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));

		var result = service.finalizeApprovedPayment(
			paymentOrder,
			plan,
			"provider-payment-1",
			"transaction-1",
			"invoice-1",
			"https://receipt.memora.test",
			8991,
			now
		);

		ArgumentCaptor<CouponJpaEntity> couponCaptor = ArgumentCaptor.forClass(CouponJpaEntity.class);
		verify(couponRepository).save(couponCaptor.capture());
		assertThat(couponCaptor.getValue().getCurrentUses()).isEqualTo(1);

		ArgumentCaptor<ReferralCommissionJpaEntity> commissionCaptor = ArgumentCaptor.forClass(ReferralCommissionJpaEntity.class);
		verify(referralCommissionRepository).save(commissionCaptor.capture());
		assertThat(commissionCaptor.getValue().getStatus()).isEqualTo(ReferralCommissionStatus.APPROVED);
		assertThat(commissionCaptor.getValue().getNetAmountCents()).isEqualTo(8991);
		assertThat(result.getStatus()).isEqualTo(PaymentOrderStatus.APPROVED);
	}

	@Test
	void finalizeApprovedPaymentDoesNotDuplicateCommissionWhenItAlreadyExists() {
		var service = service();
		var paymentOrder = paymentOrder();
		var plan = plan();
		var coupon = coupon(1, 5);
		LocalDateTime now = LocalDateTime.now();

		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(paymentOrderRepository.save(org.mockito.ArgumentMatchers.any(PaymentOrderJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));
		when(couponRepository.findWithLockById(COUPON_ID)).thenReturn(Optional.of(coupon));
		when(couponRepository.save(org.mockito.ArgumentMatchers.any(CouponJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));
		when(referralCommissionRepository.findByPaymentOrderId(PAYMENT_ORDER_ID))
			.thenReturn(Optional.of(ReferralCommissionJpaEntity.builder().id(UUID.randomUUID()).paymentOrderId(PAYMENT_ORDER_ID).build()));

		service.finalizeApprovedPayment(
			paymentOrder,
			plan,
			"provider-payment-1",
			"transaction-1",
			"invoice-1",
			"https://receipt.memora.test",
			8991,
			now
		);

		verify(referralCommissionRepository, never()).save(org.mockito.ArgumentMatchers.any(ReferralCommissionJpaEntity.class));
	}

	@Test
	void finalizeApprovedPaymentMovesToManualReviewWhenCouponUsageWasExhausted() {
		var service = service();
		var paymentOrder = paymentOrder();
		var plan = plan();
		LocalDateTime now = LocalDateTime.now();

		when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT)));
		when(couponRepository.findWithLockById(COUPON_ID)).thenReturn(Optional.of(coupon(5, 5)));
		when(paymentOrderRepository.save(org.mockito.ArgumentMatchers.any(PaymentOrderJpaEntity.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));

		var result = service.finalizeApprovedPayment(
			paymentOrder,
			plan,
			"provider-payment-1",
			"transaction-1",
			"invoice-1",
			"https://receipt.memora.test",
			8991,
			now
		);

		assertThat(result.getStatus()).isEqualTo(PaymentOrderStatus.MANUAL_REVIEW);
		verify(eventRepository, never()).save(org.mockito.ArgumentMatchers.any(EventJpaEntity.class));
		verify(referralCommissionRepository, never()).save(org.mockito.ArgumentMatchers.any(ReferralCommissionJpaEntity.class));
	}

	private ApprovedPaymentFinalizationService service() {
		return new ApprovedPaymentFinalizationService(
			paymentOrderRepository,
			eventRepository,
			new EventPlanService(),
			couponRepository,
			referralCommissionRepository
		);
	}

	private PaymentOrder paymentOrder() {
		LocalDateTime now = LocalDateTime.now();
		return PaymentOrder.builder()
			.id(PAYMENT_ORDER_ID)
			.eventId(EVENT_ID)
			.userId(OWNER_ID)
			.planCode(EventPlanCode.EVENT)
			.provider(PaymentProvider.INFINITEPAY)
			.status(PaymentOrderStatus.PENDING)
			.externalReference("MEMORA-ORDER-1")
			.orderNsu("MEMORA-ORDER-1")
			.amountCents(8991)
			.originalAmountCents(9990)
			.discountAmountCents(999)
			.finalAmountCents(8991)
			.discountPercent(10)
			.couponId(COUPON_ID)
			.couponCode("NOIVA10")
			.influencerId(INFLUENCER_ID)
			.commissionPercent(20)
			.commissionAmountCents(1798)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}

	private Plan plan() {
		return Plan.builder()
			.code(EventPlanCode.EVENT)
			.name("Evento")
			.priceCents(9990)
			.photoLimit(500)
			.storageMonths(6)
			.active(true)
			.build();
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

	private CouponJpaEntity coupon(int currentUses, Integer maxUses) {
		LocalDateTime now = LocalDateTime.now();
		return CouponJpaEntity.builder()
			.id(COUPON_ID)
			.code("NOIVA10")
			.influencerId(INFLUENCER_ID)
			.discountPercent(10)
			.commissionPercent(20)
			.status(CouponStatus.ACTIVE)
			.maxUses(maxUses)
			.currentUses(currentUses)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
