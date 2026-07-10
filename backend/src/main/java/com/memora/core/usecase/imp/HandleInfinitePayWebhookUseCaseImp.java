package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentVerificationCommand;
import com.memora.core.domain.model.PaymentVerificationResult;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.service.EventPlanService;
import com.memora.core.usecase.HandleInfinitePayWebhookUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class HandleInfinitePayWebhookUseCaseImp implements HandleInfinitePayWebhookUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(HandleInfinitePayWebhookUseCaseImp.class);

	private final PaymentOrderRepository paymentOrderRepository;
	private final EventRepository eventRepository;
	private final PlanRepository planRepository;
	private final PaymentGateway paymentGateway;
	private final EventPlanService eventPlanService;

	public HandleInfinitePayWebhookUseCaseImp(
		PaymentOrderRepository paymentOrderRepository,
		EventRepository eventRepository,
		PlanRepository planRepository,
		PaymentGateway paymentGateway,
		EventPlanService eventPlanService
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.eventRepository = eventRepository;
		this.planRepository = planRepository;
		this.paymentGateway = paymentGateway;
		this.eventPlanService = eventPlanService;
	}

	@Override
	@Transactional
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public PaymentOrder execute(HandleInfinitePayWebhookParam param) {
		String externalReference = resolveExternalReference(param);
		if (externalReference == null || externalReference.isBlank()) {
			throw new IllegalArgumentException("Webhook recebido sem referencia de pagamento valida.");
		}

		PaymentOrder paymentOrder = paymentOrderRepository.findWithLockByExternalReference(externalReference)
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Ordem de pagamento nao encontrada."));

		if (paymentOrder.getStatus() == PaymentOrderStatus.APPROVED) {
			LOGGER.info("Ignoring duplicate approved payment webhook paymentOrderId={}", paymentOrder.getId());
			return paymentOrder;
		}

		PaymentVerificationResult verificationResult = paymentGateway.verifyPayment(new PaymentVerificationCommand(
			externalReference,
			param.providerPaymentId(),
			param.transactionNsu(),
			param.invoiceSlug(),
			param.amount()
		));

		if (!verificationResult.verified() || !verificationResult.approved()) {
			LOGGER.warn("Payment verification not approved paymentOrderId={} verified={} approved={}",
				paymentOrder.getId(), verificationResult.verified(), verificationResult.approved());
			return paymentOrder;
		}
		if (verificationResult.externalReference() != null
			&& !externalReference.equals(verificationResult.externalReference())) {
			throw new SecurityException("A referência confirmada pelo provedor não corresponde à ordem.");
		}

		int expectedAmount = paymentOrder.getAmountCents();
		int informedAmount = verificationResult.amountCents() != null ? verificationResult.amountCents() : expectedAmount;
		Integer paidAmount = verificationResult.paidAmountCents() != null
			? verificationResult.paidAmountCents()
			: param.paidAmount();
		if (informedAmount != expectedAmount || (paidAmount != null && paidAmount != expectedAmount)) {
			PaymentOrder failedOrder = paymentOrder.toBuilder()
				.status(PaymentOrderStatus.FAILED)
				.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
				.build();

			LOGGER.warn("Payment amount mismatch paymentOrderId={} expectedAmount={} informedAmount={} paidAmount={}",
				paymentOrder.getId(), expectedAmount, informedAmount, paidAmount);
			return PaymentOrderDatabaseMapper.toDomain(
				paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(failedOrder))
			);
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		Plan plan = planRepository.findByCodeAndActiveTrue(paymentOrder.getPlanCode())
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano da ordem esta invalido ou inativo."));

		PaymentOrder approvedOrder = paymentOrder.toBuilder()
			.status(PaymentOrderStatus.APPROVED)
			.providerPaymentId(verificationResult.providerPaymentId())
			.providerTransactionNsu(param.transactionNsu())
			.providerInvoiceSlug(param.invoiceSlug())
			.receiptUrl(param.receiptUrl())
			.paidAmountCents(
				verificationResult.paidAmountCents() != null ? verificationResult.paidAmountCents() : param.paidAmount()
			)
			.paidAt(now)
			.updatedAt(now)
			.build();

		Event event = eventRepository.findById(paymentOrder.getEventId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento nao encontrado."));
		if (!event.getOwnerId().equals(paymentOrder.getUserId())) {
			throw new SecurityException("A ordem de pagamento não pertence ao responsável pelo evento.");
		}

		Event activatedEvent = eventPlanService.applyPlanToEvent(event, plan, now);

		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));
		PaymentOrder savedOrder = PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(approvedOrder))
		);
		LOGGER.info("Payment approved paymentOrderId={} eventId={} planCode={}",
			paymentOrder.getId(), event.getId(), plan.getCode());
		return savedOrder;
	}

	private String resolveExternalReference(HandleInfinitePayWebhookParam param) {
		if (param.externalReference() != null && !param.externalReference().isBlank()) {
			return param.externalReference();
		}

		return param.orderNsu();
	}
}
