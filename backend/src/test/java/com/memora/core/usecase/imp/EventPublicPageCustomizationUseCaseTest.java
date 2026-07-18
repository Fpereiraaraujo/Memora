package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventThemeTemplateCode;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.param.GetEventPublicPageCustomizationParam;
import com.memora.core.domain.param.UpdateEventPublicPageCustomizationParam;
import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventPublicPageCustomizationUseCaseTest {

	private static final UUID EVENT_ID = UUID.randomUUID();
	private static final UUID OWNER_ID = UUID.randomUUID();

	@Mock private EventRepository eventRepository;
	@Mock private EventCustomizationRepository customizationRepository;

	private GetEventPublicPageCustomizationUseCaseImp getUseCase;
	private UpdateEventPublicPageCustomizationUseCaseImp updateUseCase;

	@BeforeEach
	void setUp() {
		getUseCase = new GetEventPublicPageCustomizationUseCaseImp(eventRepository, customizationRepository);
		updateUseCase = new UpdateEventPublicPageCustomizationUseCaseImp(eventRepository, customizationRepository);
	}

	@Test
	void returnsCompleteClassicFallbackForEventWithoutCustomization() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.empty());

		var result = getUseCase.execute(new GetEventPublicPageCustomizationParam(OWNER_ID, EVENT_ID));

		assertThat(result.getTemplateCode()).isEqualTo(EventThemeTemplateCode.MEMORA_CLASSIC);
		assertThat(result.getPrimaryColor()).isEqualTo("#EF7885");
		assertThat(result.getSecondaryColor()).isEqualTo("#FFF3E6");
		assertThat(result.getAccentColor()).isEqualTo("#C5922E");
		assertThat(result.getDecorationStyle()).isEqualTo(EventDecorationStyle.HEARTS);
		assertThat(result.getDecorativeImagePosition()).isEqualTo(EventDecorativeImagePosition.HERO_RIGHT);
	}

	@Test
	void normalizesInvalidLegacyIdentityToClassicFallback() {
		var legacy = customization().toBuilder()
			.templateCode("BLUEY")
			.primaryColor("azul")
			.secondaryColor(null)
			.accentColor("#XYZ123")
			.decorationStyle("CHARACTER")
			.build();
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(legacy));

		var result = getUseCase.execute(new GetEventPublicPageCustomizationParam(OWNER_ID, EVENT_ID));

		assertThat(result.getTemplateCode()).isEqualTo(EventThemeTemplateCode.MEMORA_CLASSIC);
		assertThat(result.getPrimaryColor()).isEqualTo("#EF7885");
		assertThat(result.getDecorationStyle()).isEqualTo(EventDecorationStyle.HEARTS);
	}

	@Test
	void preservesCurrentIdentityWhenLegacyClientOmitsNewFields() {
		var current = customization().toBuilder()
			.templateCode(EventThemeTemplateCode.KIDS_SKY.name())
			.primaryColor("#123456")
			.secondaryColor("#D9EFFF")
			.accentColor("#FFD66B")
			.decorationStyle(EventDecorationStyle.CLOUDS_STARS.name())
			.decorativeImagePosition(EventDecorativeImagePosition.PAGE_TOP_RIGHT.name())
			.publicGalleryEnabled(false)
			.build();
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(current));
		when(customizationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var result = updateUseCase.execute(updateParam(null, null, null, null, null));

		assertThat(result.getTemplateCode()).isEqualTo(EventThemeTemplateCode.KIDS_SKY);
		assertThat(result.getPrimaryColor()).isEqualTo("#123456");
		assertThat(result.getDecorationStyle()).isEqualTo(EventDecorationStyle.CLOUDS_STARS);
		assertThat(result.getDecorativeImagePosition()).isEqualTo(EventDecorativeImagePosition.PAGE_TOP_RIGHT);
		assertThat(result.isPublicGalleryEnabled()).isFalse();
	}

	@Test
	void appliesTemplateDefaultsWhenTemplateChangesWithoutColorOverrides() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(customization()));
		when(customizationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var result = updateUseCase.execute(updateParam(
			EventThemeTemplateCode.KIDS_SKY,
			null,
			null,
			null,
			null
		));

		assertThat(result.getTemplateCode()).isEqualTo(EventThemeTemplateCode.KIDS_SKY);
		assertThat(result.getPrimaryColor()).isEqualTo("#6AAEE8");
		assertThat(result.getSecondaryColor()).isEqualTo("#D9EFFF");
		assertThat(result.getAccentColor()).isEqualTo("#FFD66B");
		assertThat(result.getDecorationStyle()).isEqualTo(EventDecorationStyle.CLOUDS_STARS);
	}

	@Test
	void rejectsUnsafeTextAndInvalidColorsBeforePersisting() {
		var invalid = new UpdateEventPublicPageCustomizationParam(
			OWNER_ID,
			EVENT_ID,
			"<b>Leonardo</b>",
			LocalDate.now().plusDays(10),
			"Bem-vindos",
			true,
			EventThemeTemplateCode.KIDS_SKY,
			"azul",
			null,
			null,
			null,
			null
		);

		assertThatThrownBy(() -> updateUseCase.execute(invalid))
			.isInstanceOf(IllegalArgumentException.class);
		verify(eventRepository, never()).save(any());
		verify(customizationRepository, never()).save(any());
	}

	@Test
	void blocksAccessToAnotherOwnersEvent() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> getUseCase.execute(new GetEventPublicPageCustomizationParam(OWNER_ID, EVENT_ID)))
			.isInstanceOf(NoSuchElementException.class);
	}

	private UpdateEventPublicPageCustomizationParam updateParam(
		EventThemeTemplateCode templateCode,
		String primaryColor,
		String secondaryColor,
		String accentColor,
		EventDecorationStyle decorationStyle
	) {
		return new UpdateEventPublicPageCustomizationParam(
			OWNER_ID,
			EVENT_ID,
			"Leonardo 2 anos",
			LocalDate.now().plusDays(10),
			"Ajude a guardar as memórias desse dia especial",
			null,
			templateCode,
			primaryColor,
			secondaryColor,
			accentColor,
			decorationStyle,
			null
		);
	}

	private EventCustomizationJpaEntity customization() {
		return EventCustomizationJpaEntity.builder()
			.id(UUID.randomUUID())
			.eventId(EVENT_ID)
			.welcomeMessage("Bem-vindos")
			.templateCode(EventThemeTemplateCode.MEMORA_CLASSIC.name())
			.primaryColor("#EF7885")
			.secondaryColor("#FFF3E6")
			.accentColor("#C5922E")
			.decorationStyle(EventDecorationStyle.HEARTS.name())
			.publicGalleryEnabled(true)
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private EventJpaEntity event() {
		LocalDateTime now = LocalDateTime.now();
		return EventJpaEntity.builder()
			.id(EVENT_ID)
			.ownerId(OWNER_ID)
			.type(EventType.BIRTHDAY)
			.title("Leonardo 2 anos")
			.slug("leonardo-2-anos")
			.eventDate(LocalDate.now().plusDays(10))
			.location("Espaço Azul")
			.status(EventStatus.ACTIVE)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
