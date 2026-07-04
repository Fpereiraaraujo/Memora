package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.GetPublicEventParam;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.entrypoint.api.controller.definition.PublicEventControllerApi;
import com.memora.entrypoint.api.dto.PublicEventResponseDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadRequestDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.entrypoint.api.mapper.PhotoApiMapper;
import com.memora.entrypoint.api.mapper.PublicPhotoApiMapper;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicEventController implements PublicEventControllerApi {

	private final GetPublicEventUseCase getPublicEventUseCase;
	private final ListPublicEventPhotosUseCase listPublicEventPhotosUseCase;
	private final UploadGuestPhotoUseCase uploadGuestPhotoUseCase;

	public PublicEventController(
		GetPublicEventUseCase getPublicEventUseCase,
		ListPublicEventPhotosUseCase listPublicEventPhotosUseCase,
		UploadGuestPhotoUseCase uploadGuestPhotoUseCase
	) {
		this.getPublicEventUseCase = getPublicEventUseCase;
		this.listPublicEventPhotosUseCase = listPublicEventPhotosUseCase;
		this.uploadGuestPhotoUseCase = uploadGuestPhotoUseCase;
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
	public ResponseEntity<PublicGuestUploadResponseDto> uploadGuestPhoto(String slug, PublicGuestUploadRequestDto request) {
		if (request.getFile() == null || request.getFile().isEmpty()) {
			throw new IllegalArgumentException("Photo file is required");
		}

		try {
			Photo photo = uploadGuestPhotoUseCase.execute(new UploadGuestPhotoParam(
				slug,
				request.getGuestName(),
				request.getGuestMessage(),
				request.getFile().getOriginalFilename(),
				request.getFile().getContentType(),
				request.getFile().getSize(),
				request.getFile().getBytes()
			));
			return ResponseEntity.status(HttpStatus.CREATED).body(PublicPhotoApiMapper.toResponse(photo));
		} catch (IOException exception) {
			throw new IllegalStateException("Unable to read uploaded file", exception);
		}
	}
}
