package com.memora.core.usecase.imp;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.param.ApprovePaymentOrderParam;
import com.memora.core.service.EventPlanService;
import com.memora.core.usecase.ApprovePaymentOrderUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class ApprovePaymentOrderUseCaseImp implements ApprovePaymentOrderUseCase {

	private final PaymentOrderRepository paymentOrderRepository;
	private final EventRepository eventRepository;
	private final PlanRepository planRepository;
	private final EventPlanService eventPlanService;

	public ApprovePaymentOrderUseCaseImp(
		PaymentOrderRepository paymentOrderRepository,
		EventRepository eventRepository,
		PlanRepository planRepository,
		EventPlanService eventPlanService
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.eventRepository = eventRepository;
		this.planRepository = planRepository;
		this.eventPlanService = eventPlanService;
	}

	@Override
	@Transactional
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public PaymentOrder execute(ApprovePaymentOrderParam param) {
		PaymentOrder paymentOrder = paymentOrderRepository.findWithLockById(param.paymentOrderId())
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Ordem de pagamento não encontrada."));

		if (paymentOrder.getStatus() == PaymentOrderStatus.APPROVED) {
			return paymentOrder;
		}

		if (paymentOrder.getStatus() != PaymentOrderStatus.PENDING) {
			throw new IllegalArgumentException("Somente pagamentos pendentes podem ser aprovados.");
		}

		var plan = planRepository.findByCodeAndActiveTrue(paymentOrder.getPlanCode())
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano da ordem está inválido ou inativo."));

		var event = eventRepository.findById(paymentOrder.getEventId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		var activatedEvent = eventPlanService.applyPlanToEvent(event, plan, now);

		var approvedOrder = paymentOrder.toBuilder()
			.status(PaymentOrderStatus.APPROVED)
			.paidAmountCents(paymentOrder.getFinalAmountCents())
			.paidAt(now)
			.updatedAt(now)
			.build();

		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));
		return PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(approvedOrder))
		);
	}
}
