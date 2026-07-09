package com.memora.core.usecase.imp;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.core.usecase.UploadGuestPhotoUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import com.memora.dataprovider.storage.FileStorageService;
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
	private final UserRepository userRepository;
	private final FileStorageService fileStorageService;
	private final UploadProperties uploadProperties;
	private final EventFeatureAccessService eventFeatureAccessService;

	public UploadGuestPhotoUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		UserRepository userRepository,
		FileStorageService fileStorageService,
		UploadProperties uploadProperties,
		EventFeatureAccessService eventFeatureAccessService
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.userRepository = userRepository;
		this.fileStorageService = fileStorageService;
		this.uploadProperties = uploadProperties;
		this.eventFeatureAccessService = eventFeatureAccessService;
	}

	@Override
	public Photo execute(UploadGuestPhotoParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento nao encontrado."));

		boolean ownerActive = userRepository.findById(event.getOwnerId())
			.map(user -> user.getStatus() == com.memora.core.domain.model.UserStatus.ACTIVE)
			.orElse(false);
		if (!PublicEventAccessSupport.canOpenPublicFlow(event, ownerActive)) {
			throw new IllegalArgumentException("Este evento nao esta disponivel para receber fotos.");
		}

		if (event.getStorageExpiresAt() != null && event.getStorageExpiresAt().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
			throw new IllegalArgumentException("O periodo de armazenamento deste evento ja expirou.");
		}

		validateUpload(param);

		boolean hasFile = param.content() != null && param.content().length > 0;
		if (hasFile) {
			long currentPhotos = photoRepository.countByEventIdAndObjectKeyIsNotNull(event.getId());
			int photoLimit = eventFeatureAccessService.effectivePhotoLimit(event);
			if (currentPhotos >= photoLimit) {
				throw new IllegalArgumentException("Limite de fotos atingido. Escolha um plano para liberar mais envios.");
			}
		}

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
				throw new IllegalArgumentException("Selecione uma foto valida para enviar.");
			}

			if (param.sizeBytes() > uploadProperties.maxFileSizeBytes()) {
				throw new IllegalArgumentException("Cada envio aceita fotos de ate 20 MB. Tente novamente com uma imagem menor.");
			}

			String contentType = normalizeContentType(param.contentType());
			if (!uploadProperties.allowedContentTypes().contains(contentType)) {
				throw new IllegalArgumentException("Formato de arquivo nao suportado. Use JPG, PNG ou WEBP.");
			}
		}

		String guestName = param.guestName();
		if (guestName != null && guestName.isBlank()) {
			throw new IllegalArgumentException("O nome do convidado nao pode ficar em branco.");
		}

		String guestMessage = param.guestMessage();
		if (guestMessage != null && guestMessage.isBlank()) {
			throw new IllegalArgumentException("O recado do convidado nao pode ficar em branco.");
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
