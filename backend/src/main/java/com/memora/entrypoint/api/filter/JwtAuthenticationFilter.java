package com.memora.entrypoint.api.filter;

import com.memora.config.JwtTokenService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	private final JwtTokenService jwtTokenService;

	public JwtAuthenticationFilter(JwtTokenService jwtTokenService) {
		this.jwtTokenService = jwtTokenService;
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
				setAuthentication(request, token);
			}
		} catch (JwtException | IllegalArgumentException exception) {
			LOGGER.warn("Ignoring invalid JWT token for request {} {}", request.getMethod(), request.getRequestURI());
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}

	private void setAuthentication(HttpServletRequest request, String token) {
		AuthenticatedUserPrincipal principal = new AuthenticatedUserPrincipal(
			jwtTokenService.extractUserId(token),
			jwtTokenService.extractSubject(token),
			jwtTokenService.extractRole(token)
		);

		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
			principal,
			null,
			List.of(new SimpleGrantedAuthority("ROLE_" + principal.role()))
		);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
}
