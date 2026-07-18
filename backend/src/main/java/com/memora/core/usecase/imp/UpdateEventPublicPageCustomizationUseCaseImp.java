package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UpdateEventPublicPageCustomizationParam;
import com.memora.core.usecase.UpdateEventPublicPageCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.shared.EventDatePolicy;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateEventPublicPageCustomizationUseCaseImp implements UpdateEventPublicPageCustomizationUseCase {

	private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;

	public UpdateEventPublicPageCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
	}

	@Override
	@Transactional
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public EventPublicPageCustomization execute(UpdateEventPublicPageCustomizationParam param) {
		EventDatePolicy.validateNotPast(param.eventDate());
		validateText(param.title(), 90, "título");
		validateText(param.welcomeMessage(), 420, "mensagem");
		validateOptionalColor(param.primaryColor(), "cor principal");
		validateOptionalColor(param.secondaryColor(), "cor secundária");
		validateOptionalColor(param.accentColor(), "cor de destaque");

		var currentEvent = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		var event = currentEvent.toBuilder()
			.title(param.title().trim())
			.eventDate(param.eventDate())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventRepository.save(EventDatabaseMapper.toEntity(event));

		var current = eventCustomizationRepository.findByEventId(param.eventId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(param.eventId()));
		var currentCustomization = EventPublicPageCustomizationSupport.toDomain(currentEvent, current);
		var templateCode = param.templateCode() == null
			? currentCustomization.getTemplateCode()
			: param.templateCode();
		boolean templateChanged = templateCode != currentCustomization.getTemplateCode();
		var identity = EventPublicPageCustomizationSupport.resolveVisualIdentity(
			templateCode,
			param.primaryColor() != null ? param.primaryColor() : templateChanged ? null : currentCustomization.getPrimaryColor(),
			param.secondaryColor() != null ? param.secondaryColor() : templateChanged ? null : currentCustomization.getSecondaryColor(),
			param.accentColor() != null ? param.accentColor() : templateChanged ? null : currentCustomization.getAccentColor(),
			param.decorationStyle() != null
				? param.decorationStyle().name()
				: templateChanged ? null : currentCustomization.getDecorationStyle().name()
		);

		var updated = current.toBuilder()
			.welcomeMessage(param.welcomeMessage().trim())
			.publicGalleryEnabled(
				param.publicGalleryEnabled() == null
					? currentCustomization.isPublicGalleryEnabled()
					: param.publicGalleryEnabled()
			)
			.templateCode(identity.templateCode().name())
			.primaryColor(identity.primaryColor())
			.secondaryColor(identity.secondaryColor())
			.accentColor(identity.accentColor())
			.decorationStyle(identity.decorationStyle().name())
			.decorativeImagePosition(
				param.decorativeImagePosition() == null
					? currentCustomization.getDecorativeImagePosition().name()
					: param.decorativeImagePosition().name()
			)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private void validateText(String value, int maxLength, String field) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException("Informe o campo " + field + ".");
		}
		if (value.length() > maxLength) {
			throw new IllegalArgumentException("O campo " + field + " excede o limite permitido.");
		}
		if (value.indexOf('<') >= 0 || value.indexOf('>') >= 0 || value.chars().anyMatch(Character::isISOControl)) {
			throw new IllegalArgumentException("O campo " + field + " contém caracteres inválidos.");
		}
	}

	private void validateOptionalColor(String value, String field) {
		if (value != null && !HEX_COLOR.matcher(value).matches()) {
			throw new IllegalArgumentException("Informe uma " + field + " válida.");
		}
	}
}
