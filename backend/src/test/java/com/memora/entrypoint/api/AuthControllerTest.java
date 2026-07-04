package com.memora.entrypoint.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.memora.config.JwtAuthenticationFilter;
import com.memora.config.JwtTokenService;
import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.usecase.AuthenticateHostUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.memora.core.domain.port.UserRepositoryPort;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = true)
@Import({com.memora.config.SecurityConfig.class, ApiExceptionHandler.class, JwtAuthenticationFilter.class})
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RegisterHostUseCase registerHostUseCase;

	@MockBean
	private AuthenticateHostUseCase authenticateHostUseCase;

	@MockBean
	private GetCurrentUserUseCase getCurrentUserUseCase;

	@MockBean
	private JwtTokenService jwtTokenService;

	@MockBean
	private UserRepositoryPort userRepositoryPort;

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
	void shouldLoginHost() throws Exception {
		User user = User.builder()
			.id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
			.name("Ana Silva")
			.email("ana@example.com")
			.passwordHash("hash")
			.role(UserRole.HOST)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();

		when(authenticateHostUseCase.execute(any())).thenReturn(user);
		when(jwtTokenService.generateToken(user)).thenReturn("jwt-token");

		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "email": "ana@example.com",
					  "password": "SenhaForte123"
					}
					"""))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.token").value("jwt-token"))
			.andExpect(jsonPath("$.id").value("22222222-2222-2222-2222-222222222222"))
			.andExpect(jsonPath("$.name").value("Ana Silva"))
			.andExpect(jsonPath("$.email").value("ana@example.com"));
	}

	@Test
	@WithMockUser(username = "ana@example.com")
	void shouldReturnCurrentUser() throws Exception {
		when(getCurrentUserUseCase.execute(any())).thenReturn(
			User.builder()
				.id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
				.name("Ana Silva")
				.email("ana@example.com")
				.passwordHash("hash")
				.role(UserRole.HOST)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build()
		);

		mockMvc.perform(get("/api/me"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value("33333333-3333-3333-3333-333333333333"))
			.andExpect(jsonPath("$.name").value("Ana Silva"))
			.andExpect(jsonPath("$.email").value("ana@example.com"));
	}

	@Test
	@WithMockUser(username = "ana@example.com")
	void shouldLogoutHost() throws Exception {
		mockMvc.perform(post("/api/auth/logout"))
			.andExpect(status().isNoContent());
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
