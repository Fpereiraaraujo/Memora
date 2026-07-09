package com.memora.core.usecase.imp;

import com.memora.core.domain.model.PaymentVerificationResult;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.core.gateway.PaymentGateway;
import com.memora.core.service.EventPlanService;
import com.memora.core.usecase.HandleInfinitePayWebhookUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HandleInfinitePayWebhookUseCaseImp implements HandleInfinitePayWebhookUseCase {

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
	public PaymentOrder execute(HandleInfinitePayWebhookParam param) {
		String externalReference = resolveExternalReference(param);
		if (externalReference == null || externalReference.isBlank()) {
			throw new IllegalArgumentException("Webhook recebido sem referência de pagamento válida.");
		}

		PaymentOrder paymentOrder = paymentOrderRepository.findWithLockByExternalReference(externalReference)
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Ordem de pagamento não encontrada."));

		if (paymentOrder.getStatus() == PaymentOrderStatus.APPROVED) {
			return paymentOrder;
		}

		PaymentVerificationResult verificationResult = paymentGateway.verifyPayment(
			externalReference,
			param.providerPaymentId() != null ? param.providerPaymentId() : param.transactionNsu(),
			param.amount()
		);

		if (!verificationResult.verified() || !verificationResult.approved()) {
			return paymentOrder;
		}

		int expectedAmount = paymentOrder.getAmountCents();
		int informedAmount = verificationResult.amountCents() != null ? verificationResult.amountCents() : expectedAmount;
		if (informedAmount != expectedAmount) {
			PaymentOrder failedOrder = paymentOrder.toBuilder()
				.status(PaymentOrderStatus.FAILED)
				.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
				.build();

			return PaymentOrderDatabaseMapper.toDomain(
				paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(failedOrder))
			);
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		Plan plan = planRepository.findByCodeAndActiveTrue(paymentOrder.getPlanCode())
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano da ordem está inválido ou inativo."));

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
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		Event activatedEvent = eventPlanService.applyPlanToEvent(event, plan, now);

		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));
		return PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(approvedOrder))
		);
	}

	private String resolveExternalReference(HandleInfinitePayWebhookParam param) {
		if (param.externalReference() != null && !param.externalReference().isBlank()) {
			return param.externalReference();
		}

		return param.orderNsu();
	}
}
