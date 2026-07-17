package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.param.UpdateEventQrArtCustomizationParam;
import com.memora.core.usecase.UpdateEventQrArtCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventQrArtCustomizationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventQrArtCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateEventQrArtCustomizationUseCaseImp implements UpdateEventQrArtCustomizationUseCase {

	private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

	private final EventRepository eventRepository;
	private final EventQrArtCustomizationRepository customizationRepository;

	public UpdateEventQrArtCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventQrArtCustomizationRepository customizationRepository
	) {
		this.eventRepository = eventRepository;
		this.customizationRepository = customizationRepository;
	}

	@Override
	@Transactional
	public EventQrArtCustomization execute(UpdateEventQrArtCustomizationParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		validate(param);

		EventQrArtCustomization current = customizationRepository.findByEventId(param.eventId())
			.map(entity -> EventQrArtCustomizationDatabaseMapper.toDomain(event, entity))
			.orElseGet(() -> EventQrArtCustomizationSupport.createDefault(event));
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

		EventQrArtCustomization updated = current.toBuilder()
			.title(param.title().trim())
			.subtitle(normalize(param.subtitle()))
			.callToAction(param.callToAction().trim())
			.message(normalize(param.message()))
			.themeName(normalize(param.themeName()))
			.primaryColor(param.primaryColor().toUpperCase())
			.secondaryColor(normalizeColor(param.secondaryColor()))
			.accentColor(normalizeColor(param.accentColor()))
			.visualStyle(param.visualStyle())
			.templateCode(param.templateCode())
			.format(param.format())
			.showMemoraBranding(param.showMemoraBranding())
			.showEventDate(param.showEventDate())
			.showEventLocation(param.showEventLocation())
			.updatedAt(now)
			.build();

		var saved = customizationRepository.save(EventQrArtCustomizationDatabaseMapper.toEntity(updated));
		return EventQrArtCustomizationDatabaseMapper.toDomain(event, saved);
	}

	private void validate(UpdateEventQrArtCustomizationParam param) {
		requireText(param.title(), 80, "título");
		requireText(param.callToAction(), 120, "chamada");
		validateOptionalText(param.subtitle(), 100, "subtítulo");
		validateOptionalText(param.message(), 180, "mensagem");
		validateOptionalText(param.themeName(), 80, "tema");
		requireColor(param.primaryColor(), "cor principal");
		requireColor(param.secondaryColor(), "cor secundária");
		requireColor(param.accentColor(), "cor de destaque");

		if (param.visualStyle() == null || param.templateCode() == null || param.format() == null) {
			throw new IllegalArgumentException("Estilo, template e formato são obrigatórios.");
		}
	}

	private void requireText(String value, int maxLength, String field) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException("Informe o " + field + " da arte.");
		}
		validateText(value, maxLength, field);
	}

	private void validateOptionalText(String value, int maxLength, String field) {
		if (value != null && !value.isBlank()) {
			validateText(value, maxLength, field);
		}
	}

	private void validateText(String value, int maxLength, String field) {
		if (value.length() > maxLength) {
			throw new IllegalArgumentException("O campo " + field + " excede o limite permitido.");
		}
		if (value.indexOf('<') >= 0 || value.indexOf('>') >= 0 || value.chars().anyMatch(Character::isISOControl)) {
			throw new IllegalArgumentException("O campo " + field + " contém caracteres inválidos.");
		}
	}

	private void requireColor(String value, String field) {
		if (value == null || !HEX_COLOR.matcher(value).matches()) {
			throw new IllegalArgumentException("Informe uma " + field + " válida.");
		}
	}

	private String normalize(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	private String normalizeColor(String value) {
		return value.toUpperCase();
	}
}
