package com.memora.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.Test;

class ImageContentValidatorTest {

	private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

	@Test
	void detectsJpegFromMagicBytes() {
		var metadata = ImageContentValidator.validate(
			new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00 },
			"image/jpeg",
			ALLOWED_TYPES
		);

		assertThat(metadata.contentType()).isEqualTo("image/jpeg");
		assertThat(metadata.extension()).isEqualTo(".jpg");
	}

	@Test
	void rejectsDeclaredTypeThatDoesNotMatchFileSignature() {
		assertThatThrownBy(() -> ImageContentValidator.validate(
			new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00 },
			"image/png",
			ALLOWED_TYPES
		))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("não corresponde");
	}

	@Test
	void rejectsUnknownBinaryContent() {
		assertThatThrownBy(() -> ImageContentValidator.validate(
			new byte[] { 1, 2, 3, 4 },
			"image/jpeg",
			ALLOWED_TYPES
		))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("não suportado");
	}
}
