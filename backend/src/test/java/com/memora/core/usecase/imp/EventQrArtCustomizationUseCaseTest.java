package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import com.memora.core.domain.param.GetEventQrArtCustomizationParam;
import com.memora.core.domain.param.UpdateEventQrArtCustomizationParam;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.EventQrArtCustomizationJpaEntity;
import com.memora.dataprovider.database.repository.EventQrArtCustomizationRepository;
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
class EventQrArtCustomizationUseCaseTest {

	private static final UUID EVENT_ID = UUID.randomUUID();
	private static final UUID OWNER_ID = UUID.randomUUID();

	@Mock private EventRepository eventRepository;
	@Mock private EventQrArtCustomizationRepository customizationRepository;

	private GetEventQrArtCustomizationUseCaseImp getUseCase;
	private UpdateEventQrArtCustomizationUseCaseImp updateUseCase;

	@BeforeEach
	void setUp() {
		getUseCase = new GetEventQrArtCustomizationUseCaseImp(eventRepository, customizationRepository);
		updateUseCase = new UpdateEventQrArtCustomizationUseCaseImp(eventRepository, customizationRepository);
	}

	@Test
	void returnsBirthdayDefaultsWithoutPersisting() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.empty());

		var result = getUseCase.execute(new GetEventQrArtCustomizationParam(OWNER_ID, EVENT_ID));

		assertThat(result.getTitle()).isEqualTo("Leonardo 2 anos");
		assertThat(result.getSubtitle()).isEqualTo("Celebração de aniversário");
		assertThat(result.getTemplateCode()).isEqualTo(QrArtTemplateCode.PARTY_FUN);
		assertThat(result.getFormat()).isEqualTo(QrArtFormat.A5_VERTICAL);
		assertThat(result.isShowMemoraBranding()).isTrue();
		verify(customizationRepository, never()).save(any());
	}

	@Test
	void blocksAccessToAnotherOwnersEvent() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> getUseCase.execute(new GetEventQrArtCustomizationParam(OWNER_ID, EVENT_ID)))
			.isInstanceOf(NoSuchElementException.class)
			.hasMessage("Evento não encontrado.");
	}

	@Test
	void savesNormalizedCustomization() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.empty());
		when(customizationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var result = updateUseCase.execute(validParam());

		assertThat(result.getTitle()).isEqualTo("Leonardo 2 anos");
		assertThat(result.getThemeName()).isEqualTo("Festa azul");
		assertThat(result.getPrimaryColor()).isEqualTo("#DCEEFF");
		assertThat(result.getTemplateCode()).isEqualTo(QrArtTemplateCode.KIDS_BLUE);
		assertThat(result.getVisualStyle()).isEqualTo(QrArtVisualStyle.KIDS);
		verify(customizationRepository).save(any(EventQrArtCustomizationJpaEntity.class));
	}

	@Test
	void rejectsHtmlAndInvalidColors() {
		var invalid = new UpdateEventQrArtCustomizationParam(
			OWNER_ID,
			EVENT_ID,
			"<b>Leonardo</b>",
			"Aniversário",
			"Escaneie e envie suas fotos",
			"Uma lembrança especial",
			null,
			"azul",
			"#FFFFFF",
			"#F5B82E",
			QrArtVisualStyle.KIDS,
			QrArtTemplateCode.KIDS_BLUE,
			QrArtFormat.A5_VERTICAL,
			true,
			false,
			false
		);
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));

		assertThatThrownBy(() -> updateUseCase.execute(invalid))
			.isInstanceOf(IllegalArgumentException.class);
		verify(customizationRepository, never()).save(any());
	}

	private UpdateEventQrArtCustomizationParam validParam() {
		return new UpdateEventQrArtCustomizationParam(
			OWNER_ID,
			EVENT_ID,
			" Leonardo 2 anos ",
			" Aniversário do Leonardo ",
			" Escaneie e envie suas fotos ",
			" Ajude a guardar as memórias desse dia especial ",
			" Festa azul ",
			"#dceeff",
			"#FFFFFF",
			"#F5B82E",
			QrArtVisualStyle.KIDS,
			QrArtTemplateCode.KIDS_BLUE,
			QrArtFormat.A5_VERTICAL,
			true,
			true,
			false
		);
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
