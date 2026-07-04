package com.memora.entrypoint.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.memora.config.JwtTokenService;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.entrypoint.api.controller.EventController;
import com.memora.entrypoint.api.exception.ApiExceptionHandler;
import com.memora.entrypoint.api.filter.JwtAuthenticationFilter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EventController.class)
@AutoConfigureMockMvc(addFilters = true)
@Import({com.memora.config.SecurityConfig.class, ApiExceptionHandler.class, JwtAuthenticationFilter.class})
class EventControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private GetCurrentUserUseCase getCurrentUserUseCase;

	@MockBean
	private CreateEventUseCase createEventUseCase;

	@MockBean
	private ListEventsUseCase listEventsUseCase;

	@MockBean
	private GetEventUseCase getEventUseCase;

	@MockBean
	private UpdateEventUseCase updateEventUseCase;

	@MockBean
	private JwtTokenService jwtTokenService;

	@Test
	@WithMockUser(username = "ana@example.com")
	void shouldCreateEvent() throws Exception {
		User user = User.builder()
			.id(UUID.fromString("44444444-4444-4444-4444-444444444444"))
			.name("Ana Silva")
			.email("ana@example.com")
			.passwordHash("hash")
			.role(UserRole.HOST)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();

		Event event = Event.builder()
			.id(UUID.fromString("55555555-5555-5555-5555-555555555555"))
			.ownerId(user.getId())
			.type(EventType.WEDDING)
			.title("Ana e Bruno")
			.slug("ana-e-bruno")
			.eventDate(LocalDate.of(2026, 12, 5))
			.location("Sao Paulo, SP")
			.status(EventStatus.DRAFT)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();

		when(getCurrentUserUseCase.execute(any())).thenReturn(user);
		when(createEventUseCase.execute(any())).thenReturn(event);

		mockMvc.perform(post("/api/events")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "type": "WEDDING",
					  "title": "Ana e Bruno",
					  "eventDate": "2026-12-05",
					  "location": "Sao Paulo, SP"
					}
					"""))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").value("55555555-5555-5555-5555-555555555555"))
			.andExpect(jsonPath("$.type").value("WEDDING"))
			.andExpect(jsonPath("$.title").value("Ana e Bruno"))
			.andExpect(jsonPath("$.slug").value("ana-e-bruno"))
			.andExpect(jsonPath("$.eventDate").value("2026-12-05"))
			.andExpect(jsonPath("$.location").value("Sao Paulo, SP"))
			.andExpect(jsonPath("$.status").value("DRAFT"));
	}

	@Test
	@WithMockUser(username = "ana@example.com")
	void shouldRejectInvalidPayload() throws Exception {
		mockMvc.perform(post("/api/events")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "type": null,
					  "title": "",
					  "eventDate": "2026-12-05",
					  "location": "Sao Paulo, SP"
					}
					"""))
			.andExpect(status().isBadRequest());
	}
}
