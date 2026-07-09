package com.memora.shared;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.memora.config.UploadProperties;
import com.memora.entrypoint.api.exception.TooManyRequestsException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class PublicPhotoLikeRateLimiter {

	private final Cache<String, AtomicInteger> likesPerMinute;
	private final UploadProperties uploadProperties;

	public PublicPhotoLikeRateLimiter(UploadProperties uploadProperties) {
		this.uploadProperties = uploadProperties;
		this.likesPerMinute = Caffeine.newBuilder()
			.expireAfterWrite(Duration.ofMinutes(1))
			.maximumSize(20_000)
			.build();
	}

	public void checkLimit(String eventSlug, String photoId, String clientIp) {
		String key = eventSlug + ":" + photoId + ":" + clientIp;
		AtomicInteger attempts = likesPerMinute.get(key, ignored -> new AtomicInteger(0));
		int current = attempts.incrementAndGet();

		if (current > uploadProperties.likesPerMinutePerIp()) {
			throw new TooManyRequestsException("Muitas curtidas em pouco tempo. Tente novamente em instantes.");
		}
	}
}
