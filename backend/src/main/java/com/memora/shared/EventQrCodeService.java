package com.memora.shared;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class EventQrCodeService {

	private final QrCodeGenerator qrCodeGenerator;

	public EventQrCodeService(QrCodeGenerator qrCodeGenerator) {
		this.qrCodeGenerator = qrCodeGenerator;
	}

	@Cacheable(cacheNames = "eventQrCodes", key = "#publicUrl + ':' + #size")
	public byte[] generateCachedPng(String publicUrl, int size) {
		return qrCodeGenerator.generatePng(publicUrl, size);
	}
}
