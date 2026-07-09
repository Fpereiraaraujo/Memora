package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventCheckoutStatus;
import com.memora.core.domain.param.GetEventCheckoutStatusParam;
import com.memora.core.usecase.GetEventCheckoutStatusUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventCheckoutStatusUseCaseImp implements GetEventCheckoutStatusUseCase {

	private final EventRepository eventRepository;
	private final PaymentOrderRepository paymentOrderRepository;

	public GetEventCheckoutStatusUseCaseImp(
		EventRepository eventRepository,
		PaymentOrderRepository paymentOrderRepository
	) {
		this.eventRepository = eventRepository;
		this.paymentOrderRepository = paymentOrderRepository;
	}

	@Override
	public EventCheckoutStatus execute(GetEventCheckoutStatusParam param) {
		Event event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		var latestOrder = paymentOrderRepository.findTopByEventIdOrderByCreatedAtDesc(event.getId())
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElse(null);

		return EventCheckoutStatus.builder()
			.paymentOrderId(latestOrder != null ? latestOrder.getId() : null)
			.status(latestOrder != null ? latestOrder.getStatus() : null)
			.planCode(latestOrder != null ? latestOrder.getPlanCode() : event.getPlanCode())
			.eventStatus(event.getStatus())
			.paidAt(event.getPaidAt())
			.checkoutUrl(latestOrder != null ? latestOrder.getCheckoutUrl() : null)
			.build();
	}
}
