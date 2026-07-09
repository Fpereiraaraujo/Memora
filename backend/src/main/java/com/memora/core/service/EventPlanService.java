package com.memora.core.service;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.Plan;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class EventPlanService {

	public Event applyPlanToEvent(Event event, Plan plan, LocalDateTime paidAt) {
		return event.toBuilder()
			.status(EventStatus.ACTIVE)
			.planCode(plan.getCode())
			.photoLimit(plan.getPhotoLimit())
			.storageExpiresAt(paidAt.plusMonths(plan.getStorageMonths()))
			.paidAt(paidAt)
			.updatedAt(paidAt)
			.build();
	}
}
