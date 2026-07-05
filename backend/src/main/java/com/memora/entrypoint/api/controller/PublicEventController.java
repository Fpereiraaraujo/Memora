package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.GetPublicEventParam;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import com.memora.core.domain.param.ListPublicEventPhotosPageParam;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.core.usecase.ListPublicEventPhotosPageUseCase;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.entrypoint.api.controller.definition.PublicEventControllerApi;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.entrypoint.api.dto.PublicEventResponseDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.entrypoint.api.mapper.PublicPhotoApiMapper;
import java.io.IOException;
import java.util.List;
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
	private final ListPublicEventPhotosUseCase listPublicEventPhotosUseCase;
	private final ListPublicEventPhotosPageUseCase listPublicEventPhotosPageUseCase;
	private final UploadGuestPhotoUseCase uploadGuestPhotoUseCase;
	private final PublicUploadRateLimiter publicUploadRateLimiter;
	private final UploadProperties uploadProperties;

	public PublicEventController(
		GetPublicEventUseCase getPublicEventUseCase,
		ListPublicEventPhotosUseCase listPublicEventPhotosUseCase,
		ListPublicEventPhotosPageUseCase listPublicEventPhotosPageUseCase,
		UploadGuestPhotoUseCase uploadGuestPhotoUseCase,
		PublicUploadRateLimiter publicUploadRateLimiter,
		UploadProperties uploadProperties
	) {
		this.getPublicEventUseCase = getPublicEventUseCase;
		this.listPublicEventPhotosUseCase = listPublicEventPhotosUseCase;
		this.listPublicEventPhotosPageUseCase = listPublicEventPhotosPageUseCase;
		this.uploadGuestPhotoUseCase = uploadGuestPhotoUseCase;
		this.publicUploadRateLimiter = publicUploadRateLimiter;
		this.uploadProperties = uploadProperties;
	}

	@Override
	public ResponseEntity<PublicEventResponseDto> getPublicEvent(String slug) {
		Event event = getPublicEventUseCase.execute(new GetPublicEventParam(slug));
		return ResponseEntity.ok(EventApiMapper.toPublicResponse(event));
	}

	@Override
	public ResponseEntity<List<PhotoResponseDto>> listPhotos(String slug) {
		List<PhotoResponseDto> photos = listPublicEventPhotosUseCase.execute(new ListPublicEventPhotosParam(slug))
			.stream()
			.map(PhotoApiMapper::toResponse)
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
	public ResponseEntity<PublicGuestUploadResponseDto> uploadGuestPhoto(String slug, PublicGuestUploadRequestDto request, HttpServletRequest httpServletRequest) {
		List<MultipartFile> files = request.resolveFiles();
		if (files.isEmpty()) {
			throw new IllegalArgumentException("At least one photo file is required");
		}

		if (files.size() > uploadProperties.maxFilesPerRequest()) {
			throw new IllegalArgumentException("Too many files in a single upload request");
		}

		publicUploadRateLimiter.checkLimit(slug, resolveClientIp(httpServletRequest));

		try {
			List<Photo> uploadedPhotos = files.stream()
				.map(file -> uploadPhoto(slug, request, file))
				.toList();
			return ResponseEntity.status(HttpStatus.CREATED).body(PublicPhotoApiMapper.toBatchResponse(uploadedPhotos));
		} catch (IOException exception) {
			throw new IllegalStateException("Unable to read uploaded file", exception);
		}
	}

	private Photo uploadPhoto(String slug, PublicGuestUploadRequestDto request, MultipartFile file) {
		try {
			return uploadGuestPhotoUseCase.execute(new UploadGuestPhotoParam(
				slug,
				request.getGuestName(),
				request.getGuestMessage(),
				file.getOriginalFilename(),
				file.getContentType(),
				file.getSize(),
				file.getBytes()
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
			result.content().stream().map(PhotoApiMapper::toResponse).toList(),
			result.page(),
			result.size(),
			result.totalElements(),
			result.totalPages(),
			result.last()
		);
	}
}
