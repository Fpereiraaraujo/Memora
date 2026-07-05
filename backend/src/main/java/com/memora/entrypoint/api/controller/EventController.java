package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.User;
import com.memora.core.domain.param.CreateEventParam;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.domain.param.GetEventParam;
import com.memora.core.domain.param.ListEventsParam;
import com.memora.core.domain.param.ListEventPhotosParam;
import com.memora.core.domain.param.UpdateEventParam;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.ListEventPhotosUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.config.AppProperties;
import com.memora.entrypoint.api.controller.definition.EventControllerApi;
import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.shared.QrCodeGenerator;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
	private final ListEventPhotosUseCase listEventPhotosUseCase;
	private final QrCodeGenerator qrCodeGenerator;
	private final AppProperties appProperties;

	public EventController(
		GetCurrentUserUseCase getCurrentUserUseCase,
		CreateEventUseCase createEventUseCase,
		ListEventsUseCase listEventsUseCase,
		GetEventUseCase getEventUseCase,
		UpdateEventUseCase updateEventUseCase,
		ListEventPhotosUseCase listEventPhotosUseCase,
		QrCodeGenerator qrCodeGenerator,
		AppProperties appProperties
	) {
		this.getCurrentUserUseCase = getCurrentUserUseCase;
		this.createEventUseCase = createEventUseCase;
		this.listEventsUseCase = listEventsUseCase;
		this.getEventUseCase = getEventUseCase;
		this.updateEventUseCase = updateEventUseCase;
		this.listEventPhotosUseCase = listEventPhotosUseCase;
		this.qrCodeGenerator = qrCodeGenerator;
		this.appProperties = appProperties;
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
	public ResponseEntity<byte[]> qrcode(UUID eventId, Authentication authentication) {
		User user = resolveUser(authentication);
		Event event = getEventUseCase.execute(new GetEventParam(user.getId(), eventId));
		String publicBaseUrl = appProperties.publicBaseUrl().endsWith("/")
			? appProperties.publicBaseUrl().substring(0, appProperties.publicBaseUrl().length() - 1)
			: appProperties.publicBaseUrl();
		String publicUrl = publicBaseUrl + "/e/" + event.getSlug();
		byte[] qrCode = qrCodeGenerator.generatePng(publicUrl, 320);

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"event-qrcode.png\"")
			.contentType(MediaType.IMAGE_PNG)
			.body(qrCode);
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

	@Override
	public ResponseEntity<List<PhotoResponseDto>> photos(UUID eventId, Authentication authentication) {
		User user = resolveUser(authentication);
		List<PhotoResponseDto> photos = listEventPhotosUseCase.execute(new ListEventPhotosParam(user.getId(), eventId))
			.stream()
			.map(PhotoApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(photos);
	}

	private User resolveUser(Authentication authentication) {
		if (authentication == null) {
			throw new SecurityException("Unauthorized");
		}

		return getCurrentUserUseCase.execute(new GetCurrentUserParam(authentication.getName()));
	}

}
