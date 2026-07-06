package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.User;
import com.memora.core.domain.param.CreateEventParam;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.domain.param.GetEventParam;
import com.memora.core.domain.param.ListEventsParam;
import com.memora.core.domain.param.ListEventPhotosParam;
import com.memora.core.domain.param.ListEventPhotosPageParam;
import com.memora.core.domain.param.UpdatePhotoFavoriteParam;
import com.memora.core.domain.param.UpdatePhotoStatusParam;
import com.memora.core.domain.param.UpdateEventStatusParam;
import com.memora.core.domain.param.UpdateEventParam;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.ListEventPhotosUseCase;
import com.memora.core.usecase.ListEventPhotosPageUseCase;
import com.memora.core.usecase.UpdatePhotoFavoriteUseCase;
import com.memora.core.usecase.UpdatePhotoStatusUseCase;
import com.memora.core.usecase.UpdateEventStatusUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.config.AppProperties;
import com.memora.entrypoint.api.controller.definition.EventControllerApi;
import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventCheckoutRequestDto;
import com.memora.entrypoint.api.dto.EventCheckoutResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PhotoFavoriteUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.dto.PhotoStatusUpdateRequestDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.shared.EventQrCodeService;
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
	private final CreateEventCheckoutUseCase createEventCheckoutUseCase;
	private final ListEventsUseCase listEventsUseCase;
	private final GetEventUseCase getEventUseCase;
	private final UpdateEventUseCase updateEventUseCase;
	private final UpdateEventStatusUseCase updateEventStatusUseCase;
	private final ListEventPhotosUseCase listEventPhotosUseCase;
	private final ListEventPhotosPageUseCase listEventPhotosPageUseCase;
	private final UpdatePhotoFavoriteUseCase updatePhotoFavoriteUseCase;
	private final UpdatePhotoStatusUseCase updatePhotoStatusUseCase;
	private final EventQrCodeService eventQrCodeService;
	private final AppProperties appProperties;
	private final PhotoApiMapper photoApiMapper;

	public EventController(
		GetCurrentUserUseCase getCurrentUserUseCase,
		CreateEventUseCase createEventUseCase,
		CreateEventCheckoutUseCase createEventCheckoutUseCase,
		ListEventsUseCase listEventsUseCase,
		GetEventUseCase getEventUseCase,
		UpdateEventUseCase updateEventUseCase,
		UpdateEventStatusUseCase updateEventStatusUseCase,
		ListEventPhotosUseCase listEventPhotosUseCase,
		ListEventPhotosPageUseCase listEventPhotosPageUseCase,
		UpdatePhotoFavoriteUseCase updatePhotoFavoriteUseCase,
		UpdatePhotoStatusUseCase updatePhotoStatusUseCase,
		EventQrCodeService eventQrCodeService,
		AppProperties appProperties,
		PhotoApiMapper photoApiMapper
	) {
		this.getCurrentUserUseCase = getCurrentUserUseCase;
		this.createEventUseCase = createEventUseCase;
		this.createEventCheckoutUseCase = createEventCheckoutUseCase;
		this.listEventsUseCase = listEventsUseCase;
		this.getEventUseCase = getEventUseCase;
		this.updateEventUseCase = updateEventUseCase;
		this.updateEventStatusUseCase = updateEventStatusUseCase;
		this.listEventPhotosUseCase = listEventPhotosUseCase;
		this.listEventPhotosPageUseCase = listEventPhotosPageUseCase;
		this.updatePhotoFavoriteUseCase = updatePhotoFavoriteUseCase;
		this.updatePhotoStatusUseCase = updatePhotoStatusUseCase;
		this.eventQrCodeService = eventQrCodeService;
		this.appProperties = appProperties;
		this.photoApiMapper = photoApiMapper;
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
	public ResponseEntity<EventCheckoutResponseDto> createCheckout(UUID eventId, EventCheckoutRequestDto request, Authentication authentication) {
		User user = resolveUser(authentication);
		PaymentOrder paymentOrder = createEventCheckoutUseCase.execute(new CreateEventCheckoutParam(
			user.getId(),
			eventId,
			request.planCode()
		));

		return ResponseEntity.ok(new EventCheckoutResponseDto(
			paymentOrder.getId(),
			paymentOrder.getPlanCode(),
			paymentOrder.getStatus(),
			paymentOrder.getAmountCents(),
			paymentOrder.getCheckoutUrl()
		));
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
		String publicUrl = publicBaseUrl + "/e/" + event.getSlug() + "/upload";
		byte[] qrCode = eventQrCodeService.generateCachedPng(publicUrl);

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"memora-" + event.getSlug() + "-qrcode.png\"")
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
	public ResponseEntity<EventResponseDto> updateStatus(UUID eventId, EventStatusUpdateRequestDto request, Authentication authentication) {
		User user = resolveUser(authentication);
		Event event = updateEventStatusUseCase.execute(new UpdateEventStatusParam(
			user.getId(),
			eventId,
			request.status()
		));
		return ResponseEntity.ok(EventApiMapper.toResponse(event));
	}

	@Override
	public ResponseEntity<List<PhotoResponseDto>> photos(UUID eventId, Authentication authentication) {
		User user = resolveUser(authentication);
		List<PhotoResponseDto> photos = listEventPhotosUseCase.execute(new ListEventPhotosParam(user.getId(), eventId))
			.stream()
			.map(photoApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(photos);
	}

	@Override
	public ResponseEntity<PageResponseDto<PhotoResponseDto>> pagedPhotos(UUID eventId, int page, int size, Authentication authentication) {
		User user = resolveUser(authentication);
		PageResult<PhotoResponseDto> result = mapPhotoPage(
			listEventPhotosPageUseCase.execute(new ListEventPhotosPageParam(
				user.getId(),
				eventId,
				normalizePage(page),
				normalizeSize(size)
			))
		);

		return ResponseEntity.ok(new PageResponseDto<>(
			result.content(),
			result.page(),
			result.size(),
			result.totalElements(),
			result.totalPages(),
			result.last()
		));
	}

	@Override
	public ResponseEntity<PhotoResponseDto> updatePhotoFavorite(UUID eventId, UUID photoId, PhotoFavoriteUpdateRequestDto request, Authentication authentication) {
		if (request.favorite() == null) {
			throw new IllegalArgumentException("Favorite value is required");
		}

		User user = resolveUser(authentication);
		var photo = updatePhotoFavoriteUseCase.execute(new UpdatePhotoFavoriteParam(
			user.getId(),
			eventId,
			photoId,
			request.favorite()
		));

		return ResponseEntity.ok(photoApiMapper.toResponse(photo));
	}

	@Override
	public ResponseEntity<PhotoResponseDto> updatePhotoStatus(UUID eventId, UUID photoId, PhotoStatusUpdateRequestDto request, Authentication authentication) {
		if (request.status() == null) {
			throw new IllegalArgumentException("Photo status is required");
		}

		User user = resolveUser(authentication);
		var photo = updatePhotoStatusUseCase.execute(new UpdatePhotoStatusParam(
			user.getId(),
			eventId,
			photoId,
			request.status()
		));

		return ResponseEntity.ok(photoApiMapper.toResponse(photo));
	}

	private User resolveUser(Authentication authentication) {
		if (authentication == null) {
			throw new SecurityException("Unauthorized");
		}

		return getCurrentUserUseCase.execute(new GetCurrentUserParam(authentication.getName()));
	}

	private int normalizePage(int page) {
		return Math.max(page, 0);
	}

	private int normalizeSize(int size) {
		return Math.min(Math.max(size, 1), 100);
	}

	private PageResult<PhotoResponseDto> mapPhotoPage(PageResult<com.memora.core.domain.model.Photo> result) {
		return new PageResult<>(
			result.content().stream().map(photoApiMapper::toResponse).toList(),
			result.page(),
			result.size(),
			result.totalElements(),
			result.totalPages(),
			result.last()
		);
	}

}
