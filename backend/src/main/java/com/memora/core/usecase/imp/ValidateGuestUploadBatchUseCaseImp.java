package com.memora.core.usecase.imp;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.ValidateGuestUploadBatchParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.core.usecase.ValidateGuestUploadBatchUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ValidateGuestUploadBatchUseCaseImp implements ValidateGuestUploadBatchUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final EventFeatureAccessService eventFeatureAccessService;
	private final UploadProperties uploadProperties;

	public ValidateGuestUploadBatchUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		UserRepository userRepository,
		EventFeatureAccessService eventFeatureAccessService,
		UploadProperties uploadProperties
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.userRepository = userRepository;
		this.eventFeatureAccessService = eventFeatureAccessService;
		this.uploadProperties = uploadProperties;
	}

	@Override
	public void execute(ValidateGuestUploadBatchParam param) {
		if (param.fileCount() < 0 || param.fileCount() > uploadProperties.maxFilesPerRequest()) {
			throw new IllegalArgumentException("Envie no máximo 5 fotos por vez.");
		}

		long maxBatchSize = uploadProperties.maxFileSizeBytes() * uploadProperties.maxFilesPerRequest();
		if (param.totalSizeBytes() < 0 || param.totalSizeBytes() > maxBatchSize) {
			throw new IllegalArgumentException("O conjunto de fotos ultrapassa o tamanho máximo permitido.");
		}

		var event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		boolean ownerActive = userRepository.findById(event.getOwnerId())
			.map(user -> user.getStatus() == UserStatus.ACTIVE)
			.orElse(false);
		if (!ownerActive || event.getStatus() != EventStatus.ACTIVE || event.getPlanCode() == null) {
			throw new IllegalArgumentException("Os envios serão liberados após a confirmação do plano do evento.");
		}

		if (event.getStorageExpiresAt() != null && event.getStorageExpiresAt().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
			throw new IllegalArgumentException("O período de armazenamento deste evento expirou.");
		}

		if (param.fileCount() > 0) {
			long currentPhotos = photoRepository.countByEventIdAndObjectKeyIsNotNull(event.getId());
			long remainingPhotos = eventFeatureAccessService.effectivePhotoLimit(event) - currentPhotos;
			if (param.fileCount() > remainingPhotos) {
				throw new IllegalArgumentException("Este envio ultrapassa o limite de fotos disponível no plano.");
			}
		}
	}
}
