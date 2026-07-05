package com.memora.shared;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.memora.config.UploadProperties;
import com.memora.entrypoint.api.exception.TooManyRequestsException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class PublicUploadRateLimiter {

	private final Cache<String, AtomicInteger> uploadsPerMinute;
	private final UploadProperties uploadProperties;

	public PublicUploadRateLimiter(UploadProperties uploadProperties) {
		this.uploadProperties = uploadProperties;
		this.uploadsPerMinute = Caffeine.newBuilder()
			.expireAfterWrite(Duration.ofMinutes(1))
			.maximumSize(10_000)
			.build();
	}

	public void checkLimit(String eventSlug, String clientIp) {
		String key = eventSlug + ":" + clientIp;
		AtomicInteger attempts = uploadsPerMinute.get(key, ignored -> new AtomicInteger(0));
		int current = attempts.incrementAndGet();

		if (current > uploadProperties.requestsPerMinutePerIp()) {
			throw new TooManyRequestsException("Too many upload attempts for this event");
		}
	}
}
