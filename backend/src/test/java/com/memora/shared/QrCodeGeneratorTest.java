package com.memora.shared;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class QrCodeGeneratorTest {

	@Test
	void generatePngReturnsValidPngBytes() {
		QrCodeGenerator generator = new QrCodeGenerator();

		byte[] result = generator.generatePng("https://memora.app/e/isadora-fernando/upload", 320);

		assertThat(result).isNotEmpty();
		assertThat(result[0]).isEqualTo((byte) 0x89);
		assertThat(result[1]).isEqualTo((byte) 0x50);
		assertThat(result[2]).isEqualTo((byte) 0x4E);
		assertThat(result[3]).isEqualTo((byte) 0x47);
	}
}
