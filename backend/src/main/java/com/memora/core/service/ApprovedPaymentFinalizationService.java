package com.memora.core.service;

import com.memora.core.domain.model.Coupon;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.model.ReferralCommission;
import com.memora.core.domain.model.ReferralCommissionStatus;
import com.memora.dataprovider.database.mapper.CouponDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.mapper.ReferralCommissionDatabaseMapper;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.ReferralCommissionRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ApprovedPaymentFinalizationService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApprovedPaymentFinalizationService.class);

	private final PaymentOrderRepository paymentOrderRepository;
	private final EventRepository eventRepository;
	private final EventPlanService eventPlanService;
	private final CouponRepository couponRepository;
	private final ReferralCommissionRepository referralCommissionRepository;

	public ApprovedPaymentFinalizationService(
		PaymentOrderRepository paymentOrderRepository,
		EventRepository eventRepository,
		EventPlanService eventPlanService,
		CouponRepository couponRepository,
		ReferralCommissionRepository referralCommissionRepository
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.eventRepository = eventRepository;
		this.eventPlanService = eventPlanService;
		this.couponRepository = couponRepository;
		this.referralCommissionRepository = referralCommissionRepository;
	}

	public PaymentOrder finalizeApprovedPayment(
		PaymentOrder paymentOrder,
		Plan plan,
		String providerPaymentId,
		String providerTransactionNsu,
		String providerInvoiceSlug,
		String receiptUrl,
		Integer paidAmountCents,
		LocalDateTime paidAt
	) {
		Event event = eventRepository.findById(paymentOrder.getEventId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento nao encontrado."));
		if (!event.getOwnerId().equals(paymentOrder.getUserId())) {
			throw new SecurityException("A ordem de pagamento nao pertence ao responsavel pelo evento.");
		}

		Coupon lockedCoupon = lockAndValidateCoupon(paymentOrder);
		if (lockedCoupon == null && hasCouponTracking(paymentOrder)) {
			return moveToManualReview(paymentOrder, "Cupom da ordem inconsistente ou indisponivel.");
		}

		if (lockedCoupon != null && lockedCoupon.getMaxUses() != null && lockedCoupon.getCurrentUses() >= lockedCoupon.getMaxUses()) {
			return moveToManualReview(paymentOrder, "Cupom atingiu o limite de usos durante a confirmacao do pagamento.");
		}

		LocalDateTime effectivePaidAt = paidAt != null ? paidAt : LocalDateTime.now(ZoneOffset.UTC);
		PaymentOrder approvedOrder = paymentOrder.toBuilder()
			.status(PaymentOrderStatus.APPROVED)
			.providerPaymentId(providerPaymentId)
			.providerTransactionNsu(providerTransactionNsu)
			.providerInvoiceSlug(providerInvoiceSlug)
			.receiptUrl(receiptUrl)
			.paidAmountCents(paidAmountCents)
			.paidAt(effectivePaidAt)
			.updatedAt(effectivePaidAt)
			.build();

		Event activatedEvent = eventPlanService.applyPlanToEvent(event, plan, effectivePaidAt);
		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));
		PaymentOrder savedOrder = PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(approvedOrder))
		);

		incrementCouponUsageIfNeeded(lockedCoupon, effectivePaidAt);
		createCommissionIfNeeded(savedOrder, effectivePaidAt);
		return savedOrder;
	}

	private Coupon lockAndValidateCoupon(PaymentOrder paymentOrder) {
		if (!hasCouponTracking(paymentOrder)) {
			return null;
		}

		return couponRepository.findWithLockById(paymentOrder.getCouponId())
			.map(CouponDatabaseMapper::toDomain)
			.filter(coupon -> paymentOrder.getCouponCode().equals(coupon.getCode()))
			.filter(coupon -> equalsNullable(paymentOrder.getInfluencerId(), coupon.getInfluencerId()))
			.filter(coupon -> equalsNullable(paymentOrder.getDiscountPercent(), coupon.getDiscountPercent()))
			.filter(coupon -> equalsNullable(paymentOrder.getCommissionPercent(), coupon.getCommissionPercent()))
			.orElse(null);
	}

	private void incrementCouponUsageIfNeeded(Coupon coupon, LocalDateTime now) {
		if (coupon == null) {
			return;
		}

		couponRepository.save(CouponDatabaseMapper.toEntity(coupon.toBuilder()
			.currentUses(coupon.getCurrentUses() + 1)
			.updatedAt(now)
			.build()));
	}

	private void createCommissionIfNeeded(PaymentOrder paymentOrder, LocalDateTime now) {
		if (paymentOrder.getCouponId() == null
			|| paymentOrder.getInfluencerId() == null
			|| paymentOrder.getCommissionPercent() == null
			|| paymentOrder.getCommissionAmountCents() == null) {
			return;
		}

		if (referralCommissionRepository.findByPaymentOrderId(paymentOrder.getId()).isPresent()) {
			LOGGER.info("Skipping duplicate referral commission paymentOrderId={}", paymentOrder.getId());
			return;
		}

		ReferralCommission commission = ReferralCommission.builder()
			.id(UUID.randomUUID())
			.influencerId(paymentOrder.getInfluencerId())
			.couponId(paymentOrder.getCouponId())
			.paymentOrderId(paymentOrder.getId())
			.eventId(paymentOrder.getEventId())
			.userId(paymentOrder.getUserId())
			.grossAmountCents(paymentOrder.getOriginalAmountCents())
			.discountAmountCents(paymentOrder.getDiscountAmountCents())
			.netAmountCents(paymentOrder.getFinalAmountCents())
			.commissionPercent(paymentOrder.getCommissionPercent())
			.commissionAmountCents(paymentOrder.getCommissionAmountCents())
			.status(ReferralCommissionStatus.APPROVED)
			.createdAt(now)
			.updatedAt(now)
			.build();

		referralCommissionRepository.save(ReferralCommissionDatabaseMapper.toEntity(commission));
	}

	private PaymentOrder moveToManualReview(PaymentOrder paymentOrder, String reason) {
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		LOGGER.warn("Payment moved to manual review paymentOrderId={} reason={}", paymentOrder.getId(), reason);
		return PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(paymentOrder.toBuilder()
				.status(PaymentOrderStatus.MANUAL_REVIEW)
				.updatedAt(now)
				.build()))
		);
	}

	private boolean hasCouponTracking(PaymentOrder paymentOrder) {
		return paymentOrder.getCouponId() != null
			|| paymentOrder.getCouponCode() != null
			|| paymentOrder.getInfluencerId() != null
			|| paymentOrder.getDiscountPercent() != null
			|| paymentOrder.getCommissionPercent() != null;
	}

	private boolean equalsNullable(Object left, Object right) {
		if (left == null) {
			return right == null;
		}

		return left.equals(right);
	}
}
