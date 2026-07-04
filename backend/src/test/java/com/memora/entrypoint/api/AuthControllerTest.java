package com.memora.entrypoint.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.usecase.RegisterHostUseCase;
import com.memora.entrypoint.api.controller.AuthController;
import java.time.LocalDateTime;
import java.util.UUID;

import com.memora.entrypoint.api.exception.ApiExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = true)
@Import({com.memora.config.SecurityConfig.class, ApiExceptionHandler.class})
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RegisterHostUseCase registerHostUseCase;

	@Test
	void shouldRegisterHost() throws Exception {
		when(registerHostUseCase.execute(any())).thenReturn(
			User.builder()
				.id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
				.name("Ana Silva")
				.email("ana@example.com")
				.passwordHash("hash")
				.role(UserRole.HOST)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build()
		);

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "name": "Ana Silva",
					  "email": "ana@example.com",
					  "password": "SenhaForte123"
					}
					"""))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").value("11111111-1111-1111-1111-111111111111"))
			.andExpect(jsonPath("$.name").value("Ana Silva"))
			.andExpect(jsonPath("$.email").value("ana@example.com"));
	}

	@Test
	void shouldRejectInvalidPayload() throws Exception {
		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "name": "",
					  "email": "invalid-email",
					  "password": "123"
					}
					"""))
			.andExpect(status().isBadRequest());
	}
}
