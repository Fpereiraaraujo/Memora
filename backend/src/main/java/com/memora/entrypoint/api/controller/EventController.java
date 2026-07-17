package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.EventCheckoutPreview;
import com.memora.core.domain.model.EventCheckoutStatus;
import com.memora.core.domain.param.CreateEventParam;
import com.memora.core.domain.param.CreateEventCheckoutParam;
import com.memora.core.domain.param.GetEventCheckoutStatusParam;
import com.memora.core.domain.param.GetEventParam;
import com.memora.core.domain.param.GetEventPublicPageCustomizationParam;
import com.memora.core.domain.param.ListEventsParam;
import com.memora.core.domain.param.ListEventPhotosParam;
import com.memora.core.domain.param.ListEventPhotosPageParam;
import com.memora.core.domain.param.PreviewEventCheckoutParam;
import com.memora.core.domain.param.RemoveEventPublicPageCoverImageParam;
import com.memora.core.domain.param.RemoveEventPublicPageHighlightImagesParam;
import com.memora.core.domain.param.UpdateEventPublicPageCustomizationParam;
import com.memora.core.domain.param.UpdatePhotoFavoriteParam;
import com.memora.core.domain.param.UpdatePhotoStatusParam;
import com.memora.core.domain.param.UpdateEventStatusParam;
import com.memora.core.domain.param.UpdateEventParam;
import com.memora.core.domain.param.UploadEventPublicPageCoverImageParam;
import com.memora.core.domain.param.UploadEventPublicPageHighlightImagesParam;
import com.memora.core.domain.param.GetEventInvitationParam;
import com.memora.core.domain.param.UpdateEventInvitationParam;
import com.memora.core.domain.param.ListEventGuestsParam;
import com.memora.core.domain.param.CreateEventGuestParam;
import com.memora.core.domain.param.GetEventRsvpSummaryParam;
import com.memora.core.domain.param.GetEventQrArtCustomizationParam;
import com.memora.core.domain.param.UpdateEventQrArtCustomizationParam;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.core.usecase.PreviewEventCheckoutUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.GetEventCheckoutStatusUseCase;
import com.memora.core.usecase.GetEventPublicPageCustomizationUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.ListEventPhotosUseCase;
import com.memora.core.usecase.ListEventPhotosPageUseCase;
import com.memora.core.usecase.UpdateEventPublicPageCustomizationUseCase;
import com.memora.core.usecase.RemoveEventPublicPageCoverImageUseCase;
import com.memora.core.usecase.RemoveEventPublicPageHighlightImagesUseCase;
import com.memora.core.usecase.UpdatePhotoFavoriteUseCase;
import com.memora.core.usecase.UpdatePhotoStatusUseCase;
import com.memora.core.usecase.UpdateEventStatusUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.core.usecase.UploadEventPublicPageCoverImageUseCase;
import com.memora.core.usecase.UploadEventPublicPageHighlightImagesUseCase;
import com.memora.core.usecase.GetEventInvitationUseCase;
import com.memora.core.usecase.UpdateEventInvitationUseCase;
import com.memora.core.usecase.ListEventGuestsUseCase;
import com.memora.core.usecase.CreateEventGuestUseCase;
import com.memora.core.usecase.GetEventRsvpSummaryUseCase;
import com.memora.core.usecase.GetEventQrArtCustomizationUseCase;
import com.memora.core.usecase.UpdateEventQrArtCustomizationUseCase;
import com.memora.config.AppProperties;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.controller.definition.EventControllerApi;
import com.memora.entrypoint.api.dto.EventCreateRequestDto;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventCheckoutRequestDto;
import com.memora.entrypoint.api.dto.EventCheckoutPreviewResponseDto;
import com.memora.entrypoint.api.dto.EventCheckoutResponseDto;
import com.memora.entrypoint.api.dto.EventCheckoutStatusResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventPublicPageImageUploadResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.EventStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventUpdateRequestDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PhotoFavoriteUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.dto.PhotoStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventInvitationUpdateRequestDto;
import com.memora.entrypoint.api.dto.EventInvitationResponseDto;
import com.memora.entrypoint.api.dto.EventGuestCreateRequestDto;
import com.memora.entrypoint.api.dto.EventGuestResponseDto;
import com.memora.entrypoint.api.dto.EventRsvpSummaryResponseDto;
import com.memora.entrypoint.api.dto.EventQrArtCustomizationResponseDto;
import com.memora.entrypoint.api.dto.EventQrArtCustomizationUpdateRequestDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.EventPublicPageCustomizationApiMapper;
import com.memora.entrypoint.api.mapper.EventQrArtCustomizationApiMapper;
import com.memora.entrypoint.api.mapper.InvitationApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.shared.EventQrCodeService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController implements EventControllerApi {

	private final CreateEventUseCase createEventUseCase;
	private final CreateEventCheckoutUseCase createEventCheckoutUseCase;
	private final PreviewEventCheckoutUseCase previewEventCheckoutUseCase;
	private final GetEventCheckoutStatusUseCase getEventCheckoutStatusUseCase;
	private final ListEventsUseCase listEventsUseCase;
	private final GetEventUseCase getEventUseCase;
	private final UpdateEventUseCase updateEventUseCase;
	private final UpdateEventStatusUseCase updateEventStatusUseCase;
	private final GetEventPublicPageCustomizationUseCase getEventPublicPageCustomizationUseCase;
	private final UpdateEventPublicPageCustomizationUseCase updateEventPublicPageCustomizationUseCase;
	private final RemoveEventPublicPageCoverImageUseCase removeEventPublicPageCoverImageUseCase;
	private final RemoveEventPublicPageHighlightImagesUseCase removeEventPublicPageHighlightImagesUseCase;
	private final UploadEventPublicPageCoverImageUseCase uploadEventPublicPageCoverImageUseCase;
	private final UploadEventPublicPageHighlightImagesUseCase uploadEventPublicPageHighlightImagesUseCase;
	private final ListEventPhotosUseCase listEventPhotosUseCase;
	private final ListEventPhotosPageUseCase listEventPhotosPageUseCase;
	private final UpdatePhotoFavoriteUseCase updatePhotoFavoriteUseCase;
	private final UpdatePhotoStatusUseCase updatePhotoStatusUseCase;
	private final GetEventInvitationUseCase getEventInvitationUseCase;
	private final UpdateEventInvitationUseCase updateEventInvitationUseCase;
	private final ListEventGuestsUseCase listEventGuestsUseCase;
	private final CreateEventGuestUseCase createEventGuestUseCase;
	private final GetEventRsvpSummaryUseCase getEventRsvpSummaryUseCase;
	private final GetEventQrArtCustomizationUseCase getEventQrArtCustomizationUseCase;
	private final UpdateEventQrArtCustomizationUseCase updateEventQrArtCustomizationUseCase;
	private final EventQrCodeService eventQrCodeService;
	private final AppProperties appProperties;
	private final PhotoApiMapper photoApiMapper;
	private final EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper;

	public EventController(
		CreateEventUseCase createEventUseCase,
		CreateEventCheckoutUseCase createEventCheckoutUseCase,
		PreviewEventCheckoutUseCase previewEventCheckoutUseCase,
		GetEventCheckoutStatusUseCase getEventCheckoutStatusUseCase,
		ListEventsUseCase listEventsUseCase,
		GetEventUseCase getEventUseCase,
		UpdateEventUseCase updateEventUseCase,
		UpdateEventStatusUseCase updateEventStatusUseCase,
		GetEventPublicPageCustomizationUseCase getEventPublicPageCustomizationUseCase,
		UpdateEventPublicPageCustomizationUseCase updateEventPublicPageCustomizationUseCase,
		RemoveEventPublicPageCoverImageUseCase removeEventPublicPageCoverImageUseCase,
		RemoveEventPublicPageHighlightImagesUseCase removeEventPublicPageHighlightImagesUseCase,
		UploadEventPublicPageCoverImageUseCase uploadEventPublicPageCoverImageUseCase,
		UploadEventPublicPageHighlightImagesUseCase uploadEventPublicPageHighlightImagesUseCase,
		ListEventPhotosUseCase listEventPhotosUseCase,
		ListEventPhotosPageUseCase listEventPhotosPageUseCase,
		UpdatePhotoFavoriteUseCase updatePhotoFavoriteUseCase,
		UpdatePhotoStatusUseCase updatePhotoStatusUseCase,
		GetEventInvitationUseCase getEventInvitationUseCase,
		UpdateEventInvitationUseCase updateEventInvitationUseCase,
		ListEventGuestsUseCase listEventGuestsUseCase,
		CreateEventGuestUseCase createEventGuestUseCase,
		GetEventRsvpSummaryUseCase getEventRsvpSummaryUseCase,
		GetEventQrArtCustomizationUseCase getEventQrArtCustomizationUseCase,
		UpdateEventQrArtCustomizationUseCase updateEventQrArtCustomizationUseCase,
		EventQrCodeService eventQrCodeService,
		AppProperties appProperties,
		PhotoApiMapper photoApiMapper,
		EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper
	) {
		this.createEventUseCase = createEventUseCase;
		this.createEventCheckoutUseCase = createEventCheckoutUseCase;
		this.previewEventCheckoutUseCase = previewEventCheckoutUseCase;
		this.getEventCheckoutStatusUseCase = getEventCheckoutStatusUseCase;
		this.listEventsUseCase = listEventsUseCase;
		this.getEventUseCase = getEventUseCase;
		this.updateEventUseCase = updateEventUseCase;
		this.updateEventStatusUseCase = updateEventStatusUseCase;
		this.getEventPublicPageCustomizationUseCase = getEventPublicPageCustomizationUseCase;
		this.updateEventPublicPageCustomizationUseCase = updateEventPublicPageCustomizationUseCase;
		this.removeEventPublicPageCoverImageUseCase = removeEventPublicPageCoverImageUseCase;
		this.removeEventPublicPageHighlightImagesUseCase = removeEventPublicPageHighlightImagesUseCase;
		this.uploadEventPublicPageCoverImageUseCase = uploadEventPublicPageCoverImageUseCase;
		this.uploadEventPublicPageHighlightImagesUseCase = uploadEventPublicPageHighlightImagesUseCase;
		this.listEventPhotosUseCase = listEventPhotosUseCase;
		this.listEventPhotosPageUseCase = listEventPhotosPageUseCase;
		this.updatePhotoFavoriteUseCase = updatePhotoFavoriteUseCase;
		this.updatePhotoStatusUseCase = updatePhotoStatusUseCase;
		this.getEventInvitationUseCase = getEventInvitationUseCase;
		this.updateEventInvitationUseCase = updateEventInvitationUseCase;
		this.listEventGuestsUseCase = listEventGuestsUseCase;
		this.createEventGuestUseCase = createEventGuestUseCase;
		this.getEventRsvpSummaryUseCase = getEventRsvpSummaryUseCase;
		this.getEventQrArtCustomizationUseCase = getEventQrArtCustomizationUseCase;
		this.updateEventQrArtCustomizationUseCase = updateEventQrArtCustomizationUseCase;
		this.eventQrCodeService = eventQrCodeService;
		this.appProperties = appProperties;
		this.photoApiMapper = photoApiMapper;
		this.eventPublicPageCustomizationApiMapper = eventPublicPageCustomizationApiMapper;
	}

	@Override
	public ResponseEntity<EventCheckoutPreviewResponseDto> previewCheckout(UUID eventId, EventCheckoutRequestDto request, Authentication authentication) {
		EventCheckoutPreview preview = previewEventCheckoutUseCase.execute(new PreviewEventCheckoutParam(
			resolveUserId(authentication),
			eventId,
			request.planCode(),
			request.couponCode(),
			request.referralCode()
		));

		return ResponseEntity.ok(new EventCheckoutPreviewResponseDto(
			preview.getPlanCode(),
			preview.getOriginalAmountCents(),
			preview.getDiscountAmountCents(),
			preview.getFinalAmountCents(),
			preview.getCouponCode(),
			preview.getReferralCode(),
			preview.isReferralApplied(),
			preview.getDiscountPercent(),
			preview.isCouponApplied(),
			preview.getMessage()
		));
	}

	@Override
	public ResponseEntity<EventCreateResponseDto> create(EventCreateRequestDto request, Authentication authentication) {
		Event event = createEventUseCase.execute(new CreateEventParam(
			resolveUserId(authentication),
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
		PaymentOrder paymentOrder = createEventCheckoutUseCase.execute(new CreateEventCheckoutParam(
			resolveUserId(authentication),
			eventId,
			request.planCode(),
			request.couponCode(),
			request.referralCode()
		));

		return ResponseEntity.ok(new EventCheckoutResponseDto(
			paymentOrder.getId(),
			paymentOrder.getPlanCode(),
			paymentOrder.getStatus(),
			paymentOrder.getOriginalAmountCents(),
			paymentOrder.getDiscountAmountCents(),
			paymentOrder.getFinalAmountCents(),
			paymentOrder.getCouponCode(),
			paymentOrder.getDiscountPercent(),
			paymentOrder.getCouponCode() != null ? "Cupom aplicado com sucesso." : null,
			paymentOrder.getCheckoutUrl()
		));
	}

	@Override
	public ResponseEntity<EventCheckoutStatusResponseDto> checkoutStatus(UUID eventId, Authentication authentication) {
		EventCheckoutStatus checkoutStatus = getEventCheckoutStatusUseCase.execute(new GetEventCheckoutStatusParam(
			resolveUserId(authentication),
			eventId
		));

		return ResponseEntity.ok(new EventCheckoutStatusResponseDto(
			checkoutStatus.getPaymentOrderId(),
			checkoutStatus.getStatus(),
			checkoutStatus.getPlanCode(),
			checkoutStatus.getEventStatus(),
			checkoutStatus.getPaidAt(),
			checkoutStatus.getCheckoutUrl()
		));
	}

	@Override
	public ResponseEntity<List<EventResponseDto>> list(Authentication authentication) {
		List<EventResponseDto> events = listEventsUseCase.execute(new ListEventsParam(resolveUserId(authentication)))
			.stream()
			.map(EventApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(events);
	}

	@Override
	public ResponseEntity<EventResponseDto> get(UUID eventId, Authentication authentication) {
		Event event = getEventUseCase.execute(new GetEventParam(resolveUserId(authentication), eventId));
		return ResponseEntity.ok(EventApiMapper.toResponse(event));
	}

	@Override
	public ResponseEntity<byte[]> qrcode(UUID eventId, int size, Authentication authentication, HttpServletRequest request) {
		Event event = getEventUseCase.execute(new GetEventParam(resolveUserId(authentication), eventId));
		String publicBaseUrl = resolvePublicBaseUrl(request);
		String publicUrl = publicBaseUrl + "/e/" + event.getSlug() + "/upload";
		int normalizedSize = Math.min(Math.max(size, 320), 1024);
		byte[] qrCode = eventQrCodeService.generateCachedPng(publicUrl, normalizedSize);

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"memora-" + event.getSlug() + "-qrcode.png\"")
			.contentType(MediaType.IMAGE_PNG)
			.body(qrCode);
	}

	@Override
	public ResponseEntity<EventQrArtCustomizationResponseDto> getQrArt(UUID eventId, Authentication authentication) {
		var customization = getEventQrArtCustomizationUseCase.execute(new GetEventQrArtCustomizationParam(
			resolveUserId(authentication),
			eventId
		));
		return ResponseEntity.ok(EventQrArtCustomizationApiMapper.toResponse(customization));
	}

	@Override
	public ResponseEntity<EventQrArtCustomizationResponseDto> updateQrArt(
		UUID eventId,
		EventQrArtCustomizationUpdateRequestDto request,
		Authentication authentication
	) {
		var customization = updateEventQrArtCustomizationUseCase.execute(new UpdateEventQrArtCustomizationParam(
			resolveUserId(authentication),
			eventId,
			request.title(),
			request.subtitle(),
			request.callToAction(),
			request.message(),
			request.themeName(),
			request.primaryColor(),
			request.secondaryColor(),
			request.accentColor(),
			request.visualStyle(),
			request.templateCode(),
			request.format(),
			request.showMemoraBranding(),
			request.showEventDate(),
			request.showEventLocation()
		));
		return ResponseEntity.ok(EventQrArtCustomizationApiMapper.toResponse(customization));
	}

	@Override
	public ResponseEntity<EventResponseDto> update(UUID eventId, EventUpdateRequestDto request, Authentication authentication) {
		if (request.isEmpty()) {
			throw new IllegalArgumentException("At least one field must be provided");
		}

		Event event = updateEventUseCase.execute(new UpdateEventParam(
			resolveUserId(authentication),
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
		Event event = updateEventStatusUseCase.execute(new UpdateEventStatusParam(
			resolveUserId(authentication),
			eventId,
			request.status()
		));
		return ResponseEntity.ok(EventApiMapper.toResponse(event));
	}

	@Override
	public ResponseEntity<EventInvitationResponseDto> getInvitation(UUID eventId, Authentication authentication) {
		return ResponseEntity.ok(InvitationApiMapper.toResponse(getEventInvitationUseCase.execute(new GetEventInvitationParam(resolveUserId(authentication), eventId))));
	}

	@Override
	public ResponseEntity<EventInvitationResponseDto> updateInvitation(UUID eventId, EventInvitationUpdateRequestDto request, Authentication authentication) {
		return ResponseEntity.ok(InvitationApiMapper.toResponse(updateEventInvitationUseCase.execute(new UpdateEventInvitationParam(resolveUserId(authentication), eventId, request.theme(), request.rsvpEnabled(), request.rsvpDeadline(), request.ceremonyTime(), request.receptionTime(), request.dressCode(), request.registryUrl(), request.published()))));
	}

	@Override
	public ResponseEntity<PageResponseDto<EventGuestResponseDto>> listGuests(UUID eventId, int page, int size, Authentication authentication) {
		var result = listEventGuestsUseCase.execute(new ListEventGuestsParam(resolveUserId(authentication), eventId, normalizePage(page), normalizeSize(size)));
		return ResponseEntity.ok(new PageResponseDto<>(result.content().stream().map(InvitationApiMapper::toResponse).toList(), result.page(), result.size(), result.totalElements(), result.totalPages(), result.last()));
	}

	@Override
	public ResponseEntity<EventGuestResponseDto> createGuest(UUID eventId, EventGuestCreateRequestDto request, Authentication authentication) {
		return ResponseEntity.status(HttpStatus.CREATED).body(InvitationApiMapper.toResponse(createEventGuestUseCase.execute(new CreateEventGuestParam(resolveUserId(authentication), eventId, request.name(), request.phone(), request.email(), request.guestGroup(), request.maxPlusOnes()))));
	}

	@Override
	public ResponseEntity<EventRsvpSummaryResponseDto> rsvpSummary(UUID eventId, Authentication authentication) {
		return ResponseEntity.ok(InvitationApiMapper.toResponse(getEventRsvpSummaryUseCase.execute(new GetEventRsvpSummaryParam(resolveUserId(authentication), eventId))));
	}

	@Override
	public ResponseEntity<EventPublicPageCustomizationResponseDto> getPublicPageCustomization(UUID eventId, Authentication authentication) {
		var customization = getEventPublicPageCustomizationUseCase.execute(new GetEventPublicPageCustomizationParam(
			resolveUserId(authentication),
			eventId
		));

		return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toResponse(customization));
	}

	@Override
	public ResponseEntity<EventPublicPageCustomizationResponseDto> updatePublicPageCustomization(UUID eventId, EventPublicPageCustomizationUpdateRequestDto request, Authentication authentication) {
		var customization = updateEventPublicPageCustomizationUseCase.execute(new UpdateEventPublicPageCustomizationParam(
			resolveUserId(authentication),
			eventId,
			request.title(),
			request.eventDate(),
			request.welcomeMessage(),
			request.publicGalleryEnabled() == null || request.publicGalleryEnabled()
		));

		return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toResponse(customization));
	}

	@Override
	public ResponseEntity<EventPublicPageImageUploadResponseDto> uploadPublicPageCoverImage(UUID eventId, MultipartFile file, Authentication authentication) {
		try {
			var customization = uploadEventPublicPageCoverImageUseCase.execute(new UploadEventPublicPageCoverImageParam(
				resolveUserId(authentication),
				eventId,
				file == null ? null : file.getOriginalFilename(),
				file == null ? null : file.getContentType(),
				file == null ? null : file.getBytes()
			));

			return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toCoverUploadResponse(customization));
		} catch (IOException exception) {
			throw new IllegalStateException("Unable to read uploaded cover image", exception);
		}
	}

	@Override
	public ResponseEntity<EventPublicPageImageUploadResponseDto> removePublicPageCoverImage(UUID eventId, Authentication authentication) {
		var customization = removeEventPublicPageCoverImageUseCase.execute(new RemoveEventPublicPageCoverImageParam(
			resolveUserId(authentication),
			eventId
		));

		return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toCoverUploadResponse(customization));
	}

	@Override
	public ResponseEntity<EventPublicPageImageUploadResponseDto> uploadPublicPageHighlightImages(UUID eventId, List<MultipartFile> files, Authentication authentication) {
		try {
			var customization = uploadEventPublicPageHighlightImagesUseCase.execute(new UploadEventPublicPageHighlightImagesParam(
				resolveUserId(authentication),
				eventId,
				files == null ? List.of() : files.stream().map(file -> {
					try {
						return new UploadEventPublicPageHighlightImagesParam.UploadImageItemParam(
							file.getOriginalFilename(),
							file.getContentType(),
							file.getBytes()
						);
					} catch (IOException exception) {
						throw new IllegalStateException("Unable to read uploaded highlight image", exception);
					}
				}).toList()
			));

			return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toHighlightUploadResponse(customization));
		} catch (IllegalStateException exception) {
			throw exception;
		}
	}

	@Override
	public ResponseEntity<EventPublicPageImageUploadResponseDto> removePublicPageHighlightImages(UUID eventId, Authentication authentication) {
		var customization = removeEventPublicPageHighlightImagesUseCase.execute(new RemoveEventPublicPageHighlightImagesParam(
			resolveUserId(authentication),
			eventId
		));

		return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toHighlightUploadResponse(customization));
	}

	@Override
	public ResponseEntity<List<PhotoResponseDto>> photos(UUID eventId, Authentication authentication) {
		List<PhotoResponseDto> photos = listEventPhotosUseCase.execute(new ListEventPhotosParam(resolveUserId(authentication), eventId))
			.stream()
			.map(photoApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(photos);
	}

	@Override
	public ResponseEntity<PageResponseDto<PhotoResponseDto>> pagedPhotos(UUID eventId, int page, int size, Authentication authentication) {
		PageResult<PhotoResponseDto> result = mapPhotoPage(
			listEventPhotosPageUseCase.execute(new ListEventPhotosPageParam(
				resolveUserId(authentication),
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

		var photo = updatePhotoFavoriteUseCase.execute(new UpdatePhotoFavoriteParam(
			resolveUserId(authentication),
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

		var photo = updatePhotoStatusUseCase.execute(new UpdatePhotoStatusParam(
			resolveUserId(authentication),
			eventId,
			photoId,
			request.status()
		));

		return ResponseEntity.ok(photoApiMapper.toResponse(photo));
	}

	private UUID resolveUserId(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
			throw new SecurityException("Unauthorized");
		}

		return principal.userId();
	}

	private int normalizePage(int page) {
		return Math.max(page, 0);
	}

	private int normalizeSize(int size) {
		return Math.min(Math.max(size, 1), 100);
	}

	private String resolvePublicBaseUrl(HttpServletRequest request) {
		String requestOrigin = extractRequestOrigin(request);
		if (requestOrigin != null) {
			return requestOrigin;
		}

		String configuredBaseUrl = normalizeBaseUrl(appProperties.publicBaseUrl());
		if (configuredBaseUrl != null) {
			return configuredBaseUrl;
		}

		throw new IllegalStateException("Public app base URL is not configured");
	}

	private String extractRequestOrigin(HttpServletRequest request) {
		if (request == null) {
			return null;
		}

		String originHeader = normalizeBaseUrl(request.getHeader("Origin"));
		if (originHeader != null) {
			return originHeader;
		}

		String referer = request.getHeader("Referer");
		if (referer == null || referer.isBlank()) {
			return null;
		}

		try {
			URI refererUri = new URI(referer);
			if (refererUri.getScheme() == null || refererUri.getAuthority() == null) {
				return null;
			}
			return normalizeBaseUrl(refererUri.getScheme() + "://" + refererUri.getAuthority());
		} catch (URISyntaxException exception) {
			return null;
		}
	}

	private String normalizeBaseUrl(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}

		return value.endsWith("/")
			? value.substring(0, value.length() - 1)
			: value;
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
