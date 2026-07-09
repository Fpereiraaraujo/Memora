package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.AppProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.usecase.CreateEventCheckoutUseCase;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.GetEventCheckoutStatusUseCase;
import com.memora.core.usecase.GetEventPublicPageCustomizationUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.ListEventPhotosPageUseCase;
import com.memora.core.usecase.ListEventPhotosUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.RemoveEventPublicPageCoverImageUseCase;
import com.memora.core.usecase.RemoveEventPublicPageHighlightImagesUseCase;
import com.memora.core.usecase.UpdateEventPublicPageCustomizationUseCase;
import com.memora.core.usecase.UpdateEventStatusUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.core.usecase.UpdatePhotoFavoriteUseCase;
import com.memora.core.usecase.UpdatePhotoStatusUseCase;
import com.memora.core.usecase.UploadEventPublicPageCoverImageUseCase;
import com.memora.core.usecase.UploadEventPublicPageHighlightImagesUseCase;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.dto.EventCheckoutRequestDto;
import com.memora.entrypoint.api.dto.EventCheckoutResponseDto;
import com.memora.entrypoint.api.dto.EventCreateRequestDto;
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
import com.memora.entrypoint.api.mapper.EventPublicPageCustomizationApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.shared.EventQrCodeService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

	@Mock private CreateEventUseCase createEventUseCase;
	@Mock private CreateEventCheckoutUseCase createEventCheckoutUseCase;
	@Mock private GetEventCheckoutStatusUseCase getEventCheckoutStatusUseCase;
	@Mock private ListEventsUseCase listEventsUseCase;
	@Mock private GetEventUseCase getEventUseCase;
	@Mock private UpdateEventUseCase updateEventUseCase;
	@Mock private UpdateEventStatusUseCase updateEventStatusUseCase;
	@Mock private GetEventPublicPageCustomizationUseCase getEventPublicPageCustomizationUseCase;
	@Mock private UpdateEventPublicPageCustomizationUseCase updateEventPublicPageCustomizationUseCase;
	@Mock private RemoveEventPublicPageCoverImageUseCase removeEventPublicPageCoverImageUseCase;
	@Mock private RemoveEventPublicPageHighlightImagesUseCase removeEventPublicPageHighlightImagesUseCase;
	@Mock private UploadEventPublicPageCoverImageUseCase uploadEventPublicPageCoverImageUseCase;
	@Mock private UploadEventPublicPageHighlightImagesUseCase uploadEventPublicPageHighlightImagesUseCase;
	@Mock private ListEventPhotosUseCase listEventPhotosUseCase;
	@Mock private ListEventPhotosPageUseCase listEventPhotosPageUseCase;
	@Mock private UpdatePhotoFavoriteUseCase updatePhotoFavoriteUseCase;
	@Mock private UpdatePhotoStatusUseCase updatePhotoStatusUseCase;
	@Mock private EventQrCodeService eventQrCodeService;
	@Mock private AppProperties appProperties;
	@Mock private PhotoApiMapper photoApiMapper;
	@Mock private EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper;

	private EventController controller;
	private Authentication authentication;

	@BeforeEach
	void setUp() {
		controller = new EventController(
			createEventUseCase,
			createEventCheckoutUseCase,
			getEventCheckoutStatusUseCase,
			listEventsUseCase,
			getEventUseCase,
			updateEventUseCase,
			updateEventStatusUseCase,
			getEventPublicPageCustomizationUseCase,
			updateEventPublicPageCustomizationUseCase,
			removeEventPublicPageCoverImageUseCase,
			removeEventPublicPageHighlightImagesUseCase,
			uploadEventPublicPageCoverImageUseCase,
			uploadEventPublicPageHighlightImagesUseCase,
			listEventPhotosUseCase,
			listEventPhotosPageUseCase,
			updatePhotoFavoriteUseCase,
			updatePhotoStatusUseCase,
			eventQrCodeService,
			appProperties,
			photoApiMapper,
			eventPublicPageCustomizationApiMapper
		);

		authentication = new TestingAuthenticationToken(
			new AuthenticatedUserPrincipal(
				UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879"),
				"isa@memora.app",
				"HOST"
			),
			null
		);
	}

	@Test
	void createReturnsCreatedEvent() {
		when(createEventUseCase.execute(any())).thenReturn(sampleEvent());

		ResponseEntity<?> response = controller.create(
			new EventCreateRequestDto(EventType.WEDDING, "Isadora & Fernando", LocalDate.of(2026, 10, 8), "Campo Largo"),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
	}

	@Test
	void createCheckoutReturnsPaymentOrder() {
		when(createEventCheckoutUseCase.execute(any())).thenReturn(samplePaymentOrder());

		ResponseEntity<EventCheckoutResponseDto> response = controller.createCheckout(
			sampleEvent().getId(),
			new EventCheckoutRequestDto(EventPlanCode.EVENT),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().checkoutUrl()).isEqualTo("https://checkout.memora.app/pay/1");
	}

	@Test
	void listReturnsOwnerEvents() {
		when(listEventsUseCase.execute(any())).thenReturn(List.of(sampleEvent()));

		ResponseEntity<List<EventResponseDto>> response = controller.list(authentication);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).hasSize(1);
	}

	@Test
	void getReturnsEvent() {
		when(getEventUseCase.execute(any())).thenReturn(sampleEvent());

		ResponseEntity<EventResponseDto> response = controller.get(sampleEvent().getId(), authentication);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().slug()).isEqualTo("isa-fer");
	}

	@Test
	void qrcodeUsesRequestOriginBeforeConfiguredBaseUrl() {
		Event event = sampleEvent();
		HttpServletRequest request = requestWithOrigin("https://memora-pied.vercel.app");
		when(getEventUseCase.execute(any())).thenReturn(event);
		when(eventQrCodeService.generateCachedPng("https://memora-pied.vercel.app/e/isa-fer/upload"))
			.thenReturn(new byte[] {1, 2, 3});

		ResponseEntity<byte[]> response = controller.qrcode(event.getId(), authentication, request);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);
		assertThat(response.getBody()).containsExactly((byte) 1, (byte) 2, (byte) 3);
	}

	@Test
	void qrcodeFallsBackToConfiguredBaseUrlWhenOriginIsMissing() {
		Event event = sampleEvent();
		MockHttpServletRequest request = new MockHttpServletRequest();
		when(getEventUseCase.execute(any())).thenReturn(event);
		when(appProperties.publicBaseUrl()).thenReturn("https://memora.app/");
		when(eventQrCodeService.generateCachedPng("https://memora.app/e/isa-fer/upload"))
			.thenReturn(new byte[] {9, 8, 7});

		ResponseEntity<byte[]> response = controller.qrcode(event.getId(), authentication, request);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).containsExactly((byte) 9, (byte) 8, (byte) 7);
	}

	@Test
	void updateReturnsChangedEvent() {
		when(updateEventUseCase.execute(any())).thenReturn(sampleEvent().toBuilder().location("Curitiba").build());

		ResponseEntity<EventResponseDto> response = controller.update(
			sampleEvent().getId(),
			new EventUpdateRequestDto(null, "Isadora & Fernando", null, "Curitiba"),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().location()).isEqualTo("Curitiba");
	}

	@Test
	void updateRejectsEmptyPayload() {
		assertThatThrownBy(() -> controller.update(
			sampleEvent().getId(),
			new EventUpdateRequestDto(null, null, null, null),
			authentication
		)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void updateStatusReturnsUpdatedEvent() {
		when(updateEventStatusUseCase.execute(any())).thenReturn(sampleEvent().toBuilder().status(EventStatus.PAUSED).build());

		ResponseEntity<EventResponseDto> response = controller.updateStatus(
			sampleEvent().getId(),
			new EventStatusUpdateRequestDto(EventStatus.PAUSED),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(EventStatus.PAUSED);
	}

	@Test
	void getPublicPageCustomizationReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageCustomizationResponseDto dto = new EventPublicPageCustomizationResponseDto(
			"Isadora & Fernando",
			LocalDate.of(2026, 10, 8),
			"Bem-vindos",
			"https://cdn/cover.png",
			List.of("https://cdn/highlight-1.png"),
			LocalDateTime.now()
		);
		when(getEventPublicPageCustomizationUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageCustomizationResponseDto> response = controller.getPublicPageCustomization(
			sampleEvent().getId(),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void updatePublicPageCustomizationReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageCustomizationResponseDto dto = new EventPublicPageCustomizationResponseDto(
			"Isadora & Fernando",
			LocalDate.of(2026, 10, 8),
			"Bem-vindos",
			"https://cdn/cover.png",
			List.of("https://cdn/highlight-1.png"),
			LocalDateTime.now()
		);
		when(updateEventPublicPageCustomizationUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageCustomizationResponseDto> response = controller.updatePublicPageCustomization(
			sampleEvent().getId(),
			new EventPublicPageCustomizationUpdateRequestDto("Isadora & Fernando", LocalDate.of(2026, 10, 8), "Bem-vindos"),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void uploadPublicPageCoverImageReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageImageUploadResponseDto dto = new EventPublicPageImageUploadResponseDto("https://cdn/cover.png", null);
		when(uploadEventPublicPageCoverImageUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toCoverUploadResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageImageUploadResponseDto> response = controller.uploadPublicPageCoverImage(
			sampleEvent().getId(),
			new MockMultipartFile("file", "cover.png", "image/png", new byte[] {1, 2, 3}),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void removePublicPageCoverImageReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageImageUploadResponseDto dto = new EventPublicPageImageUploadResponseDto(null, null);
		when(removeEventPublicPageCoverImageUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toCoverUploadResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageImageUploadResponseDto> response = controller.removePublicPageCoverImage(
			sampleEvent().getId(),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void uploadPublicPageHighlightImagesReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageImageUploadResponseDto dto = new EventPublicPageImageUploadResponseDto(null, List.of("https://cdn/highlight-1.png"));
		when(uploadEventPublicPageHighlightImagesUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toHighlightUploadResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageImageUploadResponseDto> response = controller.uploadPublicPageHighlightImages(
			sampleEvent().getId(),
			List.of(
				new MockMultipartFile("files", "a.png", "image/png", new byte[] {1}),
				new MockMultipartFile("files", "b.png", "image/png", new byte[] {2})
			),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void removePublicPageHighlightImagesReturnsMappedResponse() {
		EventPublicPageCustomization customization = sampleCustomization();
		EventPublicPageImageUploadResponseDto dto = new EventPublicPageImageUploadResponseDto(null, List.of());
		when(removeEventPublicPageHighlightImagesUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toHighlightUploadResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageImageUploadResponseDto> response = controller.removePublicPageHighlightImages(
			sampleEvent().getId(),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void photosReturnsMappedPhotos() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(listEventPhotosUseCase.execute(any())).thenReturn(List.of(photo));
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<List<PhotoResponseDto>> response = controller.photos(sampleEvent().getId(), authentication);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).containsExactly(photoResponse);
	}

	@Test
	void pagedPhotosNormalizesPageAndSize() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(listEventPhotosPageUseCase.execute(any()))
			.thenReturn(new PageResult<>(List.of(photo), 0, 100, 1, 1, true));
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<PageResponseDto<PhotoResponseDto>> response = controller.pagedPhotos(
			sampleEvent().getId(),
			-9,
			999,
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().page()).isEqualTo(0);
		assertThat(response.getBody().size()).isEqualTo(100);
	}

	@Test
	void updatePhotoFavoriteRequiresValue() {
		assertThatThrownBy(() -> controller.updatePhotoFavorite(
			sampleEvent().getId(),
			samplePhoto().getId(),
			new PhotoFavoriteUpdateRequestDto(null),
			authentication
		)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void updatePhotoFavoriteReturnsMappedPhoto() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(updatePhotoFavoriteUseCase.execute(any())).thenReturn(photo);
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<PhotoResponseDto> response = controller.updatePhotoFavorite(
			sampleEvent().getId(),
			photo.getId(),
			new PhotoFavoriteUpdateRequestDto(true),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(photoResponse);
	}

	@Test
	void updatePhotoStatusRequiresValue() {
		assertThatThrownBy(() -> controller.updatePhotoStatus(
			sampleEvent().getId(),
			samplePhoto().getId(),
			new PhotoStatusUpdateRequestDto(null),
			authentication
		)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void updatePhotoStatusReturnsMappedPhoto() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(updatePhotoStatusUseCase.execute(any())).thenReturn(photo);
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<PhotoResponseDto> response = controller.updatePhotoStatus(
			sampleEvent().getId(),
			photo.getId(),
			new PhotoStatusUpdateRequestDto(PhotoStatus.HIDDEN),
			authentication
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(photoResponse);
	}

	private HttpServletRequest requestWithOrigin(String origin) {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("Origin", origin);
		return request;
	}

	private Event sampleEvent() {
		return Event.builder()
			.id(UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1"))
			.ownerId(UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879"))
			.type(EventType.WEDDING)
			.title("Isadora & Fernando")
			.slug("isa-fer")
			.eventDate(LocalDate.of(2026, 10, 8))
			.location("Campo Largo")
			.status(EventStatus.ACTIVE)
			.planCode(EventPlanCode.EVENT)
			.photoLimit(500)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private PaymentOrder samplePaymentOrder() {
		return PaymentOrder.builder()
			.id(UUID.fromString("87553897-2b22-4ed4-a6b9-e3d182669c70"))
			.eventId(sampleEvent().getId())
			.userId(UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879"))
			.planCode(EventPlanCode.EVENT)
			.provider(PaymentProvider.INFINITEPAY)
			.status(PaymentOrderStatus.PENDING)
			.externalReference("MEMORA-529205f4-3ed6-4cef-b5dc-b7d640aa4ab1-87553897-2b22-4ed4-a6b9-e3d182669c70")
			.orderNsu("MEMORA-529205f4-3ed6-4cef-b5dc-b7d640aa4ab1-87553897-2b22-4ed4-a6b9-e3d182669c70")
			.checkoutUrl("https://checkout.memora.app/pay/1")
			.amountCents(6990)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private EventPublicPageCustomization sampleCustomization() {
		return EventPublicPageCustomization.builder()
			.eventId(sampleEvent().getId())
			.title("Isadora & Fernando")
			.eventDate(LocalDate.of(2026, 10, 8))
			.welcomeMessage("Bem-vindos")
			.coverImageKey("cover.png")
			.highlightImageKeys(List.of("highlight-1.png"))
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private Photo samplePhoto() {
		return Photo.builder()
			.id(UUID.fromString("145f9554-f95b-4f0b-947f-b0af5d42d0d4"))
			.eventId(sampleEvent().getId())
			.originalFilename("foto.jpg")
			.objectKey("photos/foto.jpg")
			.contentType("image/jpeg")
			.sizeBytes(1024L)
			.status(PhotoStatus.AVAILABLE)
			.favorite(true)
			.likesCount(10)
			.guestName("Carlos")
			.guestMessage("Que dia lindo")
			.uploadGroupId(UUID.fromString("3adc3f3d-5f23-4c56-9c0b-695132fdbe68"))
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private PhotoResponseDto samplePhotoResponse() {
		return new PhotoResponseDto(
			UUID.fromString("145f9554-f95b-4f0b-947f-b0af5d42d0d4"),
			"foto.jpg",
			"photos/foto.jpg",
			"image/jpeg",
			1024L,
			PhotoStatus.AVAILABLE,
			true,
			10,
			"Carlos",
			"Que dia lindo",
			UUID.fromString("3adc3f3d-5f23-4c56-9c0b-695132fdbe68"),
			LocalDateTime.now(),
			"https://cdn/foto.jpg"
		);
	}
}
