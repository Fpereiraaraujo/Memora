package com.memora.config;

import com.memora.core.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

	private final JwtProperties jwtProperties;
	private final SecretKey signingKey;

	public JwtTokenService(JwtProperties jwtProperties) {
		this.jwtProperties = jwtProperties;
		this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret()));
	}

	public String generateToken(User user) {
		Instant now = Instant.now();
		return Jwts.builder()
			.subject(user.getEmail())
			.issuer(jwtProperties.issuer())
			.claim("userId", user.getId().toString())
			.claim("role", user.getRole().name())
			.issuedAt(Date.from(now))
			.expiration(Date.from(now.plus(jwtProperties.expirationMinutes(), ChronoUnit.MINUTES)))
			.signWith(signingKey)
			.compact();
	}

	public String extractSubject(String token) {
		return parseClaims(token).getSubject();
	}

	public boolean isTokenValid(String token) {
		Claims claims = parseClaims(token);
		return claims.getExpiration() != null && claims.getExpiration().after(new Date());
	}

	public UUID extractUserId(String token) {
		return UUID.fromString(parseClaims(token).get("userId", String.class));
	}

	public String extractRole(String token) {
		return parseClaims(token).get("role", String.class);
	}

	private Claims parseClaims(String token) {
		return Jwts.parser()
			.verifyWith(signingKey)
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}
}
