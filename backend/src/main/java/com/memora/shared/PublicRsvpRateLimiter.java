package com.memora.shared;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.memora.entrypoint.api.exception.TooManyRequestsException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class PublicRsvpRateLimiter {
	private final Cache<String, AtomicInteger> attempts = Caffeine.newBuilder().expireAfterWrite(Duration.ofMinutes(1)).maximumSize(20_000).build();

	public void checkLimit(String invitationToken, String clientIp) {
		int current = attempts.get(invitationToken + ":" + clientIp, ignored -> new AtomicInteger()).incrementAndGet();
		if (current > 8) throw new TooManyRequestsException("Muitas tentativas de confirmação. Tente novamente em instantes.");
	}
}
