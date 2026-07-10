package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.usecase.GetPublicEventCustomizationUseCase;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.core.usecase.ListPublicEventPhotosPageUseCase;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.core.usecase.ListPublicTopLikedPhotosUseCase;
import com.memora.core.usecase.UpdatePublicPhotoLikeUseCase;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.core.usecase.ValidateGuestUploadBatchUseCase;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.PhotoLikeUpdateRequestDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.dto.PublicEventResponseDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import com.memora.entrypoint.api.mapper.EventPublicPageCustomizationApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.shared.PublicPhotoLikeRateLimiter;
import com.memora.shared.PublicUploadRateLimiter;
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
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class PublicEventControllerTest {

	@Mock
	private GetPublicEventUseCase getPublicEventUseCase;

	@Mock
	private GetPublicEventCustomizationUseCase getPublicEventCustomizationUseCase;

	@Mock
	private ListPublicEventPhotosUseCase listPublicEventPhotosUseCase;

	@Mock
	private ListPublicEventPhotosPageUseCase listPublicEventPhotosPageUseCase;

	@Mock
	private ListPublicTopLikedPhotosUseCase listPublicTopLikedPhotosUseCase;

	@Mock
	private UpdatePublicPhotoLikeUseCase updatePublicPhotoLikeUseCase;

	@Mock
	private UploadGuestPhotoUseCase uploadGuestPhotoUseCase;

	@Mock
	private ValidateGuestUploadBatchUseCase validateGuestUploadBatchUseCase;

	@Mock
	private PublicUploadRateLimiter publicUploadRateLimiter;

	@Mock
	private PublicPhotoLikeRateLimiter publicPhotoLikeRateLimiter;

	@Mock
	private PhotoApiMapper photoApiMapper;

	@Mock
	private EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper;

	private PublicEventController controller;

	@BeforeEach
	void setUp() {
		controller = new PublicEventController(
			getPublicEventUseCase,
			getPublicEventCustomizationUseCase,
			listPublicEventPhotosUseCase,
			listPublicEventPhotosPageUseCase,
			listPublicTopLikedPhotosUseCase,
			updatePublicPhotoLikeUseCase,
			uploadGuestPhotoUseCase,
			validateGuestUploadBatchUseCase,
			publicUploadRateLimiter,
			publicPhotoLikeRateLimiter,
			new UploadProperties(20_971_520L, List.of("image/jpeg", "image/png"), 10, 30, 5),
			photoApiMapper,
			eventPublicPageCustomizationApiMapper
		);
	}

	@Test
	void getPublicEventReturnsMappedEvent() {
		when(getPublicEventUseCase.execute(any())).thenReturn(sampleEvent());

		ResponseEntity<PublicEventResponseDto> response = controller.getPublicEvent("isa-fer");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().slug()).isEqualTo("isa-fer");
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
		when(getPublicEventCustomizationUseCase.execute(any())).thenReturn(customization);
		when(eventPublicPageCustomizationApiMapper.toResponse(customization)).thenReturn(dto);

		ResponseEntity<EventPublicPageCustomizationResponseDto> response = controller.getPublicPageCustomization("isa-fer");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(dto);
	}

	@Test
	void listPhotosReturnsMappedItems() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(listPublicEventPhotosUseCase.execute(any())).thenReturn(List.of(photo));
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<List<PhotoResponseDto>> response = controller.listPhotos("isa-fer");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).containsExactly(photoResponse);
	}

	@Test
	void listPagedPhotosNormalizesPageAndSize() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(listPublicEventPhotosPageUseCase.execute(any()))
			.thenReturn(new PageResult<>(List.of(photo), 0, 100, 1, 1, true));
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<?> response = controller.listPagedPhotos("isa-fer", -2, 999);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		verify(listPublicEventPhotosPageUseCase).execute(any());
	}

	@Test
	void listTopLikedPhotosReturnsMappedItems() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		when(listPublicTopLikedPhotosUseCase.execute(any())).thenReturn(List.of(photo));
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<List<PhotoResponseDto>> response = controller.listTopLikedPhotos("isa-fer");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).containsExactly(photoResponse);
	}

	@Test
	void updatePhotoLikeUsesRateLimiterAndReturnsMappedPhoto() {
		Photo photo = samplePhoto();
		PhotoResponseDto photoResponse = samplePhotoResponse();
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setRemoteAddr("127.0.0.1");
		when(updatePublicPhotoLikeUseCase.execute(any())).thenReturn(photo);
		when(photoApiMapper.toResponse(photo)).thenReturn(photoResponse);

		ResponseEntity<PhotoResponseDto> response = controller.updatePhotoLike(
			"isa-fer",
			photo.getId(),
			new PhotoLikeUpdateRequestDto(true),
			request
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isEqualTo(photoResponse);
		verify(publicPhotoLikeRateLimiter).checkLimit("isa-fer", photo.getId().toString(), "127.0.0.1");
	}

	@Test
	void uploadGuestPhotoAcceptsMessageOnly() {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setRemoteAddr("127.0.0.1");
		PublicGuestUploadRequestDto uploadRequest = new PublicGuestUploadRequestDto();
		uploadRequest.setGuestName("Carlos");
		uploadRequest.setGuestMessage("Que dia lindo");
		when(uploadGuestPhotoUseCase.execute(any())).thenReturn(samplePhoto().toBuilder().objectKey(null).build());

		ResponseEntity<PublicGuestUploadResponseDto> response = controller.uploadGuestPhoto("isa-fer", uploadRequest, request);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().uploadedCount()).isEqualTo(1);
		verify(publicUploadRateLimiter).checkLimit("isa-fer", "127.0.0.1");
	}

	@Test
	void uploadGuestPhotoRejectsMoreThanFiveFiles() {
		PublicGuestUploadRequestDto uploadRequest = new PublicGuestUploadRequestDto();
		uploadRequest.setFiles(List.of(
			file("1.jpg"), file("2.jpg"), file("3.jpg"), file("4.jpg"), file("5.jpg"), file("6.jpg")
		));

		assertThatThrownBy(() -> controller.uploadGuestPhoto("isa-fer", uploadRequest, new MockHttpServletRequest()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("no máximo 5 fotos");
	}

	private MockMultipartFile file(String name) {
		return new MockMultipartFile("files", name, "image/jpeg", new byte[] {1, 2, 3});
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

	private EventPublicPageCustomization sampleCustomization() {
		return EventPublicPageCustomization.builder()
			.eventId(UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1"))
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
			.eventId(UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1"))
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
