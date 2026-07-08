package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.GetPublicEventParam;
import com.memora.core.domain.param.GetPublicEventCustomizationParam;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import com.memora.core.domain.param.ListPublicEventPhotosPageParam;
import com.memora.core.domain.param.ListPublicTopLikedPhotosParam;
import com.memora.core.domain.param.UpdatePublicPhotoLikeParam;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.core.usecase.GetPublicEventCustomizationUseCase;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.core.usecase.ListPublicEventPhotosPageUseCase;
import com.memora.core.usecase.ListPublicTopLikedPhotosUseCase;
import com.memora.core.usecase.UpdatePublicPhotoLikeUseCase;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.entrypoint.api.controller.definition.PublicEventControllerApi;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PublicEventResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.PhotoLikeUpdateRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.EventPublicPageCustomizationApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.entrypoint.api.mapper.PublicPhotoApiMapper;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import com.memora.shared.PublicUploadRateLimiter;
import com.memora.config.UploadProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicEventController implements PublicEventControllerApi {

	private final GetPublicEventUseCase getPublicEventUseCase;
	private final GetPublicEventCustomizationUseCase getPublicEventCustomizationUseCase;
	private final ListPublicEventPhotosUseCase listPublicEventPhotosUseCase;
	private final ListPublicEventPhotosPageUseCase listPublicEventPhotosPageUseCase;
	private final ListPublicTopLikedPhotosUseCase listPublicTopLikedPhotosUseCase;
	private final UpdatePublicPhotoLikeUseCase updatePublicPhotoLikeUseCase;
	private final UploadGuestPhotoUseCase uploadGuestPhotoUseCase;
	private final PublicUploadRateLimiter publicUploadRateLimiter;
	private final UploadProperties uploadProperties;
	private final PhotoApiMapper photoApiMapper;
	private final EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper;

	public PublicEventController(
		GetPublicEventUseCase getPublicEventUseCase,
		GetPublicEventCustomizationUseCase getPublicEventCustomizationUseCase,
		ListPublicEventPhotosUseCase listPublicEventPhotosUseCase,
		ListPublicEventPhotosPageUseCase listPublicEventPhotosPageUseCase,
		ListPublicTopLikedPhotosUseCase listPublicTopLikedPhotosUseCase,
		UpdatePublicPhotoLikeUseCase updatePublicPhotoLikeUseCase,
		UploadGuestPhotoUseCase uploadGuestPhotoUseCase,
		PublicUploadRateLimiter publicUploadRateLimiter,
		UploadProperties uploadProperties,
		PhotoApiMapper photoApiMapper,
		EventPublicPageCustomizationApiMapper eventPublicPageCustomizationApiMapper
	) {
		this.getPublicEventUseCase = getPublicEventUseCase;
		this.getPublicEventCustomizationUseCase = getPublicEventCustomizationUseCase;
		this.listPublicEventPhotosUseCase = listPublicEventPhotosUseCase;
		this.listPublicEventPhotosPageUseCase = listPublicEventPhotosPageUseCase;
		this.listPublicTopLikedPhotosUseCase = listPublicTopLikedPhotosUseCase;
		this.updatePublicPhotoLikeUseCase = updatePublicPhotoLikeUseCase;
		this.uploadGuestPhotoUseCase = uploadGuestPhotoUseCase;
		this.publicUploadRateLimiter = publicUploadRateLimiter;
		this.uploadProperties = uploadProperties;
		this.photoApiMapper = photoApiMapper;
		this.eventPublicPageCustomizationApiMapper = eventPublicPageCustomizationApiMapper;
	}

	@Override
	public ResponseEntity<PublicEventResponseDto> getPublicEvent(String slug) {
		Event event = getPublicEventUseCase.execute(new GetPublicEventParam(slug));
		return ResponseEntity.ok(EventApiMapper.toPublicResponse(event));
	}

	@Override
	public ResponseEntity<EventPublicPageCustomizationResponseDto> getPublicPageCustomization(String slug) {
		var customization = getPublicEventCustomizationUseCase.execute(new GetPublicEventCustomizationParam(slug));
		return ResponseEntity.ok(eventPublicPageCustomizationApiMapper.toResponse(customization));
	}

	@Override
	public ResponseEntity<List<PhotoResponseDto>> listPhotos(String slug) {
		List<PhotoResponseDto> photos = listPublicEventPhotosUseCase.execute(new ListPublicEventPhotosParam(slug))
			.stream()
			.map(photoApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(photos);
	}

	@Override
	public ResponseEntity<PageResponseDto<PhotoResponseDto>> listPagedPhotos(String slug, int page, int size) {
		PageResult<PhotoResponseDto> result = mapPhotoPage(
			listPublicEventPhotosPageUseCase.execute(new ListPublicEventPhotosPageParam(
				slug,
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
	public ResponseEntity<List<PhotoResponseDto>> listTopLikedPhotos(String slug) {
		List<PhotoResponseDto> photos = listPublicTopLikedPhotosUseCase.execute(new ListPublicTopLikedPhotosParam(slug))
			.stream()
			.map(photoApiMapper::toResponse)
			.toList();

		return ResponseEntity.ok(photos);
	}

	@Override
	public ResponseEntity<PhotoResponseDto> updatePhotoLike(String slug, UUID photoId, PhotoLikeUpdateRequestDto request) {
		if (request.liked() == null) {
			throw new IllegalArgumentException("Like value is required");
		}

		Photo photo = updatePublicPhotoLikeUseCase.execute(new UpdatePublicPhotoLikeParam(
			slug,
			photoId,
			request.liked()
		));

		return ResponseEntity.ok(photoApiMapper.toResponse(photo));
	}

	@Override
	public ResponseEntity<PublicGuestUploadResponseDto> uploadGuestPhoto(String slug, PublicGuestUploadRequestDto request, HttpServletRequest httpServletRequest) {
		List<MultipartFile> files = request.resolveFiles();
		boolean hasMessageOnly = request.getGuestMessage() != null && !request.getGuestMessage().isBlank();
		UUID uploadGroupId = UUID.randomUUID();

		if (files.isEmpty() && !hasMessageOnly) {
			throw new IllegalArgumentException("Send at least one photo or a guest message");
		}

		if (files.size() > uploadProperties.maxFilesPerRequest()) {
			throw new IllegalArgumentException("Too many files in a single upload request");
		}

		publicUploadRateLimiter.checkLimit(slug, resolveClientIp(httpServletRequest));

		List<Photo> uploadedPhotos = files.isEmpty()
			? List.of(uploadMessageOnly(slug, request, uploadGroupId))
			: files.stream().map(file -> uploadPhoto(slug, request, file, uploadGroupId)).toList();
		return ResponseEntity.status(HttpStatus.CREATED).body(PublicPhotoApiMapper.toBatchResponse(uploadedPhotos));
	}

	private Photo uploadMessageOnly(String slug, PublicGuestUploadRequestDto request, UUID uploadGroupId) {
		return uploadGuestPhotoUseCase.execute(new UploadGuestPhotoParam(
			slug,
			request.getGuestName(),
			request.getGuestMessage(),
			null,
			null,
			0,
			null,
			uploadGroupId
		));
	}

	private Photo uploadPhoto(String slug, PublicGuestUploadRequestDto request, MultipartFile file, UUID uploadGroupId) {
		try {
			return uploadGuestPhotoUseCase.execute(new UploadGuestPhotoParam(
				slug,
				request.getGuestName(),
				request.getGuestMessage(),
				file.getOriginalFilename(),
				file.getContentType(),
				file.getSize(),
				file.getBytes(),
				uploadGroupId
			));
		} catch (IOException exception) {
			throw new IllegalStateException("Unable to read uploaded file", exception);
		}
	}

	private String resolveClientIp(HttpServletRequest request) {
		String forwardedFor = request.getHeader("X-Forwarded-For");
		if (forwardedFor != null && !forwardedFor.isBlank()) {
			return forwardedFor.split(",")[0].trim();
		}

		return request.getRemoteAddr();
	}

	private int normalizePage(int page) {
		return Math.max(page, 0);
	}

	private int normalizeSize(int size) {
		return Math.min(Math.max(size, 1), 100);
	}

	private PageResult<PhotoResponseDto> mapPhotoPage(PageResult<Photo> result) {
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
