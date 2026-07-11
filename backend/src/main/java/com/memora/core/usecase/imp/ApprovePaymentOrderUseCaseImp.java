package com.memora.core.usecase.imp;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.param.ApprovePaymentOrderParam;
import com.memora.core.service.ApprovedPaymentFinalizationService;
import com.memora.core.usecase.ApprovePaymentOrderUseCase;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovePaymentOrderUseCaseImp implements ApprovePaymentOrderUseCase {

	private final PaymentOrderRepository paymentOrderRepository;
	private final PlanRepository planRepository;
	private final ApprovedPaymentFinalizationService approvedPaymentFinalizationService;

	public ApprovePaymentOrderUseCaseImp(
		PaymentOrderRepository paymentOrderRepository,
		PlanRepository planRepository,
		ApprovedPaymentFinalizationService approvedPaymentFinalizationService
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.planRepository = planRepository;
		this.approvedPaymentFinalizationService = approvedPaymentFinalizationService;
	}

	@Override
	@Transactional
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public PaymentOrder execute(ApprovePaymentOrderParam param) {
		PaymentOrder paymentOrder = paymentOrderRepository.findWithLockById(param.paymentOrderId())
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Ordem de pagamento nao encontrada."));

		if (paymentOrder.getStatus() == PaymentOrderStatus.APPROVED) {
			return paymentOrder;
		}

		if (paymentOrder.getStatus() != PaymentOrderStatus.PENDING) {
			throw new IllegalArgumentException("Somente pagamentos pendentes podem ser aprovados.");
		}

		var plan = planRepository.findByCodeAndActiveTrue(paymentOrder.getPlanCode())
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano da ordem esta invalido ou inativo."));

		return approvedPaymentFinalizationService.finalizeApprovedPayment(
			paymentOrder,
			plan,
			paymentOrder.getProviderPaymentId(),
			paymentOrder.getProviderTransactionNsu(),
			paymentOrder.getProviderInvoiceSlug(),
			paymentOrder.getReceiptUrl(),
			paymentOrder.getFinalAmountCents(),
			LocalDateTime.now(ZoneOffset.UTC)
		);
	}
}
