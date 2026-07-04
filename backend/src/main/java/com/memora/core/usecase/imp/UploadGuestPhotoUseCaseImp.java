package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
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
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UploadGuestPhotoUseCaseImp implements UploadGuestPhotoUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final LocalFileStorageService localFileStorageService;

	public UploadGuestPhotoUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		LocalFileStorageService localFileStorageService
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.localFileStorageService = localFileStorageService;
	}

	@Override
	public Photo execute(UploadGuestPhotoParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		String originalFilename = param.originalFilename() == null ? "photo" : param.originalFilename();
		String contentType = param.contentType() == null ? "application/octet-stream" : param.contentType();
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
		return filename.substring(filename.lastIndexOf('.'));
	}
}
