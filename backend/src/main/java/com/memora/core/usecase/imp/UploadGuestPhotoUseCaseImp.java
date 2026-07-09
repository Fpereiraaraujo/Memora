package com.memora.core.usecase.imp;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.EventRepository;
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
	private final FileStorageService fileStorageService;
	private final UploadProperties uploadProperties;

	public UploadGuestPhotoUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		FileStorageService fileStorageService,
		UploadProperties uploadProperties
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.fileStorageService = fileStorageService;
		this.uploadProperties = uploadProperties;
	}

	@Override
	public Photo execute(UploadGuestPhotoParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		if (event.getStatus() != EventStatus.ACTIVE) {
			throw new IllegalArgumentException("Este evento ainda não está ativo para receber fotos.");
		}

		if (event.getPlanCode() == null || event.getPhotoLimit() == null) {
			throw new IllegalArgumentException("Este evento ainda não está pronto para receber fotos.");
		}

		if (event.getStorageExpiresAt() != null && event.getStorageExpiresAt().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
			throw new IllegalArgumentException("O período de armazenamento deste evento já expirou.");
		}

		if (event.getPhotoLimit() != null) {
			long currentPhotos = photoRepository.countByEventIdAndObjectKeyIsNotNull(event.getId());
			if (currentPhotos >= event.getPhotoLimit()) {
				throw new IllegalArgumentException("Limite de fotos do plano atingido.");
			}
		}

		validateUpload(param);

		boolean hasFile = param.content() != null && param.content().length > 0;
		String originalFilename = hasFile ? (param.originalFilename() == null ? "photo" : param.originalFilename()) : null;
		String contentType = hasFile ? normalizeContentType(param.contentType()) : null;
		String objectKey = null;

		if (hasFile) {
			String extension = extractExtension(originalFilename);
			objectKey = "events/" + event.getSlug() + "/photos/" + UUID.randomUUID() + extension;
			fileStorageService.store(objectKey, param.content(), contentType);
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		Photo photo = Photo.builder()
			.id(UUID.randomUUID())
			.eventId(event.getId())
			.originalFilename(originalFilename)
			.objectKey(objectKey)
			.contentType(contentType)
			.sizeBytes(param.sizeBytes())
			.status(hasFile ? PhotoStatus.AVAILABLE : PhotoStatus.RECEIVED)
			.favorite(false)
			.likesCount(0)
			.guestName(param.guestName())
			.guestMessage(param.guestMessage())
			.uploadGroupId(param.uploadGroupId())
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
		boolean hasFile = param.content() != null && param.content().length > 0;
		boolean hasMessage = param.guestMessage() != null && !param.guestMessage().isBlank();

		if (!hasFile && !hasMessage) {
			throw new IllegalArgumentException("Envie pelo menos uma foto ou um recado.");
		}

		if (hasFile) {
			if (param.sizeBytes() <= 0) {
				throw new IllegalArgumentException("Selecione uma foto válida para enviar.");
			}

			if (param.sizeBytes() > uploadProperties.maxFileSizeBytes()) {
				throw new IllegalArgumentException("Cada envio aceita fotos de até 20 MB. Tente novamente com uma imagem menor.");
			}

			String contentType = normalizeContentType(param.contentType());
			if (!uploadProperties.allowedContentTypes().contains(contentType)) {
				throw new IllegalArgumentException("Formato de arquivo não suportado. Use JPG, PNG ou WEBP.");
			}
		}

		String guestName = param.guestName();
		if (guestName != null && guestName.isBlank()) {
			throw new IllegalArgumentException("O nome do convidado não pode ficar em branco.");
		}

		String guestMessage = param.guestMessage();
		if (guestMessage != null && guestMessage.isBlank()) {
			throw new IllegalArgumentException("O recado do convidado não pode ficar em branco.");
		}

		if (guestMessage != null && guestMessage.length() > 500) {
			throw new IllegalArgumentException("O recado ultrapassou o limite de 500 caracteres.");
		}
	}

	private String normalizeContentType(String contentType) {
		if (contentType == null) {
			return "";
		}

		return contentType.trim().toLowerCase(Locale.ROOT);
	}
}
