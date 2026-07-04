package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.User;
import com.memora.core.domain.param.CreateEventParam;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.domain.param.GetEventParam;
import com.memora.core.domain.param.ListEventsParam;
import com.memora.core.domain.param.UpdateEventParam;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.entrypoint.api.controller.definition.EventControllerApi;
import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController implements EventControllerApi {

	private final GetCurrentUserUseCase getCurrentUserUseCase;
	private final CreateEventUseCase createEventUseCase;
	private final ListEventsUseCase listEventsUseCase;
	private final GetEventUseCase getEventUseCase;
	private final UpdateEventUseCase updateEventUseCase;

	public EventController(
		GetCurrentUserUseCase getCurrentUserUseCase,
		CreateEventUseCase createEventUseCase,
		ListEventsUseCase listEventsUseCase,
		GetEventUseCase getEventUseCase,
		UpdateEventUseCase updateEventUseCase
	) {
		this.getCurrentUserUseCase = getCurrentUserUseCase;
		this.createEventUseCase = createEventUseCase;
		this.listEventsUseCase = listEventsUseCase;
		this.getEventUseCase = getEventUseCase;
		this.updateEventUseCase = updateEventUseCase;
	}

	@Override
	public ResponseEntity<EventCreateResponseDto> create(EventCreateRequestDto request, Authentication authentication) {
		User user = resolveUser(authentication);
		Event event = createEventUseCase.execute(new CreateEventParam(
			user.getId(),
			request.type(),
			request.title(),
			request.eventDate(),
			request.location()
		));

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(EventApiMapper.toCreateResponse(event));
	}

	@Override
	public ResponseEntity<List<EventResponseDto>> list(Authentication authentication) {
		User user = resolveUser(authentication);
		List<EventResponseDto> events = listEventsUseCase.execute(new ListEventsParam(user.getId()))
			.stream()
			.map(EventApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(events);
	}

	@Override
	public ResponseEntity<EventResponseDto> get(UUID eventId, Authentication authentication) {
		User user = resolveUser(authentication);
		Event event = getEventUseCase.execute(new GetEventParam(user.getId(), eventId));
		return ResponseEntity.ok(EventApiMapper.toResponse(event));
	}

	@Override
	public ResponseEntity<EventResponseDto> update(UUID eventId, EventUpdateRequestDto request, Authentication authentication) {
		if (request.isEmpty()) {
			throw new IllegalArgumentException("At least one field must be provided");
		}

		User user = resolveUser(authentication);
		Event event = updateEventUseCase.execute(new UpdateEventParam(
			user.getId(),
			eventId,
			request.type(),
			request.title(),
			request.eventDate(),
			request.location()
		));
		return ResponseEntity.ok(EventApiMapper.toResponse(event));
	}

	private User resolveUser(Authentication authentication) {
		if (authentication == null) {
			throw new SecurityException("Unauthorized");
		}

		return getCurrentUserUseCase.execute(new GetCurrentUserParam(authentication.getName()));
	}

}
