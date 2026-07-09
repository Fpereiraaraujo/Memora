package com.memora.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	public CacheManager cacheManager() {
		SimpleCacheManager cacheManager = new SimpleCacheManager();
		Map<String, CaffeineCache> caches = new HashMap<>();

		caches.put("publicEvents", new CaffeineCache(
			"publicEvents",
			Caffeine.newBuilder()
				.recordStats()
				.maximumSize(500)
				.expireAfterWrite(Duration.ofMinutes(5))
				.build()
		));

		caches.put("eventQrCodes", new CaffeineCache(
			"eventQrCodes",
			Caffeine.newBuilder()
				.recordStats()
				.maximumSize(500)
				.expireAfterWrite(Duration.ofDays(1))
				.build()
		));

		caches.put("currentUsers", new CaffeineCache(
			"currentUsers",
			Caffeine.newBuilder()
				.recordStats()
				.maximumSize(1_000)
				.expireAfterWrite(Duration.ofMinutes(10))
				.build()
		));

		cacheManager.setCaches(caches.values().stream().toList());
		return cacheManager;
	}
}
