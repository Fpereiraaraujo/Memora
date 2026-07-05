package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;
import com.memora.core.usecase.HandleInfinitePayWebhookUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PaymentOrderDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.infinitepay.InfinitePayCheckoutClient;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class HandleInfinitePayWebhookUseCaseImp implements HandleInfinitePayWebhookUseCase {

	private final PaymentOrderRepository paymentOrderRepository;
	private final EventRepository eventRepository;
	private final InfinitePayCheckoutClient infinitePayCheckoutClient;

	public HandleInfinitePayWebhookUseCaseImp(
		PaymentOrderRepository paymentOrderRepository,
		EventRepository eventRepository,
		InfinitePayCheckoutClient infinitePayCheckoutClient
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.eventRepository = eventRepository;
		this.infinitePayCheckoutClient = infinitePayCheckoutClient;
	}

	@Override
	public PaymentOrder execute(HandleInfinitePayWebhookParam param) {
		PaymentOrder paymentOrder = paymentOrderRepository.findByOrderNsu(param.orderNsu())
			.map(PaymentOrderDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Payment order not found"));

		if (paymentOrder.getStatus() == PaymentOrderStatus.APPROVED) {
			return paymentOrder;
		}

		InfinitePayCheckoutClient.PaymentCheckResponse paymentCheckResponse = infinitePayCheckoutClient.paymentCheck(
			new InfinitePayCheckoutClient.PaymentCheckRequest(
				infinitePayCheckoutClient.handle(),
				param.orderNsu(),
				param.transactionNsu(),
				param.invoiceSlug()
			)
		);

		if (paymentCheckResponse == null || !paymentCheckResponse.success() || !paymentCheckResponse.paid()) {
			throw new IllegalArgumentException("InfinitePay payment is not approved");
		}

		Integer paidAmount = paymentCheckResponse.paidAmount() != null
			? paymentCheckResponse.paidAmount()
			: param.paidAmount();
		Integer amount = paymentCheckResponse.amount() != null
			? paymentCheckResponse.amount()
			: param.amount();

		if (amount != null && amount != paymentOrder.getAmountCents()) {
			throw new IllegalArgumentException("InfinitePay amount does not match payment order");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		PaymentOrder approvedOrder = paymentOrder.toBuilder()
			.status(PaymentOrderStatus.APPROVED)
			.providerTransactionNsu(
				paymentCheckResponse.transactionNsu() != null
					? paymentCheckResponse.transactionNsu()
					: param.transactionNsu()
			)
			.providerInvoiceSlug(
				paymentCheckResponse.slug() != null
					? paymentCheckResponse.slug()
					: param.invoiceSlug()
			)
			.receiptUrl(param.receiptUrl())
			.paidAmountCents(paidAmount)
			.paidAt(now)
			.updatedAt(now)
			.build();

		Event event = eventRepository.findById(paymentOrder.getEventId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		Event activatedEvent = event.toBuilder()
			.status(EventStatus.ACTIVE)
			.planCode(paymentOrder.getPlanCode())
			.photoLimit(paymentOrder.getPlanCode().getPhotoLimit())
			.storageExpiresAt(now.plusMonths(paymentOrder.getPlanCode().getStorageMonths()))
			.paidAt(now)
			.updatedAt(now)
			.build();

		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));
		return PaymentOrderDatabaseMapper.toDomain(
			paymentOrderRepository.save(PaymentOrderDatabaseMapper.toEntity(approvedOrder))
		);
	}
}
