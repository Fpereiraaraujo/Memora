package com.memora.config;

import com.memora.entrypoint.api.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	private final CorsProperties corsProperties;

	public SecurityConfig(CorsProperties corsProperties) {
		this.corsProperties = corsProperties;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
		return http
			.cors(Customizer.withDefaults())
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(
				"/actuator/health",
				"/actuator/info",
				"/api/health",
				"/v3/api-docs/**",
				"/swagger-ui/**",
				"/swagger-ui.html",
				"/api/public/**",
				"/api/payments/infinitepay/webhook",
				"/uploads/**",
				"/api/auth/register",
				"/api/auth/login"
			)
				.permitAll()
				.anyRequest()
				.authenticated())
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
			.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(corsProperties.allowedOriginPatterns());
		configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(java.util.List.of("*"));
		configuration.setExposedHeaders(java.util.List.of("Content-Disposition"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
