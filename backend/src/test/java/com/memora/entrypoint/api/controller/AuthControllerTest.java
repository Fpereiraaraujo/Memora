package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.JwtTokenService;
import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.usecase.AuthenticateHostUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.RegisterHostUseCase;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.dto.UserLoginRequestDto;
import com.memora.entrypoint.api.dto.UserLoginResponseDto;
import com.memora.entrypoint.api.dto.UserProfileResponseDto;
import com.memora.entrypoint.api.dto.UserRegisterRequestDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

	@Mock
	private RegisterHostUseCase registerHostUseCase;

	@Mock
	private AuthenticateHostUseCase authenticateHostUseCase;

	@Mock
	private GetCurrentUserUseCase getCurrentUserUseCase;

	@Mock
	private JwtTokenService jwtTokenService;

	private AuthController controller;

	@BeforeEach
	void setUp() {
		controller = new AuthController(
			registerHostUseCase,
			authenticateHostUseCase,
			getCurrentUserUseCase,
			jwtTokenService
		);
	}

	@Test
	void registerCreatesHost() {
		User user = sampleUser();
		when(registerHostUseCase.execute(any())).thenReturn(user);

		ResponseEntity<UserRegisterResponseDto> response = controller.register(
			new UserRegisterRequestDto("Isadora", "isa@memora.app", "senha-forte-123")
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().email()).isEqualTo("isa@memora.app");
	}

	@Test
	void loginReturnsJwtToken() {
		User user = sampleUser();
		when(authenticateHostUseCase.execute(any())).thenReturn(user);
		when(jwtTokenService.generateToken(user)).thenReturn("jwt-token");

		ResponseEntity<UserLoginResponseDto> response = controller.login(
			new UserLoginRequestDto("isa@memora.app", "senha-forte-123")
		);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().token()).isEqualTo("jwt-token");
	}

	@Test
	void logoutReturnsNoContentWhenAuthenticated() {
		Authentication authentication = auth();

		ResponseEntity<Void> response = controller.logout(authentication);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
	}

	@Test
	void meReturnsCurrentProfile() {
		User user = sampleUser();
		when(getCurrentUserUseCase.execute(any())).thenReturn(user);

		ResponseEntity<UserProfileResponseDto> response = controller.me(auth());

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().name()).isEqualTo("Isadora");
	}

	@Test
	void meRejectsMissingAuthentication() {
		assertThatThrownBy(() -> controller.me(null)).isInstanceOf(SecurityException.class);
	}

	private Authentication auth() {
		return new TestingAuthenticationToken(
			new AuthenticatedUserPrincipal(
				UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879"),
				"isa@memora.app",
				"HOST"
			),
			null
		);
	}

	private User sampleUser() {
		return User.builder()
			.id(UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879"))
			.name("Isadora")
			.email("isa@memora.app")
			.passwordHash("hash")
			.role(UserRole.HOST)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
	}
}
