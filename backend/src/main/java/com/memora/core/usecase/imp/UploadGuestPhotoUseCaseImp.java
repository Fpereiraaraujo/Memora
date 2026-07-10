package com.memora.core.usecase.imp;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
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
import com.memora.shared.ImageContentValidator;
import com.memora.shared.ImageContentValidator.ImageMetadata;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UploadGuestPhotoUseCaseImp implements UploadGuestPhotoUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(UploadGuestPhotoUseCaseImp.class);

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
		if (event.getStatus() != EventStatus.ACTIVE || event.getPlanCode() == null) {
			throw new IllegalArgumentException("Os envios serão liberados após a confirmação do plano do evento.");
		}

		if (event.getStorageExpiresAt() != null && event.getStorageExpiresAt().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
			throw new IllegalArgumentException("O periodo de armazenamento deste evento ja expirou.");
		}

		ImageMetadata imageMetadata = validateUpload(param);

		boolean hasFile = param.content() != null && param.content().length > 0;
		if (hasFile) {
			long currentPhotos = photoRepository.countByEventIdAndObjectKeyIsNotNull(event.getId());
			int photoLimit = eventFeatureAccessService.effectivePhotoLimit(event);
			if (currentPhotos >= photoLimit) {
				throw new IllegalArgumentException("Limite de fotos atingido. Escolha um plano para liberar mais envios.");
			}
		}

		String originalFilename = hasFile ? "photo" + imageMetadata.extension() : null;
		String contentType = hasFile ? imageMetadata.contentType() : null;
		String objectKey = null;

		if (hasFile) {
			objectKey = "events/" + event.getSlug() + "/photos/" + UUID.randomUUID() + imageMetadata.extension();
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
			.guestName(trimToNull(param.guestName()))
			.guestMessage(trimToNull(param.guestMessage()))
			.uploadGroupId(param.uploadGroupId())
			.createdAt(now)
			.updatedAt(now)
			.build();

		Photo savedPhoto = PhotoDatabaseMapper.toDomain(photoRepository.save(PhotoDatabaseMapper.toEntity(photo)));
		LOGGER.info("Guest content stored eventId={} photoId={} hasFile={} uploadGroupId={}",
			event.getId(), savedPhoto.getId(), hasFile, param.uploadGroupId());
		return savedPhoto;
	}

	private ImageMetadata validateUpload(UploadGuestPhotoParam param) {
		boolean hasFile = param.content() != null && param.content().length > 0;
		boolean hasMessage = param.guestMessage() != null && !param.guestMessage().isBlank();
		boolean hasName = param.guestName() != null && !param.guestName().isBlank();

		if (!hasFile && !hasMessage) {
			throw new IllegalArgumentException("Envie pelo menos uma foto ou um recado.");
		}
		if (hasName && !hasMessage) {
			throw new IllegalArgumentException("Escreva um recado ao informar seu nome.");
		}

		ImageMetadata imageMetadata = null;
		if (hasFile) {
			if (param.sizeBytes() <= 0) {
				throw new IllegalArgumentException("Selecione uma foto valida para enviar.");
			}

			if (param.sizeBytes() > uploadProperties.maxFileSizeBytes()) {
				throw new IllegalArgumentException("Cada envio aceita fotos de ate 20 MB. Tente novamente com uma imagem menor.");
			}

			imageMetadata = ImageContentValidator.validate(
				param.content(),
				param.contentType(),
				uploadProperties.allowedContentTypes()
			);
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

		return imageMetadata;
	}

	private String trimToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
