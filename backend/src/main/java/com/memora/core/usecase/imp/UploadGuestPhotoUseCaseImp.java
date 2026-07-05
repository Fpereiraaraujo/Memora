package com.memora.core.usecase.imp;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.LocalFileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UploadGuestPhotoUseCaseImp implements UploadGuestPhotoUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final LocalFileStorageService localFileStorageService;
	private final UploadProperties uploadProperties;

	public UploadGuestPhotoUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		LocalFileStorageService localFileStorageService,
		UploadProperties uploadProperties
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.localFileStorageService = localFileStorageService;
		this.uploadProperties = uploadProperties;
	}

	@Override
	public Photo execute(UploadGuestPhotoParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (event.getStatus() != EventStatus.ACTIVE && event.getStatus() != EventStatus.DRAFT) {
			throw new IllegalArgumentException("Event is not accepting uploads");
		}

		validateUpload(param);

		String originalFilename = param.originalFilename() == null ? "photo" : param.originalFilename();
		String contentType = normalizeContentType(param.contentType());
		String extension = extractExtension(originalFilename);
		String objectKey = "events/" + event.getSlug() + "/photos/" + UUID.randomUUID() + extension;
		localFileStorageService.store(objectKey, param.content(), contentType);

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		Photo photo = Photo.builder()
			.id(UUID.randomUUID())
			.eventId(event.getId())
			.originalFilename(originalFilename)
			.objectKey(objectKey)
			.contentType(contentType)
			.sizeBytes(param.sizeBytes())
			.status(PhotoStatus.AVAILABLE)
			.favorite(false)
			.guestName(param.guestName())
			.guestMessage(param.guestMessage())
			.createdAt(now)
			.updatedAt(now)
			.build();

		return PhotoDatabaseMapper.toDomain(photoRepository.save(PhotoDatabaseMapper.toEntity(photo)));
	}

	private String extractExtension(String filename) {
		if (filename == null || !filename.contains(".")) {
			return "";
		}
		return filename.substring(filename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
	}

	private void validateUpload(UploadGuestPhotoParam param) {
		if (param.content() == null || param.content().length == 0) {
			throw new IllegalArgumentException("Photo file is required");
		}

		if (param.sizeBytes() <= 0) {
			throw new IllegalArgumentException("Photo file is required");
		}

		if (param.sizeBytes() > uploadProperties.maxFileSizeBytes()) {
			throw new IllegalArgumentException("Photo file exceeds maximum allowed size");
		}

		String contentType = normalizeContentType(param.contentType());
		if (!uploadProperties.allowedContentTypes().contains(contentType)) {
			throw new IllegalArgumentException("Unsupported photo content type");
		}

		String guestName = param.guestName();
		if (guestName != null && guestName.isBlank()) {
			throw new IllegalArgumentException("Guest name cannot be blank");
		}

		String guestMessage = param.guestMessage();
		if (guestMessage != null && guestMessage.isBlank()) {
			throw new IllegalArgumentException("Guest message cannot be blank");
		}
	}

	private String normalizeContentType(String contentType) {
		if (contentType == null) {
			return "";
		}

		return contentType.trim().toLowerCase(Locale.ROOT);
	}
}
