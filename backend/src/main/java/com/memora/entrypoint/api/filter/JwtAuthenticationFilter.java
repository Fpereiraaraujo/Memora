package com.memora.entrypoint.api.filter;

import com.memora.config.JwtTokenService;
import com.memora.core.domain.model.User;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.usecase.GetCurrentUserUseCase;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenService jwtTokenService;
	private final GetCurrentUserUseCase getCurrentUserUseCase;

	public JwtAuthenticationFilter(JwtTokenService jwtTokenService, GetCurrentUserUseCase getCurrentUserUseCase) {
		this.jwtTokenService = jwtTokenService;
		this.getCurrentUserUseCase = getCurrentUserUseCase;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
		String authorizationHeader = request.getHeader("Authorization");
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authorizationHeader.substring(7);
		try {
			if (jwtTokenService.isTokenValid(token)) {
				String email = jwtTokenService.extractSubject(token);
				User user = getCurrentUserUseCase.execute(new GetCurrentUserParam(email));
				setAuthentication(request, user);
			}
		} catch (JwtException | IllegalArgumentException ignored) {
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}

	private void setAuthentication(HttpServletRequest request, User user) {
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
			user.getEmail(),
			null,
			List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
		);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
}
