package com.memora.shared;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

public final class ImageContentValidator {

	private ImageContentValidator() {
	}

	public static ImageMetadata validate(byte[] content, String declaredContentType, List<String> allowedContentTypes) {
		if (content == null || content.length == 0) {
			throw new IllegalArgumentException("Selecione uma imagem válida para enviar.");
		}

		ImageMetadata detected = detect(content);
		String normalizedDeclaredType = declaredContentType == null
			? ""
			: declaredContentType.trim().toLowerCase(Locale.ROOT);

		if (detected == null || !allowedContentTypes.contains(detected.contentType())) {
			throw new IllegalArgumentException("Formato de arquivo não suportado. Use JPG, PNG ou WEBP.");
		}

		if (!normalizedDeclaredType.isBlank() && !normalizedDeclaredType.equals(detected.contentType())) {
			throw new IllegalArgumentException("O conteúdo da imagem não corresponde ao formato informado.");
		}

		return detected;
	}

	private static ImageMetadata detect(byte[] content) {
		if (isJpeg(content)) {
			return new ImageMetadata("image/jpeg", ".jpg");
		}

		if (isPng(content)) {
			return new ImageMetadata("image/png", ".png");
		}

		if (isWebp(content)) {
			return new ImageMetadata("image/webp", ".webp");
		}

		return null;
	}

	private static boolean isJpeg(byte[] content) {
		return content.length >= 3
			&& unsigned(content[0]) == 0xFF
			&& unsigned(content[1]) == 0xD8
			&& unsigned(content[2]) == 0xFF;
	}

	private static boolean isPng(byte[] content) {
		int[] signature = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
		if (content.length < signature.length) {
			return false;
		}

		for (int index = 0; index < signature.length; index++) {
			if (unsigned(content[index]) != signature[index]) {
				return false;
			}
		}

		return true;
	}

	private static boolean isWebp(byte[] content) {
		return content.length >= 12
			&& ascii(content, 0, 4).equals("RIFF")
			&& ascii(content, 8, 4).equals("WEBP");
	}

	private static String ascii(byte[] content, int offset, int length) {
		return new String(content, offset, length, StandardCharsets.US_ASCII);
	}

	private static int unsigned(byte value) {
		return value & 0xFF;
	}

	public record ImageMetadata(String contentType, String extension) {
	}
}
